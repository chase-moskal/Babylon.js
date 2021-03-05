import { ShaderCodeNode } from "./shaderCodeNode.js";
import { ShaderDefineExpression } from "./Expressions/shaderDefineExpression.js";

/** @hidden */
export class ShaderCodeTestNode extends ShaderCodeNode {
    public testExpression: ShaderDefineExpression;

    public isValid(preprocessors: { [key: string]: string }) {
        return this.testExpression.isTrue(preprocessors);
    }
}