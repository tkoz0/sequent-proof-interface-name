
/**
 * Base class for propositional logic expressions.
 */
abstract class ExprBase {
    protected _values: ExprBase[];
    constructor(values: ExprBase[]) {
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
     * Convert to a string for saving. This string can be parsed later.
     * @returns string for saving the expression
     */
    public abstract toSaveString(): string;

    /**
     * Compares 2 logic expressions for value equality.
     * @param a another logic expression
     * @returns true if they are the same expression, false otherwise
     */
    public abstract equals(a: ExprBase): boolean;

    /**
     * Compare lists of expressions, requiring them to be in the same order.
     * @param a expression list
     * @param b expression list
     * @returns true if the list have the same expressions in the same order
     */
    public static listsEqual(a: ExprBase[], b: ExprBase[]): boolean {
        if (a.length !== b.length)
            return false;
        for (let i = 0; i < a.length; ++i)
            if (!a[i].equals(b[i]))
                return false;
        return true;
    }
}

export default ExprBase;
