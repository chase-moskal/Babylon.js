import { PostProcess, PostProcessOptions } from "./postProcess.js";
import { Effect } from "../Materials/effect.js";
import { Texture } from "../Materials/Textures/texture.js";
import { Engine } from "../Engines/engine.js";
import { Camera } from "../Cameras/camera.js";

import "../Shaders/colorCorrection.fragment.js";
import { _TypeStore } from "../Misc/typeStore.js";
import { SerializationHelper, serialize } from "../Misc/decorators.js";
import { Nullable } from "../types.js";

declare type Scene = import("../scene").Scene;

/**
 *
 * This post-process allows the modification of rendered colors by using
 * a 'look-up table' (LUT). This effect is also called Color Grading.
 *
 * The object needs to be provided an url to a texture containing the color
 * look-up table: the texture must be 256 pixels wide and 16 pixels high.
 * Use an image editing software to tweak the LUT to match your needs.
 *
 * For an example of a color LUT, see here:
 * @see http://udn.epicgames.com/Three/rsrc/Three/ColorGrading/RGBTable16x1.png
 * For explanations on color grading, see here:
 * @see http://udn.epicgames.com/Three/ColorGrading.html
 *
 */
export class ColorCorrectionPostProcess extends PostProcess {

    private _colorTableTexture: Texture;

    /**
     * Gets the color table url used to create the LUT texture
     */
    @serialize()
    public colorTableUrl: string;

    /**
     * Gets a string identifying the name of the class
     * @returns "ColorCorrectionPostProcess" string
     */
    public getClassName(): string {
        return "ColorCorrectionPostProcess";
    }

    constructor(name: string, colorTableUrl: string, options: number | PostProcessOptions, camera: Camera, samplingMode?: number, engine?: Engine, reusable?: boolean) {
        super(name, 'colorCorrection', null, ['colorTable'], options, camera, samplingMode, engine, reusable);

        this._colorTableTexture = new Texture(colorTableUrl, camera.getScene(), true, false, Texture.TRILINEAR_SAMPLINGMODE);
        this._colorTableTexture.anisotropicFilteringLevel = 1;
        this._colorTableTexture.wrapU = Texture.CLAMP_ADDRESSMODE;
        this._colorTableTexture.wrapV = Texture.CLAMP_ADDRESSMODE;

        this.colorTableUrl = colorTableUrl;

        this.onApply = (effect: Effect) => {
            effect.setTexture("colorTable", this._colorTableTexture);
        };
    }

    /** @hidden */
    public static _Parse(parsedPostProcess: any, targetCamera: Camera, scene: Scene, rootUrl: string): Nullable<ColorCorrectionPostProcess> {
        return SerializationHelper.Parse(() => {
            return new ColorCorrectionPostProcess(
                parsedPostProcess.name, parsedPostProcess.colorTableUrl,
                parsedPostProcess.options, targetCamera,
                parsedPostProcess.renderTargetSamplingMode,
                scene.getEngine(), parsedPostProcess.reusable);
        }, parsedPostProcess, scene, rootUrl);
    }
}

_TypeStore.RegisteredTypes["BABYLON.ColorCorrectionPostProcess"] = ColorCorrectionPostProcess;
