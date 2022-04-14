import ExprBase from "./ExprBase";

class ExprCont extends ExprBase {
    constructor() {
        super([]);
    }
    public toString() {
        return '^';
    }
    public toSaveString() {
        return '(cont)';
    }
}

export default ExprCont;
