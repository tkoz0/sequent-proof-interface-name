import {ValidType} from "../utils/LogicUtils";
import ExprBase from "./ExprBase";

class ExprNot extends ExprBase {
    constructor(a: ExprBase) {
        super([a]);
    }
    public toString() {
        return '~' + this.values[0].toString();
    }
    public verify(): ValidType {
        return "maybe";
    }
}

export default ExprNot;
