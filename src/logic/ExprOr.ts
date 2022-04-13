import ExprBase from "./ExprBase";

class ExprOr extends ExprBase {
    constructor(a: ExprBase, b: ExprBase) {
        super([a,b]);
    }
    public toString() {
        return '(' + this.values[0].toString() + ' | ' + this.values[1].toString() + ')';
    }
}

export default ExprOr;
