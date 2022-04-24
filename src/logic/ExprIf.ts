import ExprBase from "./ExprBase";

/**
 * Representation of the IF connective.
 */
class ExprIf extends ExprBase {
    constructor(a: ExprBase, b: ExprBase) {
        super([a,b]);
    }
    public toString() {
        return '(' + this.values[0].toString() + ' \u2192 '
            + this.values[1].toString() + ')';
    }
    public toSaveString() {
        return '(if ' + this.values[0].toSaveString() + ' '
            + this.values[1].toSaveString() + ')';
    }
    public equals(a: ExprBase): boolean {
        return (a instanceof ExprIf)
            && ExprBase.listsEqual(this.values,a.values);
    }
}

export default ExprIf;
