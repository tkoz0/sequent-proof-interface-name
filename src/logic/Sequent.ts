import {ValidType} from "../utils/LogicUtils";
import ExprBase from "./ExprBase";

class Sequent {
    private _expr: ExprBase;
    private _id: String;
    private _refs: String[] = [];
    private _rule: String = "";
    private _valid: ValidType = "maybe";
    constructor(id: String, expr: ExprBase) {
        this._expr = expr;
        this._id = id;
    }
    get expr() {
        return this._expr;
    }
    get id() {
        return this._id;
    }
    get refs() {
        return this._refs;
    }
    get rule() {
        return this._rule;
    }
    get valid() {
        return this._valid;
    }
    set valid(v) {
        this._valid = v;
    }
}

export default Sequent;
