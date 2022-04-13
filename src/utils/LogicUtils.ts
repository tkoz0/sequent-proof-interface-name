
/**
 * Specifies an inference rule (or none).
 */
type InferenceRule = null | "assume" | "notE" | "notI" | "andE" | "andI"
                          | "orE" | "orI" | "ifE" | "ifI"
                          | "iffE" | "iffI" | "contE" | "contI";

/**
 * Specifies correctness of a sequent.
 * yes = correct and all its references are determined to be correct
 * no = incorrect
 * maybe = correct but not all references are determined to be correct
 * unknown = not checked
 */
type ValidType = "yes" | "no" | "maybe" | "unknown";

/**
 * Atom names must start with a letter or _ and contain letters, _, and digits.
 */
let REGEX_ATOM = /[a-zA-z_][0-9a-zA-z_]*/;

let REGEX_ATOM_START = /[a-zA-z_]/;

let REGEX_WHITESPACE = / */;

let REGEX_NONWHITESPACE_CHAR = /[^ ]/;

export type {InferenceRule, ValidType};

export {REGEX_ATOM, REGEX_ATOM_START, REGEX_WHITESPACE,
        REGEX_NONWHITESPACE_CHAR};
