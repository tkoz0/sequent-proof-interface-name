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
    public equals(a: ExprBase): boolean {
        return (a instanceof ExprCont);
    }
}

export default ExprCont;
