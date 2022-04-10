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

    /**
     * Convert to a string for display.
     * @returns string representation
     */
    public abstract toString(): string;

    /**
     * Convert a string to logic expression.
     * @param s input string
     * @returns logic expression
     */
    public static parse(s: string): ExprBase {
        return new ExprAtom("");
    }
}

export default ExprBase;
