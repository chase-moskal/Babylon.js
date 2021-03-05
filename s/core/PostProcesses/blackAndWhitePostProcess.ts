import { PostProcess, PostProcessOptions } from "./postProcess.js";
import { Camera } from "../Cameras/camera.js";
import { Effect } from "../Materials/effect.js";
import { Engine } from "../Engines/engine.js";

import "../Shaders/blackAndWhite.fragment.js";
import { _TypeStore } from "../Misc/typeStore.js";
import { serialize, SerializationHelper } from "../Misc/decorators.js";
import { Nullable } from "../types.js";

declare type Scene = import("../scene").Scene;

/**
 * Post process used to render in black and white
 */
export class BlackAndWhitePostProcess extends PostProcess {
    /**
     * Linear about to convert he result to black and white (default: 1)
     */
    @serialize()
    public degree = 1;

    /**
     * Gets a string identifying the name of the class
     * @returns "BlackAndWhitePostProcess" string
     */
    public getClassName(): string {
        return "BlackAndWhitePostProcess";
    }

    /**
     * Creates a black and white post process
     * @see https://doc.babylonjs.com/how_to/how_to_use_postprocesses#black-and-white
     * @param name The name of the effect.
     * @param options The required width/height ratio to downsize to before computing the render pass.
     * @param camera The camera to apply the render pass to.
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     */
    constructor(name: string, options: number | PostProcessOptions, camera: Camera, samplingMode?: number, engine?: Engine, reusable?: boolean) {
        super(name, "blackAndWhite", ["degree"], null, options, camera, samplingMode, engine, reusable);

        this.onApplyObservable.add((effect: Effect) => {
            effect.setFloat("degree", this.degree);
        });
    }

    /** @hidden */
    public static _Parse(parsedPostProcess: any, targetCamera: Camera, scene: Scene, rootUrl: string): Nullable<BlackAndWhitePostProcess> {
        return SerializationHelper.Parse(() => {
            return new BlackAndWhitePostProcess(
                parsedPostProcess.name, parsedPostProcess.options,
                targetCamera, parsedPostProcess.renderTargetSamplingMode,
                scene.getEngine(), parsedPostProcess.reusable);
        }, parsedPostProcess, scene, rootUrl);
    }
}

_TypeStore.RegisteredTypes["BABYLON.BlackAndWhitePostProcess"] = BlackAndWhitePostProcess;
