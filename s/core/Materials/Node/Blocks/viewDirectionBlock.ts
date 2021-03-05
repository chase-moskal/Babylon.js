import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { _TypeStore } from "../../../Misc/typeStore.js";
import { NodeMaterial } from "../nodeMaterial.js";
import { NodeMaterialSystemValues } from "../Enums/nodeMaterialSystemValues.js";
import { InputBlock } from "./Input/inputBlock.js";
/**
 * Block used to get the view direction
 */
export class ViewDirectionBlock extends NodeMaterialBlock {
    /**
     * Creates a new ViewDirectionBlock
     * @param name defines the block name
     */
    public constructor(name: string) {
        super(name, NodeMaterialBlockTargets.Neutral);

        this.registerInput("worldPosition", NodeMaterialBlockConnectionPointTypes.Vector4);
        this.registerInput("cameraPosition", NodeMaterialBlockConnectionPointTypes.Vector3);

        this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.Vector3);
    }

    /**
     * Gets the current class name
     * @returns the class name
     */
    public getClassName() {
        return "ViewDirectionBlock";
    }

    /**
     * Gets the world position component
     */
    public get worldPosition(): NodeMaterialConnectionPoint {
        return this._inputs[0];
    }

    /**
     * Gets the camera position component
     */
    public get cameraPosition(): NodeMaterialConnectionPoint {
        return this._inputs[1];
    }

    /**
     * Gets the output component
     */
    public get output(): NodeMaterialConnectionPoint {
        return this._outputs[0];
    }

    public autoConfigure(material: NodeMaterial) {
        if (!this.cameraPosition.isConnected) {
            let cameraPositionInput = material.getInputBlockByPredicate((b) => b.systemValue === NodeMaterialSystemValues.CameraPosition);

            if (!cameraPositionInput) {
                cameraPositionInput = new InputBlock("cameraPosition");
                cameraPositionInput.setAsSystemValue(NodeMaterialSystemValues.CameraPosition);
            }
            cameraPositionInput.output.connectTo(this.cameraPosition);
        }
    }

    protected _buildBlock(state: NodeMaterialBuildState) {
        super._buildBlock(state);

        let output = this._outputs[0];

        state.compilationString += this._declareOutput(output, state) + ` = normalize(${this.cameraPosition.associatedVariableName} - ${this.worldPosition.associatedVariableName}.xyz);\r\n`;

        return this;
    }
}

_TypeStore.RegisteredTypes["BABYLON.ViewDirectionBlock"] = ViewDirectionBlock;