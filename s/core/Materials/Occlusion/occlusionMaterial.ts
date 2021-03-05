import { Color4 } from "../../Maths/math.color.js";
import { Scene } from "../../scene.js";
import { ShaderMaterial } from "../shaderMaterial.js";

import "../../Shaders/color.fragment.js";
import "../../Shaders/color.vertex.js";

/**
 * A material to use for fast depth-only rendering.
 */
export class OcclusionMaterial extends ShaderMaterial {
    constructor(name: string, scene: Scene) {
        super(name, scene, "color", {
            attributes: ["position"],
            uniforms: ["world", "viewProjection", "color"]
        });
        this.disableColorWrite = true;
        this.forceDepthWrite = true;
        this.setColor4("color", new Color4(0, 0, 0, 1));
    }
}