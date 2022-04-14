import ExprBase from "./ExprBase";

class ExprAnd extends ExprBase {
    constructor(a: Array<ExprBase>) {
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
}

export default ExprAnd;
