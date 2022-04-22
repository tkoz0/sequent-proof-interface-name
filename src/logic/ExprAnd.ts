import ExprBase from "./ExprBase";

/**
 * Representation of the AND connective. Needs >= 2 expressions.
 */
class ExprAnd extends ExprBase {
    constructor(a: ExprBase[]) {
        if (a.length < 2)
            throw "AND must have >= 2 arguments";
        super(a);
    }
    public toString() {
        return '(' + this.values.map(e => e.toString()).join(' & ') + ')';
    }
    public toSaveString() {
        return '(and ' + this.values.map(e => e.toSaveString()).join(' ') + ')';
    }
    public equals(a: ExprBase): boolean {
        return (a instanceof ExprAnd)
            && ExprBase.listsEqual(this.values,a.values);
    }
}

export default ExprAnd;
