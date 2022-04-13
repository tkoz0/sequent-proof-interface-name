import ExprBase from "./ExprBase";

class ExprAnd extends ExprBase {
    constructor(a: ExprBase, b: ExprBase) {
        super([a,b]);
    }
    public toString() {
        return '(' + this.values[0].toString() + ' & ' + this.values[1].toString() + ')';
    }
}

export default ExprAnd;
