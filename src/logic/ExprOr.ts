import ExprBase from "./ExprBase";

/**
 * Representation of the OR connective. Needs >= 2 expressions.
 */
class ExprOr extends ExprBase {
    constructor(a: ExprBase[]) {
        if (a.length < 2)
            throw "OR must have >= 2 arguments";
        super(a);
    }
    public toString() {
        return '(' + this.values.map(e => e.toString()).join(' \u2228 ') + ')';
    }
    public toSaveString() {
        return '(or ' + this.values.map(e => e.toSaveString()).join(' ') + ')';
    }
    public equals(a: ExprBase): boolean {
        return (a instanceof ExprOr)
            && ExprBase.listsEqual(this.values,a.values);
    }
}

export default ExprOr;
