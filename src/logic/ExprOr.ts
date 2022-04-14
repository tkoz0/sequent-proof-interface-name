import ExprBase from "./ExprBase";

class ExprOr extends ExprBase {
    constructor(a: Array<ExprBase>) {
        if (a.length < 2)
            throw "OR must have >= 2 arguments";
        super(a);
    }
    public toString() {
        return '(' + this.values.map(e => e.toString()).join(' | ') + ')';
    }
    public toSaveString() {
        return '(or ' + this.values.map(e => e.toSaveString()).join(' ') + ')';
    }
}

export default ExprOr;
