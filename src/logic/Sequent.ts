import {InferenceRule, ValidType} from "../utils/LogicUtils";
import ExprBase from "./ExprBase";

// TODO support changing IDs

/**
 * Represents a sequent within a proof.
 */
class Sequent {
    private _comment: String;
    private _expr: ExprBase | null;
    private _id: string;
    private _ref_by: Set<string>;
    private _refs: Set<string>;
    private _rule: InferenceRule;
    private _valid: ValidType;
    constructor(id: string, expr: ExprBase | null = null, comment = "",
                ref_by = new Set<string>(), refs = new Set<string>(),
                rule: InferenceRule = null, valid: ValidType = "unknown") {
        if (id.match(/.+/))
            this._id = id;
        else
            throw "sequent ID cannot be empty";
        this._expr = expr;
        this._comment = comment;
        this._ref_by = ref_by;
        this._refs = refs;
        this._rule = rule;
        this._valid = valid;
    }
    get comment() {
        return this._comment;
    }
    get expr() {
        return this._expr;
    }
    get id() {
        return this._id;
    }
    get ref_by() {
        return this._ref_by;
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
}

export default Sequent;
