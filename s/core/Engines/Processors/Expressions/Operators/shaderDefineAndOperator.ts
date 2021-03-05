import { ShaderDefineExpression } from "../shaderDefineExpression.js";

/** @hidden */
export class ShaderDefineAndOperator extends ShaderDefineExpression {
    public leftOperand: ShaderDefineExpression;
    public rightOperand: ShaderDefineExpression;

    public isTrue(preprocessors: { [key: string]: string }): boolean {
        return this.leftOperand.isTrue(preprocessors) && this.rightOperand.isTrue(preprocessors);
    }
}