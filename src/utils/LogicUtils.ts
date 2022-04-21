
/**
 * Specifies an inference rule (or none).
 */
type InferenceRule = "" | "assume" | "thin"
                        | "notE" | "notI"
                        | "andE" | "andI"
                        | "orE" | "orI"
                        | "ifE" | "ifI"
                        | "iffE" | "iffI"
                        | "contE" | "contI";

/**
 * Atom names must start with a letter or _ and contain letters, _, and digits.
 */
let REGEX_ATOM = /[a-zA-z_][0-9a-zA-z_]*/;

let REGEX_ATOM_START = /[a-zA-z_]/;

let REGEX_WHITESPACE = /[ \n\t]*/;

let REGEX_NONWHITESPACE_CHAR = /[^ \n\t]/;

export type {InferenceRule};

export {REGEX_ATOM, REGEX_ATOM_START, REGEX_WHITESPACE,
        REGEX_NONWHITESPACE_CHAR};
