import { Nullable } from "../types.js";
import { Camera } from "../Cameras/camera.js";
import { Effect } from "../Materials/effect.js";
import { Texture } from "../Materials/Textures/texture.js";
import { PostProcess, PostProcessOptions } from "./postProcess.js";
import { Engine } from "../Engines/engine.js";
import { Scene } from "../scene.js";
import { Constants } from "../Engines/constants.js";
import { Logger } from "../Misc/logger.js";

import "../Shaders/imageProcessing.fragment.js";
import "../Shaders/subSurfaceScattering.fragment.js";
import "../Shaders/postprocess.vertex.js";

/**
 * Sub surface scattering post process
 */
export class SubSurfaceScatteringPostProcess extends PostProcess {
    /**
     * Gets a string identifying the name of the class
     * @returns "SubSurfaceScatteringPostProcess" string
     */
    public getClassName(): string {
        return "SubSurfaceScatteringPostProcess";
    }

    constructor(name: string, scene: Scene, options: number | PostProcessOptions, camera: Nullable<Camera> = null, samplingMode?: number, engine?: Engine, reusable?: boolean, textureType: number = Constants.TEXTURETYPE_UNSIGNED_INT) {
        super(name, "subSurfaceScattering", ["texelSize", "viewportSize", "metersPerUnit"], ["diffusionS", "diffusionD", "filterRadii", "irradianceSampler", "depthSampler", "albedoSampler"], options, camera, samplingMode || Texture.BILINEAR_SAMPLINGMODE, engine, reusable, null, textureType, "postprocess", undefined, true);
        this._scene = scene;

        this.updateEffect();

        this.onApplyObservable.add((effect: Effect) => {
            if (!scene.prePassRenderer || !scene.subSurfaceConfiguration) {
                Logger.Error("PrePass and subsurface configuration needs to be enabled for subsurface scattering.");
                return;
            }
            var texelSize = this.texelSize;
            effect.setFloat("metersPerUnit", scene.subSurfaceConfiguration.metersPerUnit);
            effect.setFloat2("texelSize", texelSize.x, texelSize.y);
            effect.setTexture("irradianceSampler", scene.prePassRenderer.getRenderTarget().textures[scene.prePassRenderer.getIndex(Constants.PREPASS_IRRADIANCE_TEXTURE_TYPE)]);
            effect.setTexture("depthSampler", scene.prePassRenderer.getRenderTarget().textures[scene.prePassRenderer.getIndex(Constants.PREPASS_DEPTH_TEXTURE_TYPE)]);
            effect.setTexture("albedoSampler", scene.prePassRenderer.getRenderTarget().textures[scene.prePassRenderer.getIndex(Constants.PREPASS_ALBEDO_TEXTURE_TYPE)]);
            effect.setFloat2("viewportSize",
                Math.tan(scene.activeCamera!.fov / 2) * scene.getEngine().getAspectRatio(scene.activeCamera!, true),
                Math.tan(scene.activeCamera!.fov / 2));
            effect.setArray3("diffusionS", scene.subSurfaceConfiguration.ssDiffusionS);
            effect.setArray("diffusionD", scene.subSurfaceConfiguration.ssDiffusionD);
            effect.setArray("filterRadii", scene.subSurfaceConfiguration.ssFilterRadii);
        });
    }
}
