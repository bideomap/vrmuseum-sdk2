
import { MpSdk } from '@mp/bundle-sdk/sdk';

export class SceneLoader {
  private nodes: MpSdk.Scene.INode[] = [];
  private _sceneObject: MpSdk.Scene.IObject = null;
  public get sceneObject() {
    return this._sceneObject;
  }
  constructor(private sdk: MpSdk) {}

  /**
   * Load the scene for a given model.
   *
   * @param sid sid of the model, used to lookup the scene.
   * @param callback an optional callback which is called once for scene node created.
   */
  public async load(sid: string, callback: (node: MpSdk.Scene.INode) => void = null) {
    const nodesToStop = this.nodes.splice(0);
    for (const node of nodesToStop) {
      node.stop();
    }
    
    var url;
    
    const urltmp = window.location.href
    
    url = new URL(urltmp);

    

    const urlParams = url.searchParams;
    
    
    const sceneImport = await import(
      "../assets/" + urlParams.get("m") + ".json"
    );

    const sidToScene: Map<string, any> = new Map();

    sidToScene.set("AAWs9eZ9ip6", sceneImport);


    const scene = sidToScene.get(sid);
    if (!scene) {
      return;
    }

    this._sceneObject = await this.sdk.Scene.deserialize(JSON.stringify(scene));
    const nodesToStart = [...this.sceneObject.nodeIterator()];
    if (callback) {
      for (const node of nodesToStart) {
        callback(node);
      }
    }
    var videoDelayNumber = 500;
    await new Promise((resolve) => setTimeout(resolve, videoDelayNumber));
    this._sceneObject.start();
  }

  public *nodeIterator(): IterableIterator<MpSdk.Scene.INode> {
    for (const node of this.nodes) {
      yield node;
    }
  }
}


