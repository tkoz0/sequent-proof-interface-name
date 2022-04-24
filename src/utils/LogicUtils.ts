import ExprBase from "../logic/ExprBase";
import {SequentCalc, SequentData} from "../logic/Sequent";

/**
 * Specifies an inference rule (or none).
 */
type InferenceRule = "" | "assume" | "notE" | "notI" | "andE" | "andI"
    | "orE" | "orI" | "ifE" | "ifI" | "iffE" | "iffI" | "contE" | "contI";

/**
 * Atom names must start with a letter or _ and contain letters, _, and digits.
 */
const REGEX_ATOM = /[a-zA-z_][0-9a-zA-z_]*/;

const REGEX_ATOM_START = /[a-zA-z_]/;

const REGEX_WHITESPACE = /[ \n\t]*/;

const REGEX_NONWHITESPACE_CHAR = /[^ \n\t]/;

/**
 * Compute a bipartite matching for the OR elim rule. The expressions from the
 * main OR must each go to a referencecd sequent having that expression in its
 * assumptions. Uses the Ford-Fulkerson algorithm.
 * 
 * This code is largely based on the JavaScript pseudocode on GeeksforGeeks
 * https://www.geeksforgeeks.org/ford-fulkerson-algorithm-for-maximum-flow-problem/
 * 
 * @param X expressions from the main OR
 * @param Y referenced sequents to match to
 * @param data main data array
 * @param calc main calc array
 * @returns a maximum bipartite matching
 */
const bipartiteMatch = (X: ExprBase[], Y: string[], data: SequentData[],
        calc: Map<string,SequentCalc>): [ExprBase,string][] => {
    return [];
};

/**
 * Gets the data and calc objects for a sequent given the ID, assuming that no
 * errors will occur.
 * @param id sequent ID
 * @param data sequent data array
 * @param calc sequent calc array
 * @returns the data and calc objects for the desired sequent
 */
const getSequent = (id: string, data: SequentData[],
        calc: Map<string,SequentCalc>): [SequentData,SequentCalc] => {
    const idCalc = calc.get(id);
    if (idCalc === undefined)
        throw "getSequent: invalid ID";
    return [data[idCalc.index],idCalc];
};

/**
 * Returns the smallest index of idList such that the sequent with that ID has
 * expr, or -1 if not found.
 * @param expr expression to find
 * @param idList list of sequent IDs to try
 * @param data main data array
 * @param calc main calc array
 */
const indexOfSequent = (expr: ExprBase, idList: string[], data: SequentData[],
        calc: Map<string,SequentCalc>): number => {
    for (let i = 0; i < idList.length; ++i) {
        const [tmpData,_tmpCalc] = getSequent(idList[i],data,calc);
        if (tmpData.expr === null)
            throw "indexOfSequent: internal error";
        if (expr.equals(tmpData.expr))
            return i;
    }
    return -1;
};

/**
 * Find the index of an expression in a list.
 * @param expr expression to find
 * @param exprList list of expressions
 * @returns smallest index with expression equal to expr or -1 if not found
 */
const indexOfSequent2 = (expr: ExprBase, exprList: ExprBase[]): number => {
    for (let i = 0; i < exprList.length; ++i)
        if (expr.equals(exprList[i]))
            return i;
    return -1;
};

/**
 * Returns true if each list contains the same expressions, ignoring order.
 * @param a first list
 * @param b second list
 */
const sameExprs = (a: ExprBase[], b: ExprBase[]): boolean => {
    if (a.length !== b.length)
        return false;
    const bMatched: boolean[] = [];
    b.forEach(() => bMatched.push(false));
    // for each element of a, set a true in bMatched
    a.forEach(v => {
        for (let i = 0; i < b.length; ++i)
            if (!bMatched[i] && v.equals(b[i])) {
                bMatched[i] = true;
                break;
            }
    });
    return bMatched.reduce((prev,curr) => prev && curr);
};

/**
 * Converts a set to a list.
 * @param s a set
 * @returns a list containing the elements in the set
 */
const setToList = <T>(s: Set<T>): T[] => {
    const ret: T[] = [];
    s.forEach(v => ret.push(v));
    return ret;
};

export type {InferenceRule};

export {REGEX_ATOM, REGEX_ATOM_START, REGEX_WHITESPACE,
        REGEX_NONWHITESPACE_CHAR, bipartiteMatch, getSequent, setToList,
        indexOfSequent, indexOfSequent2, sameExprs};
