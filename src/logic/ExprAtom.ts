import {ValidType} from "../utils/LogicUtils";
import ExprBase from "./ExprBase";

class ExprAtom extends ExprBase {
    private _label: string;
    constructor(a: string) {
        super([]);
        this._label = a;
    }
    public toString() {
        return this.label;
    }
    public verify(): ValidType {
        return "maybe";
    }
    get label() {
        return this._label;
    }
}

export default ExprAtom;
