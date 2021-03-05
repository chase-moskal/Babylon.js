import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
import { _TypeStore } from "../../../Misc/typeStore.js";
import { NodeMaterial } from "../nodeMaterial.js";
import { InputBlock } from "./Input/inputBlock.js";

/**
 * Block used to rotate a 2d vector by a given angle
 */
export class Rotate2dBlock extends NodeMaterialBlock {

    /**
     * Creates a new Rotate2dBlock
     * @param name defines the block name
     */
    public constructor(name: string) {
        super(name, NodeMaterialBlockTargets.Neutral);

        this.registerInput("input", NodeMaterialBlockConnectionPointTypes.Vector2);
        this.registerInput("angle", NodeMaterialBlockConnectionPointTypes.Float);
        this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.Vector2);
    }

    /**
     * Gets the current class name
     * @returns the class name
     */
    public getClassName() {
        return "Rotate2dBlock";
    }

    /**
     * Gets the input vector
     */
    public get input(): NodeMaterialConnectionPoint {
        return this._inputs[0];
    }

    /**
     * Gets the input angle
     */
    public get angle(): NodeMaterialConnectionPoint {
        return this._inputs[1];
    }

    /**
     * Gets the output component
     */
    public get output(): NodeMaterialConnectionPoint {
        return this._outputs[0];
    }

    public autoConfigure(material: NodeMaterial) {
        if (!this.angle.isConnected) {
            let angleInput = new InputBlock("angle");
            angleInput.value = 0;
            angleInput.output.connectTo(this.angle);
        }
    }

    protected _buildBlock(state: NodeMaterialBuildState) {
        super._buildBlock(state);

        let output = this._outputs[0];
        let angle = this.angle;
        let input = this.input;

        state.compilationString += this._declareOutput(output, state) + ` = vec2(cos(${angle.associatedVariableName}) * ${input.associatedVariableName}.x - sin(${angle.associatedVariableName}) * ${input.associatedVariableName}.y, sin(${angle.associatedVariableName}) * ${input.associatedVariableName}.x + cos(${angle.associatedVariableName}) * ${input.associatedVariableName}.y);\r\n`;

        return this;
    }
}

_TypeStore.RegisteredTypes["BABYLON.Rotate2dBlock"] = Rotate2dBlock;