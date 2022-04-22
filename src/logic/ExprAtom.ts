import {REGEX_ATOM} from "../utils/LogicUtils";
import ExprBase from "./ExprBase";

/**
 * Representation of an atom (single variable).
 */
class ExprAtom extends ExprBase {
    private _label: string;
    constructor(a: string) {
        super([]);
        if (a.match(REGEX_ATOM))
            this._label = a;
        else
            throw "invalid atom";
    }
    public toString() {
        return this.label;
    }
    public toSaveString() {
        return this.label;
    }
    get label() {
        return this._label;
    }
    public equals(a: ExprBase): boolean {
        return (a instanceof ExprAtom) && this.label === a.label;
    }
}

export default ExprAtom;
