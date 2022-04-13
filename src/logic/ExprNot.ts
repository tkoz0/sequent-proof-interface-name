import ExprBase from "./ExprBase";

class ExprNot extends ExprBase {
    constructor(a: ExprBase) {
        super([a]);
    }
    public toString() {
        return '~' + this.values[0].toString();
    }
}

export default ExprNot;
