import {ValidType} from "../utils/LogicUtils";
import ExprBase from "./ExprBase";

class ExprIff extends ExprBase {
    constructor(a: ExprBase, b: ExprBase) {
        super([a,b]);
    }
    public toString() {
        return '(' + this.values[0].toString() + ' <-> ' + this.values[1].toString() + ')';
    }
    public verify(): ValidType {
        return "maybe";
    }
}

export default ExprIff;
