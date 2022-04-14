import ExprBase from "./ExprBase";

class ExprIff extends ExprBase {
    constructor(a: ExprBase, b: ExprBase) {
        super([a,b]);
    }
    public toString() {
        return '(' + this.values[0].toString() + ' <-> ' + this.values[1].toString() + ')';
    }
    public toSaveString() {
        return '(iff ' + this.values[0].toSaveString() + ' ' + this.values[1].toSaveString() + ')';
    }
}

export default ExprIff;
