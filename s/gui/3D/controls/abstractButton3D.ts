import { TransformNode } from "../../../core/Meshes/transformNode.js";
import { Scene } from "../../../core/scene.js";

import { Control3D } from "./control3D.js";

/**
 * Class used as a root to all buttons
 */
export class AbstractButton3D extends Control3D {
    /**
     * Creates a new button
     * @param name defines the control name
     */
    constructor(name?: string) {
        super(name);
    }

    protected _getTypeName(): string {
        return "AbstractButton3D";
    }

    // Mesh association
    protected _createNode(scene: Scene): TransformNode {
        return new TransformNode("button" + this.name);
    }
}