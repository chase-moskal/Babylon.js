import { ShaderCodeNode } from "./shaderCodeNode.js";
import { ProcessingOptions } from "./shaderProcessingOptions.js";

/** @hidden */
export class ShaderCodeConditionNode extends ShaderCodeNode {
    process(preprocessors: { [key: string]: string }, options: ProcessingOptions) {
        for (var index = 0; index < this.children.length; index++) {
            let node = this.children[index];

            if (node.isValid(preprocessors)) {
                return node.process(preprocessors, options);
            }
        }

        return "";
    }
}