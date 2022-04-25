import {InferenceRule} from "../utils/LogicUtils";
import ExprBase from "./ExprBase";

/**
 * Represents a sequent within a proof, containing just the parts to save.
 * The ID must be nonempty. Sequents must only reference previous sequents.
 */
export type SequentData = {
    comment: string;       // comment text
    expr: ExprBase | null; // expression
    expr_text: string;     // string input for the expression
    id: string;            // unique nonempty identifier
    ref_by: Set<string>;   // sequents referencing this one
    refs: Set<string>;     // sequents this one references
    rule: InferenceRule;   // justification
};

/**
 * Represents runtime calculated details about a sequent.
 */
export type SequentCalc = {
    assumptions: Set<string>; // sequents its expression is a consequence of
    canCheck: boolean;        // enable/disable the checkbox
    checked: boolean;         // is the checkbox checked
    index: number;            // index in the main sequent list
    valid: boolean;           // is the sequent properly justified
    uuid: string;             // key for react list
};
