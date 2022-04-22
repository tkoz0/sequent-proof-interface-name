import ExprBase from "./ExprBase";

/**
 * Representation of the NOT operator.
 */
class ExprNot extends ExprBase {
    constructor(a: ExprBase) {
        super([a]);
    }
    public toString() {
        return '~' + this.values[0].toString();
    }
    public toSaveString() {
        return '(not ' + this.values[0].toSaveString() + ')';
    }
    public equals(a: ExprBase): boolean {
        return (a instanceof ExprNot)
            && ExprBase.listsEqual(this.values,a.values);
    }
}

export default ExprNot;
