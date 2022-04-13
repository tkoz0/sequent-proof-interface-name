import {REGEX_ATOM, REGEX_ATOM_START, REGEX_NONWHITESPACE_CHAR, REGEX_WHITESPACE} from "../utils/LogicUtils";

/**
 * Base class for propositional logic expressions.
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
}

export default ExprBase;
