import {ValidType} from "../utils/LogicUtils";
import ExprAtom from "./ExprAtom";

/**
 * Base class for logic expressions.
 */
abstract class ExprBase {
    protected _values: Array<ExprBase>;
    constructor(values: Array<ExprBase>) {
        this._values = values;
    }
    //abstract eval(): boolean;
    get values() {
        return this._values;
    }
    public abstract toString(): string;
    public abstract verify(): ValidType;
    public static parse(s: string): ExprBase {
        return new ExprAtom("");
    }
}

export default ExprBase;
