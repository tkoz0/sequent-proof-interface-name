import ExprBase from "./ExprBase";

class ExprIff extends ExprBase {
    constructor(a: ExprBase, b: ExprBase) {
        super([a,b]);
    }
    public toString() {
        return '(' + this.values[0].toString() + ' <-> ' + this.values[1].toString() + ')';
    }
}

export default ExprIff;
