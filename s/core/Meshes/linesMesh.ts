import { Nullable } from "../types.js";
import { Scene } from "../scene.js";
import { Color3, Color4 } from "../Maths/math.color.js";
import { Node } from "../node.js";
import { VertexBuffer } from "../Meshes/buffer.js";
import { SubMesh } from "../Meshes/subMesh.js";
import { Mesh } from "../Meshes/mesh.js";
import { InstancedMesh } from "../Meshes/instancedMesh.js";
import { Effect } from "../Materials/effect.js";
import { Material } from "../Materials/material.js";
import { ShaderMaterial } from "../Materials/shaderMaterial.js";
import { MaterialHelper } from "../Materials/materialHelper.js";

import "../Shaders/color.fragment.js";
import "../Shaders/color.vertex.js";

Mesh._LinesMeshParser = (parsedMesh: any, scene: Scene): Mesh => {
    return LinesMesh.Parse(parsedMesh, scene);
};

/**
 * Line mesh
 * @see https://doc.babylonjs.com/babylon101/parametric_shapes
 */
export class LinesMesh extends Mesh {
    /**
     * Color of the line (Default: White)
     */
    public color = new Color3(1, 1, 1);
    /**
     * Alpha of the line (Default: 1)
     */
    public alpha = 1;

    /**
     * The intersection Threshold is the margin applied when intersection a segment of the LinesMesh with a Ray.
     * This margin is expressed in world space coordinates, so its value may vary.
     * Default value is 0.1
     */
    public intersectionThreshold: number;

    private _colorShader: ShaderMaterial;

    private color4: Color4;

    /**
     * Creates a new LinesMesh
     * @param name defines the name
     * @param scene defines the hosting scene
     * @param parent defines the parent mesh if any
     * @param source defines the optional source LinesMesh used to clone data from
     * @param doNotCloneChildren When cloning, skip cloning child meshes of source, default False.
     * When false, achieved by calling a clone(), also passing False.
     * This will make creation of children, recursive.
     * @param useVertexColor defines if this LinesMesh supports vertex color
     * @param useVertexAlpha defines if this LinesMesh supports vertex alpha
     */
    constructor(
        name: string,
        scene: Nullable<Scene> = null,
        parent: Nullable<Node> = null,
        source: Nullable<LinesMesh> = null,
        doNotCloneChildren?: boolean,
        /**
         * If vertex color should be applied to the mesh
         */
        public readonly useVertexColor?: boolean,
        /**
         * If vertex alpha should be applied to the mesh
         */
        public readonly useVertexAlpha?: boolean
    ) {
        super(name, scene, parent, source, doNotCloneChildren);

        if (source) {
            this.color = source.color.clone();
            this.alpha = source.alpha;
            this.useVertexColor = source.useVertexColor;
            this.useVertexAlpha = source.useVertexAlpha;
        }

        this.intersectionThreshold = 0.1;

        var defines: string[] = [];
        var options = {
            attributes: [VertexBuffer.PositionKind],
            uniforms: ["vClipPlane", "vClipPlane2", "vClipPlane3", "vClipPlane4", "vClipPlane5", "vClipPlane6", "world", "viewProjection"],
            needAlphaBlending: true,
            defines: defines
        };

        if (useVertexAlpha === false) {
            options.needAlphaBlending = false;
        }

        if (!useVertexColor) {
            options.uniforms.push("color");
            this.color4 = new Color4();
        }
        else {
            options.defines.push("#define VERTEXCOLOR");
            options.attributes.push(VertexBuffer.ColorKind);
        }

        this._colorShader = new ShaderMaterial("colorShader", this.getScene(), "color", options);
    }

    private _addClipPlaneDefine(label: string) {
        const define = "#define " + label;
        let index = this._colorShader.options.defines.indexOf(define);

        if (index !== -1) {
            return;
        }

        this._colorShader.options.defines.push(define);
    }

    private _removeClipPlaneDefine(label: string) {
        const define = "#define " + label;
        let index = this._colorShader.options.defines.indexOf(define);

        if (index === -1) {
            return;
        }

        this._colorShader.options.defines.splice(index, 1);
    }

    public isReady() {
        const scene = this.getScene();

        // Clip planes
        scene.clipPlane ? this._addClipPlaneDefine("CLIPPLANE") : this._removeClipPlaneDefine("CLIPPLANE");
        scene.clipPlane2 ? this._addClipPlaneDefine("CLIPPLANE2") : this._removeClipPlaneDefine("CLIPPLANE2");
        scene.clipPlane3 ? this._addClipPlaneDefine("CLIPPLANE3") : this._removeClipPlaneDefine("CLIPPLANE3");
        scene.clipPlane4 ? this._addClipPlaneDefine("CLIPPLANE4") : this._removeClipPlaneDefine("CLIPPLANE4");
        scene.clipPlane5 ? this._addClipPlaneDefine("CLIPPLANE5") : this._removeClipPlaneDefine("CLIPPLANE5");
        scene.clipPlane6 ? this._addClipPlaneDefine("CLIPPLANE6") : this._removeClipPlaneDefine("CLIPPLANE6");

        if (!this._colorShader.isReady(this)) {
            return false;
        }

        return super.isReady();
    }

    /**
     * Returns the string "LineMesh"
     */
    public getClassName(): string {
        return "LinesMesh";
    }

    /**
     * @hidden
     */
    public get material(): Material {
        return this._colorShader;
    }

    /**
     * @hidden
     */
    public set material(value: Material) {
        // Do nothing
    }

    /**
     * @hidden
     */
    public get checkCollisions(): boolean {
        return false;
    }

    public set checkCollisions(value: boolean) {
        // Just ignore it
    }

    /** @hidden */
    public _bind(subMesh: SubMesh, effect: Effect, fillMode: number): Mesh {
        if (!this._geometry) {
            return this;
        }
        const colorEffect = this._colorShader.getEffect();

        // VBOs
        const indexToBind = this.isUnIndexed ? null : this._geometry.getIndexBuffer();
        this._geometry._bind(colorEffect, indexToBind);

        // Color
        if (!this.useVertexColor) {
            const { r, g, b } = this.color;
            this.color4.set(r, g, b, this.alpha);
            this._colorShader.setColor4("color", this.color4);
        }

        // Clip planes
        MaterialHelper.BindClipPlane(colorEffect!, this.getScene());
        return this;
    }

    /** @hidden */
    public _draw(subMesh: SubMesh, fillMode: number, instancesCount?: number): Mesh {
        if (!this._geometry || !this._geometry.getVertexBuffers() || (!this._unIndexed && !this._geometry.getIndexBuffer())) {
            return this;
        }

        var engine = this.getScene().getEngine();

        // Draw order

        if (this._unIndexed) {
            engine.drawArraysType(Material.LineListDrawMode, subMesh.verticesStart, subMesh.verticesCount, instancesCount);
        }
        else {
            engine.drawElementsType(Material.LineListDrawMode, subMesh.indexStart, subMesh.indexCount, instancesCount);
        }
        return this;
    }

    /**
     * Disposes of the line mesh
     * @param doNotRecurse If children should be disposed
     */
    public dispose(doNotRecurse?: boolean): void {
        this._colorShader.dispose(false, false, true);
        super.dispose(doNotRecurse);
    }

    /**
     * Returns a new LineMesh object cloned from the current one.
     */
    public clone(name: string, newParent: Nullable<Node> = null, doNotCloneChildren?: boolean): LinesMesh {
        return new LinesMesh(name, this.getScene(), newParent, this, doNotCloneChildren);
    }

    /**
     * Creates a new InstancedLinesMesh object from the mesh model.
     * @see https://doc.babylonjs.com/how_to/how_to_use_instances
     * @param name defines the name of the new instance
     * @returns a new InstancedLinesMesh
     */
    public createInstance(name: string): InstancedLinesMesh {
        return new InstancedLinesMesh(name, this);
    }

    /**
     * Serializes this ground mesh
     * @param serializationObject object to write serialization to
     */
    public serialize(serializationObject: any): void {
        super.serialize(serializationObject);
        serializationObject.color = this.color.asArray();
        serializationObject.alpha = this.alpha;
    }

        /**
     * Parses a serialized ground mesh
     * @param parsedMesh the serialized mesh
     * @param scene the scene to create the ground mesh in
     * @returns the created ground mesh
     */
    public static Parse(parsedMesh: any, scene: Scene): LinesMesh {
        var result = new LinesMesh(parsedMesh.name, scene);

        result.color = Color3.FromArray(parsedMesh.color);
        result.alpha = parsedMesh.alpha;

        return result;
    }
}

/**
 * Creates an instance based on a source LinesMesh
 */
export class InstancedLinesMesh extends InstancedMesh {
    /**
     * The intersection Threshold is the margin applied when intersection a segment of the LinesMesh with a Ray.
     * This margin is expressed in world space coordinates, so its value may vary.
     * Initialized with the intersectionThreshold value of the source LinesMesh
     */
    public intersectionThreshold: number;

    constructor(name: string, source: LinesMesh) {
        super(name, source);
        this.intersectionThreshold = source.intersectionThreshold;
    }

    /**
     * Returns the string "InstancedLinesMesh".
     */
    public getClassName(): string {
        return "InstancedLinesMesh";
    }
}
