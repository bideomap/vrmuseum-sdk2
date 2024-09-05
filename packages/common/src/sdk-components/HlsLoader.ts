import { SceneComponent, ComponentOutput } from "@mp/common";
import { VideoTexture } from "three";
import Hls from "hls.js";
import { Events } from 'hls.js';
enum Event {
  Toggle = "videoMuteToggle",
  Unmute ="unmute"
}
type Inputs = {
  src: string;
  enabled: boolean;
  isAutoplay: boolean;
  isIOS: boolean;

};

type Outputs = {
  video: HTMLVideoElement | null;
  aspect: number;
} & ComponentOutput;

type Events = {
  [Event.Toggle]: boolean;
};

class HlsLoader extends SceneComponent {
  public video: HTMLVideoElement | null = null;
  private texture: VideoTexture | null = null;
  private hls: Hls | null = null;

  private firstCreateVideo: boolean = true;
  inputs: Inputs = {
    src: "",
    enabled: false,
    isAutoplay: true,
    isIOS: false,
  };

  outputs = {
    video: null,
    aspect: 1,
  } as Outputs;

  events = {
    videoMuteToggle: true,
  } as Events;

   onEvent(eventType: string, eventData: unknown) {
      console.log(eventType);
      console.log(eventData);

      // if (eventType === Event.Toggle) {
        
      //   console.log("클릭클릭hls"+Event.Toggle+this.inputs.enabled)
      //   //console.log(eventType);
      //   //console.log(eventData);
      //   console.log(this.video)
      //   if(!this.inputs.enabled) {
        
      //    this.video.volume = 0;
      //    this.video.muted = false;
      //    console.log(this.video.volume);
      //     //this.video.muted = "muted";
      //     this.video.volume = 0.1;
      //     this.video.play();  // 음소거 해제후 정지일때, 다시 플레이를 한다면? 
          
      //   }else {
      //     console.log(this.video.volume);
      //     this.video.muted = true;
      //     this.video.play(); // 음소거 후 다시 플레이를 한다면
          
      //   }
      // }

   }

  onInit() {
     

    this.outputs.aspect = 100 / 100;
    if (this.inputs.enabled) {
      this.setupStream();

      this.video.addEventListener("click", () => {
        console.log("비디오가 클릭되엇음");
      });
    }
    //console.log(this.video)

    const userAgent = navigator.userAgent.toLowerCase(); // User Agent 문자열을 소문자로 변환하여 저장
    if (userAgent.indexOf("mobile") !== -1) {
      //console.log("모바일 디바이스입니다.");
      if (
        userAgent.indexOf("iphone") !== -1 ||
        userAgent.indexOf("ipad") !== -1
      ) {
        //console.log("iOS 디바이스입니다.");

        //this.inputs.isAutoplay = true;
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


    // window.addEventListener(
    //   Event.Toggle,
    //   (event: CustomEvent<Events[Event.Toggle]>) => {
    //     console.log("no");
    //     if (event.detail === true) {
    //       console.log("yes");
    //     }
    //   }
    // );

  }

  onInputsUpdated() {
    this.setupStream();
    //console.log("this.inputs.enabled : " + this.inputs.enabled);

    // if (!this.inputs.enabled) {
    //   // 얘가 초기값
    //   //console.log("1111111111111" + this.inputs.enabled);
    //   if (this.inputs.isIOS) {
    //     // ios
    //     this.video.muted = false; //
    //     this.video.play(); //
    //   } else {
    //     // android 일때 autoplay  sound
    //     //android

    //     this.video.muted = false;
    //   }
    // } else {
    //   //클릭했을때
    //   if (this.inputs.isIOS) {
    //     //ios
    //     this.video.pause(); //
    //   } else {
    //     //android
    //     this.video.autoplay = true; // inputs isios를 text에서 띄워야 할듯? 근데 국회에서 띄울수는 없으니 세종같은 곳에서 테스트 해야할듯?
    //     // 얘가 지금 초기값인데?
    //   }
    // }
    if(true){
      
      if (!this.inputs.enabled) {
        this.video.volume = 0;
        this.video.muted = false;
        this.video.volume = 0.1;
        
      } else {
       // console.log("muted");
          this.video.muted = true;
        
      }
    }
    
  }
 

  onDestroy() {
    this.releaseResources();
  }

  private createVideoElement() {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.setAttribute("height", "480");
    video.setAttribute("width", "720");
    video.setAttribute("playsinline", "");
    video.controls = true;
    //video.playsInline;
    
    video.volume = 0;//
    //console.log(video)
    return video;
  }

  private setupStream() {
    this.releaseResources();

    if (this.inputs.enabled && this.firstCreateVideo) {
      //console.log("비디오가 생성 되었습니다! ");
      this.video = this.createVideoElement();
      this.hls = new Hls();
      this.hls.loadSource(this.inputs.src);
      this.hls.attachMedia(this.video);
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.outputs.video = this.video;
      });
      this.firstCreateVideo = false;
    }
  }

  private releaseResources() {
    if (this.hls) {
      //this.hls.destroy();
      //this.hls = null;
    }

    if (this.texture) {
      //얘때문에 없어지나?
      this.texture.dispose();
      this.texture = null;
      this.outputs.video = null;
    }
  }
}

export const hlsLoaderType = "mp.hlsLoader";
export function makeHlsLoader() {
  return new HlsLoader();
}
