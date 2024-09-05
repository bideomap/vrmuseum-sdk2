import { SceneComponent, ComponentOutput } from "../SceneComponent";

import { Texture, VideoTexture } from "three";


type Inputs = {
  src: MediaStream | string | HTMLVideoElement | null;
  enabled: boolean;
  isWebm: boolean;
  webmSrc: string;
  videoMutedInDefault: boolean;
  BGMSrc: string;
  isMuted: boolean;
  isAutoBGMplay: boolean;
  isIOS : boolean;
};

type Outputs = {
  texture: Texture | null;
  enabled: boolean;
} & ComponentOutput;

export class VideoRenderer extends SceneComponent {
  public video: HTMLVideoElement;
  private texture: VideoTexture;
  //private audio: HTMLAudioElement; // 소리 받기용

  inputs: Inputs = {
    src: null,
    enabled: true,
    isWebm: false,
    webmSrc: null,
    videoMutedInDefault: true,
    BGMSrc: null,
    isMuted: false,
    isAutoBGMplay: true,
    isIOS : false,
  };

  outputs = {
    texture: null,
    enabled: null,
  } as Outputs;
  videoPlaying: boolean = false;
  videoFirstPlay: boolean = true;

  onInit() {
 
      
    const userAgent = navigator.userAgent.toLowerCase(); // User Agent 문자열을 소문자로 변환하여 저장
    if (userAgent.indexOf("mobile") !== -1) {
      //console.log("모바일 디바이스입니다.");
      if (
        userAgent.indexOf("iphone") !== -1 ||
        userAgent.indexOf("ipad") !== -1
      ) {
        //console.log("iOS 디바이스입니다.");

        //this.inputs.isAutoBGMplay = true;
        this.inputs.isIOS = true;


        // iOS 디바이스 처리 로직 작성
      } else if (userAgent.indexOf("android") !== -1) {
        //console.log("안드로이드 디바이스입니다.");
        // 안드로이드 디바이스 처리 로직 작성
      } else {
        //console.log("모바일 디바이스이지만, iOS나 안드로이드가 아닙니다.");
        // 기타 모바일 디바이스 처리 로직 작성
      }
    } else if (userAgent.indexOf("tablet") !== -1) {
      //console.log("태블릿 디바이스입니다.");
      // 태블릿 디바이스 처리 로직 작성
    } else if (
      userAgent.indexOf("macintosh") !== -1 ||
      userAgent.indexOf("mac os x") !== -1
    ) {
      //console.log("맥북입니다."); // 맥북 디바이스 처리 로직 작성
      this.inputs.isIOS = true;
    } else {
     // console.log("데스크톱 디바이스입니다.");
      // 데스크톱 디바이스 처리 로직 작성
    } // 뭔가 로드하다가 뻗음
    
  }

  onInputsUpdated() {
    if (this.videoFirstPlay) {
      //console.log("첫실행");

      // var bgm = document.querySelector(".BGMClass") as HTMLAudioElement;

      // console.log("bgm : " + bgm.getAttribute("src"));
      // const BGMtext =
      //   "https://vrmuseumstorage.blob.core.windows.net/vrmuseumblob1/220330_%EA%B5%AD%EC%A0%9C%EA%B5%90%EB%A5%98%EC%9E%AC%EB%8B%A8KF%EA%B0%A4%EB%9F%AC%EB%A6%AC_%EC%98%81%ED%98%BC%EC%9D%84%EC%88%98%EB%86%93%EC%9D%80%EC%B4%88%EC%83%81/Music/EndymaPsyxis_final3.mp3";

      // bgm.children[0].setAttribute("src",BGMtext);
      // console.log("bgm : " + bgm.children[0].getAttribute("src"));
      // bgm.autoplay;
      //bgm.play();
      // var BGMAudio = new Audio(
      //   this.inputs.BGMSrc
      // );
      // BGMAudio.loop;
      // BGMAudio.autoplay;
      // BGMAudio.play();

      //console.log("비디오 실행 확인  ");
      this.releaseTexture();

      const THREE = this.context.three;
      if (!this.inputs.src) {
        //src null 확인
        // console.log("VideoRenderer input 입력 확인");

        //this.video.src = "";
        return;
      }

      if (this.inputs.src instanceof HTMLVideoElement) {
        this.video = this.inputs.src;
      } else {
        console.log("비디오생성")
        this.video = this.createVideoElement();

        if (typeof this.inputs.src === "string") {
          // console.log("VideoRenderer 2");
          this.video.src = this.inputs.src;
        } else {
          this.video.srcObject = this.inputs.src;
        }

        this.video.load();
      }

      var renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setClearColor(0x000000, 0);
      renderer.outputEncoding = THREE.sRGBEncoding;
      

      this.texture = new THREE.VideoTexture(this.video);

      this.texture.minFilter = THREE.LinearFilter;
      this.texture.magFilter = THREE.LinearFilter;

      this.texture.format = THREE.RGBAFormat;

      this.outputs.texture = this.texture;
      this.video.loop = true;
      //this.video.playsInline; // 흰화면으로 나옴
   

      if (this.inputs.isWebm) {
        var textSrc = this.inputs.webmSrc;

        this.video.src = textSrc;
      }
      
      if (this.inputs.isIOS) {//ios 라면 autoplay false 일시정지에서
        console.log("정지")
        //this.video.playsInline;
        // this.video.muted = true;
        // this.video.autoplay = false;
        // this.video.pause();

        this.video.muted = true;
        this.video.play();
      } else { // ios 가 아닐때 오토플레이,  play
        //this.video.autoplay = true;
        //console.log("플레이");
        //this.video.autoplay = true;
        this.video.muted = true;
        this.video.play();
      }
      //this.video.muted = true; //this.inputs.videoMutedInDefault;

      // var promise = this.video.play();
      // if (promise !== undefined) {
      //   promise
      //     .then((_) => {
      //       //this.video.muted = this.inputs.videoMutedInDefault;
      //       //this.video.play();
      //       // Autoplay started!
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //       // Autoplay was prevented.
      //       // Show a "Play" button so that user can start playback.
      //     });
      // }
      this.videoPlaying = false;
      this.videoFirstPlay = false;
    } else {
      console.log("두번째실행");
      //  if (!this.inputs.enabled) {
      //    console.log("!this.inputs.enabled");
      //    // console.log("비디오 인풋 확인1");
      //    this.video.muted = false;
      //  } else {
      //    console.log("!this.inputs.disbled");
      //    // console.log("비디오 인풋 확인2");
      //    this.video.muted = true;
      //  }
      return;
    }
    //console.log("this.inputs.enabled : "+(if(this.inputs.enabled){true} else {false} ));
  }

  onDestroy() {
    this.releaseTexture();
  }

  releaseTexture() {
    if (this.texture) {
      this.outputs.texture = null;
      this.texture.dispose();
    }
  }

  private createVideoElement() {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.autoplay = false;
    video.muted = true;
    video.loop = true;
    // video.setAttribute("playsInline", "true");
    // video.setAttribute("webkit-playsInline", "true");
    // video.setAttribute(
    //   "allowsInlineMediaPlayback",
    //   "true"
    // );
    
    
    
    //(this.video as any).playsInline = true;
    return video;
  }
}

export interface IVideoRenderer extends SceneComponent {
  inputs: Inputs;
  outputs: Outputs;
}

export const videoRendererType = "mp.videoRenderer";
export const videoRendererTypeTest = "mp.videoRenderer";
export function makeVideoRenderer() {
  return new VideoRenderer();
}
