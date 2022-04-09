import {ValidType} from "../utils/LogicUtils";
import ExprBase from "./ExprBase";

class ExprOr extends ExprBase {
    constructor(a: ExprBase, b: ExprBase) {
        super([a,b]);
    }
    public toString() {
        return '(' + this.values[0].toString() + ' | ' + this.values[1].toString() + ')';
    }
    public verify(): ValidType {
        return "maybe";
    }
}

export default ExprOr;
