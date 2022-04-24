import ExprBase from "./ExprBase";

/**
 * Representation of the IFF connective.
 */
class ExprIff extends ExprBase {
    constructor(a: ExprBase, b: ExprBase) {
        super([a,b]);
    }
    public toString() {
        return '(' + this.values[0].toString() + ' \u2194 '
            + this.values[1].toString() + ')';
    }
    public toSaveString() {
        return '(iff ' + this.values[0].toSaveString() + ' '
            + this.values[1].toSaveString() + ')';
    }
    public equals(a: ExprBase): boolean {
        return (a instanceof ExprIff)
            && ExprBase.listsEqual(this.values,a.values);
    }
}

export default ExprIff;
