import {REGEX_ATOM, REGEX_ATOM_START, REGEX_NONWHITESPACE_CHAR, REGEX_WHITESPACE} from "../utils/LogicUtils";
import ExprAnd from "./ExprAnd";
import ExprAtom from "./ExprAtom";
import ExprBase from "./ExprBase";
import ExprCont from "./ExprCont";
import ExprIf from "./ExprIf";
import ExprIff from "./ExprIff";
import ExprNot from "./ExprNot";
import ExprOr from "./ExprOr";

class Parser {
    private static skipWhitespace(a: string): string {
        let whitespace = a.match(REGEX_WHITESPACE);
        if (whitespace !== null)
            a = a.substring(whitespace[0].length);
        return a;
    }

    /**
     * Parse part of an expression, extracting from the string.
     * @param a the remaining string to parse
     * @returns parsed expression and string after it
     */
    private static parseHelper(a: string): [ExprBase | null, string] {
        let s = a;
        // skip whitespace at start
        s = Parser.skipWhitespace(s);
        let char = s.match(REGEX_NONWHITESPACE_CHAR);
        let expr = null;
        if (char === null)
            return [null,s];
        if (char[0] === '(') { // parse connective
            s = s.substring(1); // skip (
            s = Parser.skipWhitespace(s);
            let token = s.match(REGEX_ATOM);
            // based on token, parse components
            if (token === null)
                return [null,s];
            s = s.substring(token[0].length);
            if (token[0] === 'cont') { // no arguments
                expr = new ExprCont();
            } else { // 1 argument
                let expr1: ExprBase | null = null;
                [expr1,s] = Parser.parseHelper(s);
                if (expr1 === null)
                    return [null,s];
                if (token[0] === 'not')
                    expr = new ExprNot(expr1);
                else { // 2 arguments
                    let expr2: ExprBase | null = null;
                    [expr2,s] = Parser.parseHelper(s);
                    if (expr2 === null)
                        return [null,s];
                    if (token[0] === 'if')
                        expr = new ExprIf(expr1,expr2);
                    else if (token[0] === 'iff')
                        expr = new ExprIff(expr1,expr2);
                    else { // variable length
                        let exprs = [expr1,expr2];
                        for (;;) {
                            [expr1,s] = Parser.parseHelper(s);
                            if (expr1 === null)
                                break;
                            exprs.push(expr1);
                        }
                        if (token[0] === 'and')
                            expr = new ExprAnd(exprs);
                        else if (token[0] === 'or')
                            expr = new ExprOr(exprs);
                        else
                            return [null,s];
                    }
                }
            }
            s = Parser.skipWhitespace(s);
            char = s.match(REGEX_NONWHITESPACE_CHAR);
            if (char === null || char[0] !== ')')
                return [null,s];
            s = s.substring(1); // skip )
        } else if (char[0].match(REGEX_ATOM_START)) { // parse atom
            let atom = s.match(REGEX_ATOM);
            if (atom === null) // will never happen
                throw "null atom error";
            expr = new ExprAtom(atom[0]);
            s = s.substring(atom[0].length);
        }
        else
            return [null,s];
        s = Parser.skipWhitespace(s);
        return [expr,s];
    }

    /**
     * Parses a string into a logic expression. This parser uses the Lisp S
     * expression style used by Slate.
     * TODO extend to support several statements for AND and OR
     * TODO support case insensitivity for connective name
     * TODO throw better error messages
     * @param a string to parse
     * @returns logic expression or null if invalid
     */
    public static parse(a: string): ExprBase | null {
        let [expr,s] = Parser.parseHelper(a);
        if (s !== "")
            return null;
        return expr;
    }
}

export default Parser;
