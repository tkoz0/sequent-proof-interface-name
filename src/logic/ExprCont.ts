import ExprBase from "./ExprBase";

/**
 * Representation of the contradiction symbol.
 */
class ExprCont extends ExprBase {
    constructor() {
        super([]);
    }
    public toString() {
        return '^';
    }
    public toSaveString() {
        return '(cont)';
    }
    public equals(a: ExprBase): boolean {
        return (a instanceof ExprCont);
    }
}

export default ExprCont;
