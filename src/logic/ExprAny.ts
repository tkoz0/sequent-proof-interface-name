import ExprBase from "./ExprBase";

/**
 * Representation for an expression that is allowed to match any expression.
 * This is used for pattern matching. The expression containing the ExprAny
 * type for matching must be the left operand:
 * - exprWithAny.equals(anotherExpr)
 */
class ExprAny extends ExprBase {
    constructor() {
        super([]);
    }
    public toString() {
        return '*';
    }
    public toSaveString() {
        return '(any)';
    }
    public equals(_a: ExprBase): boolean {
        return true;
    }
}

export default ExprAny;
