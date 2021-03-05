import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
import { _TypeStore } from "../../../Misc/typeStore.js";
import { InputBlock } from "./Input/inputBlock.js";
import { NodeMaterial } from "../nodeMaterial.js";

import "../../../Shaders/ShadersInclude/fresnelFunction.js";
import { ViewDirectionBlock } from "./viewDirectionBlock.js";

/**
 * Block used to compute fresnel value
 */
export class FresnelBlock extends NodeMaterialBlock {

    /**
     * Create a new FresnelBlock
     * @param name defines the block name
     */
    public constructor(name: string) {
        super(name, NodeMaterialBlockTargets.Neutral);

        this.registerInput("worldNormal", NodeMaterialBlockConnectionPointTypes.Vector4);
        this.registerInput("viewDirection", NodeMaterialBlockConnectionPointTypes.Vector3);
        this.registerInput("bias", NodeMaterialBlockConnectionPointTypes.Float);
        this.registerInput("power", NodeMaterialBlockConnectionPointTypes.Float);

        this.registerOutput("fresnel", NodeMaterialBlockConnectionPointTypes.Float);
    }

    /**
     * Gets the current class name
     * @returns the class name
     */
    public getClassName() {
        return "FresnelBlock";
    }

    /**
     * Gets the world normal input component
     */
    public get worldNormal(): NodeMaterialConnectionPoint {
        return this._inputs[0];
    }

    /**
    * Gets the view direction input component
    */
    public get viewDirection(): NodeMaterialConnectionPoint {
        return this._inputs[1];
    }

    /**
    * Gets the bias input component
    */
    public get bias(): NodeMaterialConnectionPoint {
        return this._inputs[2];
    }

    /**
    * Gets the camera (or eye) position component
    */
    public get power(): NodeMaterialConnectionPoint {
        return this._inputs[3];
    }

    /**
     * Gets the fresnel output component
     */
    public get fresnel(): NodeMaterialConnectionPoint {
        return this._outputs[0];
    }

    public autoConfigure(material: NodeMaterial) {
        if (!this.viewDirection.isConnected) {
            let viewDirectionInput = new ViewDirectionBlock("View direction");
            viewDirectionInput.output.connectTo(this.viewDirection);
            viewDirectionInput.autoConfigure(material);
        }

        if (!this.bias.isConnected) {
            let biasInput = new InputBlock("bias");
            biasInput.value = 0;
            biasInput.output.connectTo(this.bias);
        }

        if (!this.power.isConnected) {
            let powerInput = new InputBlock("power");
            powerInput.value = 1;
            powerInput.output.connectTo(this.power);
        }
    }

    protected _buildBlock(state: NodeMaterialBuildState) {
        super._buildBlock(state);

        let comments = `//${this.name}`;

        state._emitFunctionFromInclude("fresnelFunction", comments, {removeIfDef: true});

        state.compilationString += this._declareOutput(this.fresnel, state) + ` = computeFresnelTerm(${this.viewDirection.associatedVariableName}.xyz, ${this.worldNormal.associatedVariableName}.xyz, ${this.bias.associatedVariableName}, ${this.power.associatedVariableName});\r\n`;

        return this;
    }
}

_TypeStore.RegisteredTypes["BABYLON.FresnelBlock"] = FresnelBlock;