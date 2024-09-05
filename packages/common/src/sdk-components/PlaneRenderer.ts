import { SceneComponent, ComponentInteractionType } from "../SceneComponent";
import { Texture, Mesh, MeshBasicMaterial, Object3D,   } from "three";

//import { NURBSCurve } from "./../../../../node_modules/@types/three/examples/jsm/curves/NURBSCurve";
//import { NURBSSurface } from "./NURBScurveScript/curves/NURBSSurface";
//import { NURBSSurface } from "./../../../../node_modules/@types/three/examples/jsm/curves/NURBSSurface";

//import { ParametricBufferGeometry } from "./../../../../node_modules/@types/three/src/geometries/ParametricGeometry";
//import { NURBSSurface } from "./NURBScurveScript/curves/NURBSSurface";

export type Size = { w: number; h: number };
interface screenModeUnionType {
  Plane: number;
  Curved: number;
  Cascading: number;
  FrameRound: number;
  ThreePlane: number;
  Circle: number;
  TwoPlane: number;
}
type Inputs = {
  texture: Texture | null;
  aspect: number;
  transparent: boolean;
  visible: boolean;
  opacity: number;
  polygonOffset: boolean;
  polygonOffsetFactor: number;
  polygonOffsetUnits: number;
  localScale: { x: number; y: number; z: number };
  localPosition: { x: number; y: number; z: number };
  localRotation: { x: number; y: number; z: number };
  localCurveScale: { x: number; y: number; z: number };
  widthSegments: number;
  heightSegments: number;
  bandDepth: number;
  isCollider: boolean;
  isDoubleSide: boolean;
  isBorderRound: boolean;
  radiusNumber: number;
  isCurvedScreen: boolean;
  isLocalRotation: boolean;
  isCascadingScreen: boolean;

  screenModeNumber: number;
  PlaneSegments: number;
  defaultRoundNumber: number;
  ThreePlanePositionNumber: {
    plane1: { x: number; y: number; z: number };
    plane2: { x: number; y: number; z: number };
    plane3: { x: number; y: number; z: number };
  };

  planeColorString: number;
  uvCountNumber: number;
  depthWrite : boolean;
};

export class PlaneRenderer extends SceneComponent implements IPlaneRenderer {
  component: SceneComponent;
  ComponentInteractionType: ComponentInteractionType;
  private mesh: Mesh;
  private pivotNode: Object3D;

  inputs: Inputs = {
    texture: null,
    aspect: 1,
    transparent: true,
    visible: true,
    opacity: 1,
    polygonOffset: true,
    polygonOffsetFactor: 0,
    polygonOffsetUnits: 0,
    localScale: { x: 1, y: 1, z: 1 },
    localPosition: { x: 0, y: 0, z: 0 },
    localRotation: { x: 0, y: 0, z: 0 },
    localCurveScale: { x: 1, y: 1, z: 1 },
    widthSegments: 0,
    heightSegments: 0,
    bandDepth: 0,
    isCollider: true,
    isDoubleSide: false,
    isBorderRound: false,
    radiusNumber: 0,
    isCurvedScreen: false,
    isLocalRotation: false,
    isCascadingScreen: false,
    screenModeNumber: 0,
    PlaneSegments: 20,
    defaultRoundNumber: 1,
    ThreePlanePositionNumber: {
      plane1: { x: 0, y: 0, z: 0 },
      plane2: { x: 0, y: 0, z: 0 },
      plane3: { x: 0, y: 0, z: 0 },
    },
    planeColorString: 0xc0c0c0,
    uvCountNumber: 10000,
    depthWrite : true,
  };

  events = {
    [ComponentInteractionType.CLICK]: true,
  };

  screenMode: screenModeUnionType = {
    Plane: 0,
    Curved: 1,
    Cascading: 2,
    FrameRound: 3,
    ThreePlane: 4,
    Circle: 5,
    TwoPlane: 6,
  };
  onInit() {
    let tmpIsCollider;
    tmpIsCollider = this.inputs.isCollider;
    const THREE = this.context.three;

    let tmpPlaneColorStringtoNumber;
    tmpPlaneColorStringtoNumber = Number(this.inputs.planeColorString);

    this.pivotNode = new THREE.Group();
   
    this.mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1.0, 1.0), //BufferGeometryVariable,//
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(tmpPlaneColorStringtoNumber),
        transparent: this.inputs.transparent,
        map: this.inputs.texture,
        opacity: this.inputs.opacity,
        polygonOffset: this.inputs.polygonOffset,
        polygonOffsetFactor: this.inputs.polygonOffsetFactor,
        polygonOffsetUnits: this.inputs.polygonOffsetUnits,
        
        depthTest: this.inputs.depthWrite,
      })
    );

    this.mesh.scale.set(
      this.inputs.localScale.x,
      this.inputs.localScale.y / this.inputs.aspect,
      this.inputs.localScale.z
    );
    this.mesh.position.set(
      this.inputs.localPosition.x,
      this.inputs.localPosition.y,
      this.inputs.localPosition.z
    );
    this.mesh.updateMatrixWorld();

    this.pivotNode.add(this.mesh);

    this.outputs.objectRoot = this.pivotNode;
    //this.outputs.collider = this.pivotNode;

    if (tmpIsCollider) {
      this.outputs.collider = this.pivotNode;
    }

    this.mesh.visible = this.inputs.visible;
  }

  onEvent(eventType: string, eventData: unknown) {
    //console.log(eventType);
    //console.log(eventType, eventData);
    this.notify(eventType, eventData); //얘가 다른곳으로 값을 넘김, events 참고
  }

  onInputsUpdated(oldInputs: Inputs) {
    if (oldInputs.transparent !== this.inputs.transparent) {
      (this.mesh.material as MeshBasicMaterial).transparent =
        this.inputs.transparent;
    }

    if (oldInputs.texture !== this.inputs.texture) {
      const material = this.mesh.material as MeshBasicMaterial;
      this.inputs.texture.format = this.context.three.RGBAFormat;
      material.map = this.inputs.texture; //this.texture.format = THREE.RGBFormat;
      material.needsUpdate = true;
    }

    if (oldInputs.visible !== this.inputs.visible) {
      this.mesh.visible = this.inputs.visible;
    }

    if (oldInputs.polygonOffset !== this.inputs.polygonOffset) {
      const material = this.mesh.material as MeshBasicMaterial;
      material.polygonOffset = this.inputs.polygonOffset;
      material.polygonOffsetFactor = this.inputs.polygonOffsetFactor;
      material.polygonOffsetUnits = this.inputs.polygonOffsetUnits;

      //material.color = "0x000000";

      //material.side = THREE.DoubleSide;
    }
    //this.plane.material.
    //this.mesh.material  = new THREE.MeshBasicMaterial(map:Texture, side: THREE.DoubleSide)

    // 모서리 라운드 처리 함수
    function FrameRoundFunction(inputsRadiusNumber: number, inputsThree: any) {
      const THREE = inputsThree;
      //const videoGeometry = new THREE.CircleGeometry(0.7, 200);

      var radiusNumber = inputsRadiusNumber;
      var XTotalNumber = 1;
      var YTotalNumber = 1;
      const x = 0, //this.inputs.localPosition.x,
        y = 0; //this.inputs.localPosition.y;
      const roundShape = new THREE.Shape();

      roundShape.moveTo(x, y + radiusNumber);
      roundShape.quadraticCurveTo(x, y, x + radiusNumber, y);
      roundShape.quadraticCurveTo(
        x + (XTotalNumber - radiusNumber),
        y + 0,
        x + (XTotalNumber - radiusNumber),
        y + 0 //
      );
      roundShape.quadraticCurveTo(
        x + XTotalNumber,
        y + 0,
        x + XTotalNumber,
        y + radiusNumber
      );
      roundShape.quadraticCurveTo(
        x + XTotalNumber,
        y + (YTotalNumber - radiusNumber),
        x + XTotalNumber,
        y + (YTotalNumber - radiusNumber)
      );
      roundShape.quadraticCurveTo(
        x + XTotalNumber,
        y + YTotalNumber,
        x + XTotalNumber - radiusNumber,
        y + YTotalNumber
      );
      roundShape.quadraticCurveTo(
        x,
        y + YTotalNumber,
        x + radiusNumber,
        y + YTotalNumber
      );
      roundShape.quadraticCurveTo(
        x,
        y + YTotalNumber,
        x,
        y + YTotalNumber - radiusNumber
      );

      const videoGeometry = new THREE.ShapeGeometry(roundShape);
      return videoGeometry;
    }

    function CircleFunction(inputsRadiusNumber: number, inputsThree: any) {
      const THREE = inputsThree;
      //const videoGeometry = new THREE.CircleGeometry(0.7, 200);

      // var radiusNumber = inputsRadiusNumber;
      // // var XTotalNumber = 1;
      // // var YTotalNumber = 1;
      // const x = 0, //this.inputs.localPosition.x,
      //   y = 0; //this.inputs.localPosition.y;
      // const roundShape = new THREE.Shape();

      // roundShape.moveTo(x, y + radiusNumber);
      // roundShape.quadraticCurveTo(x, y, x + radiusNumber, y);

      //const videoGeometry = new THREE.ShapeGeometry(roundShape);

      const videoCircleGeometry = new THREE.CircleGeometry(
        inputsRadiusNumber,
        100
      );
      return videoCircleGeometry;
    }

    // 커브드스크린 함수
    function CurvePlane(
      g: any,
      z: any,
      inputsThree: any,
      defaultRoundNumber: any
    ) {
      //console.log("CurvePlane 실행확인");
      const THREE = inputsThree;
      let p = g.parameters;

      let hw = p.width * 0.5; // 너비를 2등분 함

      let a = new THREE.Vector2(-hw, 0); // 시작지점
      let b = new THREE.Vector2(0, z); // 굴곡 정도
      let c = new THREE.Vector2(hw, 0); // 끝 지점

      let ab = new THREE.Vector2().subVectors(a, b); //   a b 사이의 거리
      let bc = new THREE.Vector2().subVectors(b, c); //   b c 사이의 거리
      let ac = new THREE.Vector2().subVectors(a, c); //   a c 사이의 거리

      let r =
        (ab.length() * bc.length() * ac.length()) /
        (2 * Math.abs(ab.cross(ac)));

      let center = new THREE.Vector2(0, z - r);
      let baseV = new THREE.Vector2().subVectors(a, center);
      let baseAngle = baseV.angle() - Math.PI * 0.5;
      let arc = baseAngle * 2;

      let uv = g.attributes.uv;
      let pos = g.attributes.position;
      let mainV = new THREE.Vector2();

      for (let i = 0; i < uv.count; i++) {
        let uvRatio = 1 - uv.getX(i);
        let y = pos.getY(i);
        mainV.copy(c).rotateAround(center, arc * uvRatio);
        pos.setXYZ(i, mainV.x, y, -mainV.y * defaultRoundNumber);
      }

      //pos.needsUpdate = true;
      return g;
    }

    // 계단식 스크린 함수
    function CascadedPlane(
      g: any,
      z: any,
      inputsThree: any,
      localCurveScale: any,
      uvCountNumber: any
    ) {
      const THREE = inputsThree;
      //let p = g.parameters;

      let uv = g.attributes.uv;
      let pos = g.attributes.position;
      let mainV = new THREE.Vector2();
      let planeSize = localCurveScale.y / Math.sqrt(uv.count);
      console.log(planeSize);

      console.log("uv.count : " + uv.count); // 이게 아마 자동 면 갯수?
      let uvCount = 0;
      console.log(uvCount);

      //let fixedmainV_y = 0;

      let y = 0;
      let fixedY = 0;
      let fixedZ = 0;
      console.log(fixedZ);
      for (let i = 0; i < uv.count; i++) {
        //
        mainV.x = pos.getX(i);
        mainV.y = pos.getZ(i);
        y = pos.getY(i);

        if (i % (Math.sqrt(uv.count) * 2) == 0) {
          // 이거 왜있음?  짝수일때 숫자 오름
          //fixedmainV_y = y;
          uvCount++;
        }

        // if (uvCount > 0) {
        //   y = fixedmainV_y;
        // }
        //console.log(pos);
        //console.log(uvCountNumber)
        if (i < Math.sqrt(uv.count) * 2) {
          // uvCountNumber 보다 i가 작을때는 일반
          pos.setXYZ(
            i,
            mainV.x, // 옆
            y, //  위   + (planeSize * uvCount *1.5)
            mainV.y // 앞   + planeSize * uvCount
          );
          fixedY = y;
          fixedZ = mainV.y;
          console.log(
            "작을때 i : " +
              i +
              " y : " +
              y +
              " fixey :" +
              fixedY +
              " fixedz : " +
              fixedZ
          );
        } else {
          //uvCountNumber 보다 i가 크면 접히게
          console.log(
            "클때 i : " +
              i +
              " y : " +
              y +
              " fixey :" +
              fixedY +
              " fixedz : " +
              fixedZ
          );
          pos.setXYZ(
            i,
            mainV.x, // 옆
            fixedY, //  위   + (planeSize * uvCount *1.5) // 얘가 고정이 되야함
            fixedZ + (fixedY - y) // 앞   + planeSize * uvCount
          );
        }
      }

      //pos.needsUpdate = true;
      return g;
    }

    function TwoPlane(
      g: any,
      z: any,
      inputsThree: any,
      localCurveScale: any,
      uvCountNumber: any
    ) {
      const THREE = inputsThree;
      //let p = g.parameters;

      let uv = g.attributes.uv;
      let pos = g.attributes.position;
      let mainV = new THREE.Vector2();

      let y = 0;
      let fixedY = 0;
      let fixedZ = 0;
      console.log(fixedZ);
      for (let i = 0; i < uv.count; i++) {
        //
        mainV.x = pos.getX(i);
        mainV.y = pos.getZ(i);
        y = pos.getY(i);

        if (i < Math.sqrt(uv.count) * uvCountNumber) {
          // uvCountNumber 보다 i가 작을때는 일반
          pos.setXYZ(
            i,
            mainV.x, // 옆
            y, //  위   + (planeSize * uvCount *1.5)
            mainV.y // 앞   + planeSize * uvCount
          );
          fixedY = y;
          fixedZ = mainV.y;
        } else {
          //uvCountNumber 보다 i가 크면 접히게

          pos.setXYZ(
            i,
            mainV.x, // 옆
            fixedY, //  위   + (planeSize * uvCount *1.5) // 얘가 고정이 되야함
            fixedZ + (fixedY - y) // 앞   + planeSize * uvCount
          );
        }
      }

      //pos.needsUpdate = true;
      return g;
    }

    function ThreePlaneScreen(
      g: any,
      z: any,
      inputsThree: any,
      localCurveScale: any
    ) {
      const THREE = inputsThree;
      //let p = g.parameters;

      let uv = g.attributes.uv;
      let pos = g.attributes.position;
      let mainV = new THREE.Vector2();
      let planeSize = localCurveScale.y / Math.sqrt(uv.count);

      //let uvCount = 0;
      //let y = 0;
      let Plane1VertexNumber = 4;
      //let Plane2VertexNumber = 3;
      //let Plane3VertexNumber = 4;

      // let stepNubmer = 1;
      let stepCountNubmer = 0;

      for (let i = 0; i < uv.count; i++) {
        mainV.x = pos.getX(i);
        mainV.y = pos.getZ(i);
        // if (i % (Math.sqrt(uv.count) * 2) == 0) {
        //   uvCount++;
        // }

        // console.log(
        //   "i % (Math.sqrt(uv.count) * 2)  : " + (i % (Math.sqrt(uv.count) * 2))
        // );
        stepCountNubmer++;
        if (i % (Math.sqrt(uv.count) * 2) == 0) {
          // 한줄 끝나면 초기화
          stepCountNubmer = 0;
        }

        if (stepCountNubmer >= 0 && stepCountNubmer <= 4) {
          console.log("confirm1 : " + i);
          pos.setXYZ(
            i,
            mainV.x - Plane1VertexNumber * planeSize,
            pos.getY(i),
            mainV.y + Plane1VertexNumber * planeSize
          );
        } else {
          console.log("confirm2 : " + i);
          pos.setXYZ(i, mainV.x, pos.getY(i), mainV.y);
        }
      }
      //pos.needsUpdate = true;
      return g;
    }

    const THREE = this.context.three;

    let geom = new THREE.PlaneGeometry(
      this.inputs.localCurveScale.x,
      this.inputs.localCurveScale.y,
      this.inputs.PlaneSegments, //this.inputs.widthSegments,
      this.inputs.PlaneSegments //this.inputs.heightSegments
    );
    // geom.addEventListener("click", () => {
    //   console.log("클릭");
    // });

    switch (this.inputs.screenModeNumber) {
      case this.screenMode.Plane:
        // console.log("평면");

        break;
      case this.screenMode.Curved:
        this.mesh.geometry = CurvePlane(
          geom,
          this.inputs.bandDepth,
          this.context.three,
          this.inputs.defaultRoundNumber
        );
        break;
      case this.screenMode.Cascading:
        this.mesh.geometry = CascadedPlane(
          geom,
          this.inputs.bandDepth,
          this.context.three,
          this.inputs.localCurveScale,
          this.inputs.uvCountNumber
        );
        break;
      case this.screenMode.FrameRound:
        this.mesh.geometry = FrameRoundFunction(
          this.inputs.radiusNumber,
          this.context.three
        );
        break;
      case this.screenMode.ThreePlane:
        this.mesh.geometry = ThreePlaneScreen(
          geom,
          this.inputs.bandDepth,
          this.context.three,
          this.inputs.localCurveScale
        );
        console.log("this.screenMode.ThreePlane");

        break;
      case this.screenMode.Circle:
        this.mesh.geometry = CircleFunction(
          this.inputs.radiusNumber,
          this.context.three
        );
        break;
      case this.screenMode.TwoPlane:
        this.mesh.geometry = TwoPlane(
          geom,
          this.inputs.bandDepth,
          this.context.three,
          this.inputs.localCurveScale,
          this.inputs.uvCountNumber
        );
        break;

      default:
        console.log("ScreenModeError");
        break;
    }

    if (this.inputs.isLocalRotation) {
      // 자체 회전값을 가질때
      this.mesh.rotation.set(
        this.inputs.localRotation.x,
        this.inputs.localRotation.y,
        this.inputs.localRotation.z
      );
    }

    this.mesh.position.set(
      this.inputs.localPosition.x,
      this.inputs.localPosition.y,
      this.inputs.localPosition.z
    );
  }

  onDestroy() {
    this.outputs.collider = null;
    this.outputs.objectRoot = null;

    (this.mesh.material as MeshBasicMaterial).dispose();
    this.mesh.geometry.dispose();
  }
}

export interface IPlaneRenderer extends SceneComponent {
  inputs: Inputs;
  ComponentInteractionType: ComponentInteractionType;
  
  component: SceneComponent;
}

export const planeRendererType = "mp.planeRenderer";
export function makePlaneRenderer() {
  return new PlaneRenderer();
}
