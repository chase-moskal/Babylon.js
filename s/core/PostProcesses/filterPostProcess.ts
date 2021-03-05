import { Nullable } from "../types.js";
import { Matrix } from "../Maths/math.vector.js";
import { Camera } from "../Cameras/camera.js";
import { Effect } from "../Materials/effect.js";
import { PostProcess, PostProcessOptions } from "./postProcess.js";
import { Engine } from "../Engines/engine.js";

import "../Shaders/filter.fragment.js";
import { _TypeStore } from "../Misc/typeStore.js";
import { serializeAsMatrix, SerializationHelper } from "../Misc/decorators.js";

declare type Scene = import("../scene").Scene;

/**
 * Applies a kernel filter to the image
 */
export class FilterPostProcess extends PostProcess {
    /** The matrix to be applied to the image */
    @serializeAsMatrix()
    public kernelMatrix: Matrix;

    /**
     * Gets a string identifying the name of the class
     * @returns "FilterPostProcess" string
     */
    public getClassName(): string {
        return "FilterPostProcess";
    }

    /**
     *
     * @param name The name of the effect.
     * @param kernelMatrix The matrix to be applied to the image
     * @param options The required width/height ratio to downsize to before computing the render pass.
     * @param camera The camera to apply the render pass to.
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     */
    constructor(name: string,
        kernelMatrix: Matrix,
        options: number | PostProcessOptions,
        camera: Nullable<Camera>,
        samplingMode?: number,
        engine?: Engine,
        reusable?: boolean
    ) {
        super(name, "filter", ["kernelMatrix"], null, options, camera, samplingMode, engine, reusable);
        this.kernelMatrix = kernelMatrix;

        this.onApply = (effect: Effect) => {
            effect.setMatrix("kernelMatrix", this.kernelMatrix);
        };
    }

    /** @hidden */
    public static _Parse(parsedPostProcess: any, targetCamera: Camera, scene: Scene, rootUrl: string): Nullable<FilterPostProcess> {
        return SerializationHelper.Parse(() => {
            return new FilterPostProcess(
                parsedPostProcess.name, parsedPostProcess.kernelMatrix,
                parsedPostProcess.options, targetCamera,
                parsedPostProcess.renderTargetSamplingMode,
                scene.getEngine(), parsedPostProcess.reusable);
        }, parsedPostProcess, scene, rootUrl);
    }
}

_TypeStore.RegisteredTypes["BABYLON.FilterPostProcess"] = FilterPostProcess;
