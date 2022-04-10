import {InferenceRule, ValidType} from "../utils/LogicUtils";
import ExprBase from "./ExprBase";
import Proof from "./Proof";

// TODO support changing IDs

/**
 * Represents a sequent within a proof.
 */
class Sequent {
    private _comment: String = "";
    private _expr: ExprBase;
    private _id: string;
    private readonly _proof: Proof;
    private _refs: Set<string> = new Set<string>();
    private _rule: InferenceRule = null;
    private _valid: ValidType = "unknown";
    constructor(id: string, expr: ExprBase, proof: Proof) {
        this._expr = expr;
        if (id.match(/.+/))
            this._id = id;
        else
            throw "sequent ID cannot be empty";
        this._proof = proof;
    }
    get comment() {
        return this._comment;
    }
    set comment(c) {
        this._comment = c;
    }
    get expr() {
        return this._expr;
    }
    set expr(e) {
        this._expr = e;
    }
    get id() {
        return this._id;
    }
    get proof() {
        return this._proof;
    }
    get refs() {
        return this._refs;
    }
    get rule() {
        return this._rule;
    }
    set rule(r) {
        this._rule = r;
    }
    get valid() {
        return this._valid;
    }
    set valid(v) {
        this._valid = v;
    }
    public toggleRef(r: string) {
        if (this._refs.has(r))
            this._refs.delete(r);
        else
            this._refs.add(r);
    }
    public validCheck() {
        this._valid = "unknown";
        throw "Sequent.validCheck() not implemented";
    }
}

export default Sequent;
