import {bipartiteMatch, getSequent, indexOfSequent, indexOfSequent2, sameExprs, setToList} from "../utils/LogicUtils";
import ExprAnd from "./ExprAnd";
import ExprAny from "./ExprAny";
import ExprBase from "./ExprBase";
import ExprCont from "./ExprCont";
import ExprIf from "./ExprIf";
import ExprIff from "./ExprIff";
import ExprNot from "./ExprNot";
import ExprOr from "./ExprOr";
import {SequentCalc, SequentData} from "./Sequent";

class Justification {
    // Individual justification functions assume referenced sequents are valid.
    // They modify calc.assumptions and set calc.valid
    // calc.assumptions starts as an empty set
    // Comment in the form of: Seq1,Seq2,... -> NewSeq
    // Sequents are written as {expr1,expr2,...}:=Expr

    // -> {P}:=P (any P)
    public static justifyAssume(data: SequentData, calc: SequentCalc,
            _seqData: SequentData[], _seqCalc: Map<string,SequentCalc>): void {
        if (data.refs.size > 0)
            calc.valid = false;
        else {
            calc.assumptions.add(data.id);
            calc.valid = true;
        }
    }

    // G:=~~P -> G:=P (any P)
    private static notElimPattern = new ExprNot(new ExprNot(new ExprAny()));
    public static justifyNotElim(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
        if (data.expr === null || data.refs.size !== 1)
            calc.valid = false;
        else { // pattern match the ref expr
            const refs = setToList(data.refs);
            const [refData,refCalc] = getSequent(refs[0],seqData,seqCalc);
            if (refData.expr === null)
                throw "justifyNotElim: internal error";
            if (Justification.notElimPattern.equals(refData.expr)) {
                const refInnerExpr = refData.expr.values[0].values[0];
                if (refInnerExpr.equals(data.expr)) {
                    calc.valid = true;
                    // copy assumptions from ref expr
                    refCalc.assumptions.forEach(s => calc.assumptions.add(s));
                    return;
                }
            }
            calc.valid = false;
        }
    }

    // (G union {P}):=(cont) -> G:=(not P)
    private static notIntroCont = new ExprCont();
    private static notIntroPattern = new ExprNot(new ExprAny());
    public static justifyNotIntro(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
        if (data.expr === null || data.refs.size !== 1)
            calc.valid = false;
        else {
            const refs = setToList(data.refs);
            const [refData,refCalc] = getSequent(refs[0],seqData,seqCalc);
            if (refData.expr === null)
                throw "justifyNotIntro: internal error";
            // ref expr must be contradiction, match expr to not P
            if (refData.expr.equals(Justification.notIntroCont)
                && Justification.notIntroPattern.equals(data.expr)) {
                const refAssumes = setToList(refCalc.assumptions);
                const index = indexOfSequent(data.expr.values[0],refAssumes,
                                                seqData,seqCalc);
                if (index !== -1) {
                    calc.valid = true;
                    // copy assumptions except P
                    refAssumes.forEach((v,i) => {
                        if (i !== index)
                            calc.assumptions.add(v);
                    });
                    return;
                }
            }
            calc.valid = false;
        }
    }

    // G:=(and P1 P2 ...) -> G:=Pi (any Pi from P1,P2,...)
    public static justifyAndElim(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
        if (data.expr === null || data.refs.size !== 1)
            calc.valid = false;
        else {
            const refs = setToList(data.refs);
            const [refData,refCalc] = getSequent(refs[0],seqData,seqCalc);
            if (refData.expr === null)
                throw "justifyAndElim: internal error";
            if (refData.expr instanceof ExprAnd) {
                const index = indexOfSequent2(data.expr,refData.expr.values);
                if (index !== -1) { // found Pi in P1,P2,...
                    calc.valid = true;
                    refCalc.assumptions.forEach(s => calc.assumptions.add(s));
                    return;
                }
            }
            calc.valid = false;
        }
    }

    // G1:=P1, G2:=P2, ... -> (G1 union G2 union ...):=(and P1 P2 ...)
    public static justifyAndIntro(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
        if (data.expr === null || data.refs.size !== data.expr.values.length
            || !(data.expr instanceof ExprAnd))
            calc.valid = false;
        else {
            const refs = setToList(data.refs);
            const refData: SequentData[] = [];
            const refCalc: SequentCalc[] = [];
            refs.forEach(s => { // get objects for referenced sequents
                const [tmpData,tmpCalc] = getSequent(s,seqData,seqCalc);
                refData.push(tmpData);
                refCalc.push(tmpCalc);
            });
            const refExprs: ExprBase[] = [];
            refData.forEach(v => {
                if (v.expr === null)
                    throw "justifyAndIntro: internal error";
                refExprs.push(v.expr);
            });
            if (sameExprs(refExprs,data.expr.values)) {
                calc.valid = true;
                refCalc.forEach(v => {
                    v.assumptions.forEach(s => calc.assumptions.add(s));
                });
                return;
            }
            calc.valid = false;
        }
    }

    // G:=(or P1 P2 ...), (G1 union {P1}):=Q, (G2 union {P2}):=Q, ...
    // -> (G union G1 union G2 union ...):=Q
    public static justifyOrElim(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
        if (data.expr === null)
            calc.valid = false;
        else {
            const refs = setToList(data.refs);
            const refData: SequentData[] = [];
            const refCalc: SequentCalc[] = [];
            const refExprs: ExprBase[] = [];
            refs.forEach(s => { // get objects for referenced sequents
                const [tmpData,tmpCalc] = getSequent(s,seqData,seqCalc);
                refData.push(tmpData);
                refCalc.push(tmpCalc);
                if (tmpData.expr === null)
                    throw "justifyOrElim: internal error";
                refExprs.push(tmpData.expr);
            });
            for (let g = 0; g < refs.length; ++g) { // find main OR statement
                if (!(refExprs[g] instanceof ExprOr))
                    continue;
                if (refExprs[g].values.length + 1 !== refExprs.length)
                    continue; // must match each part of the OR to a sequent
                // all other refs exprs must be Q
                let allQ = true;
                refExprs.forEach((v,i) => {
                    if (data.expr === null)
                        throw "justifyOrElim: internal error";
                    if (i !== g && !data.expr.equals(v))
                        allQ = false;
                });
                if (!allQ)
                    continue;
                // match main OR to assumptions of ref indexes i != g
                const refIds: string[] = [];
                refData.forEach((v,i) => {
                    if (i !== g)
                        refIds.push(v.id);
                });
                const m = bipartiteMatch(data.expr.values,refIds,
                                            seqData,seqCalc);
                if (m.length < refExprs[g].values.length)
                    continue; // not all matched
                m.forEach(v => { // set assumption set
                    const [tmpExpr,tmpId] = v;
                    const [_idData,idCalc] = getSequent(tmpId,seqData,seqCalc);
                    const assumeList = setToList(idCalc.assumptions);
                    const i = indexOfSequent(tmpExpr,
                        assumeList,seqData,seqCalc);
                    if (i === -1)
                        throw "justifyOrElim: internal error (index)";
                    // insert assumptions except for the matched expression
                    assumeList.forEach((v,j) => {
                        if (j !== i)
                            calc.assumptions.add(v);
                    });
                });
                refCalc[g].assumptions.forEach(s => calc.assumptions.add(s));
                calc.valid = true;
                return;
            }
            calc.valid = false;
        }
    }

    // G:=Pi -> G:=(or P1 P2 ...) (where Pi is in the P1,P2,...)
    public static justifyOrIntro(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
        if (data.expr === null || data.refs.size !== 1)
            calc.valid = false;
        else {
            const refs = setToList(data.refs);
            const [refData,refCalc] = getSequent(refs[0],seqData,seqCalc);
            if (refData.expr === null)
                throw "justifyOrIntro: internal error";
            if (data.expr instanceof ExprOr) {
                const index = indexOfSequent2(refData.expr,data.expr.values);
                if (index !== -1) {
                    calc.valid = true;
                    refCalc.assumptions.forEach(s => calc.assumptions.add(s));
                    return;
                }
            }
            calc.valid = false;
        }
    }

    // G1:=P, G2:=(if P Q) -> (G1 union G2):=Q (any P,Q)
    private static ifElimPattern = new ExprIf(new ExprAny(), new ExprAny());
    public static justifyIfElim(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
        if (data.expr === null || data.refs.size !== 2)
            calc.valid = false;
        else {
            const refs = setToList(data.refs);
            const [r1data,r1calc] = getSequent(refs[0],seqData,seqCalc);
            const [r2data,r2calc] = getSequent(refs[1],seqData,seqCalc);
            if (r1data.expr === null || r2data.expr === null)
                throw "justifyIfElim: internal error";
            if ((Justification.ifElimPattern.equals(r1data.expr)
                && r1data.expr.values[0].equals(r2data.expr)
                && r1data.expr.values[1].equals(data.expr))
                || (Justification.ifElimPattern.equals(r2data.expr)
                && r2data.expr.values[0].equals(r1data.expr)
                && r2data.expr.values[1].equals(data.expr))) {
                calc.valid = true;
                r1calc.assumptions.forEach(s => calc.assumptions.add(s));
                r2calc.assumptions.forEach(s => calc.assumptions.add(s));
                return;
            }
            calc.valid = false;
        }
    }

    // (G union {P}):=Q -> G:=(if P Q)
    private static ifIntroPattern = new ExprIf(new ExprAny(), new ExprAny());
    public static justifyIfIntro(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
        if (data.expr === null || data.refs.size !== 1)
            calc.valid = false;
        else {
            const refs = setToList(data.refs);
            const [refData,refCalc] = getSequent(refs[0],seqData,seqCalc);
            if (refData.expr === null)
                throw "justifyIfIntro: internal error";
            if (Justification.ifIntroPattern.equals(data.expr)
                && data.expr.values[1].equals(refData.expr)) {
                const refAssumes = setToList(refCalc.assumptions);
                const index = indexOfSequent(data.expr.values[0],refAssumes,
                                                seqData,seqCalc);
                if (index !== -1) {
                    calc.valid = true;
                    refAssumes.forEach((v,i) => {
                        if (i !== index)
                            calc.assumptions.add(v);
                    });
                    return;
                }
            }
            calc.valid = false;
        }
    }

    // G1:=P, G2:=(iff P Q) -> (G1 union G2):=Q
    private static iffElimPattern = new ExprIff(new ExprAny(), new ExprAny());
    public static justifyIffElim(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
        if (data.expr === null || data.refs.size !== 2)
            calc.valid = false;
        else {
            const refs = setToList(data.refs);
            const [r1data,r1calc] = getSequent(refs[0],seqData,seqCalc);
            const [r2data,r2calc] = getSequent(refs[1],seqData,seqCalc);
            if (r1data.expr === null || r2data.expr === null)
                throw "justifyIffElim: internal error";
            if ((Justification.iffElimPattern.equals(r1data.expr)
                && sameExprs(r1data.expr.values,[r2data.expr,data.expr]))
                || (Justification.iffElimPattern.equals(r2data.expr)
                && sameExprs(r2data.expr.values,[r1data.expr,data.expr]))) {
                calc.valid = true;
                r1calc.assumptions.forEach(s => calc.assumptions.add(s));
                r2calc.assumptions.forEach(s => calc.assumptions.add(s));
                return;
            }
            calc.valid = false;
        }
    }

    // (G1 union {P}):=Q, (G2 union {Q}):=P -> (G1 union G2):=(iff P Q)
    private static iffIntroPattern = new ExprIff(new ExprAny(), new ExprAny());
    public static justifyIffIntro(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
        if (data.expr === null || data.refs.size !== 2)
            calc.valid = false;
        else {
            const refs = setToList(data.refs);
            const [r1data,r1calc] = getSequent(refs[0],seqData,seqCalc);
            const [r2data,r2calc] = getSequent(refs[1],seqData,seqCalc);
            if (r1data.expr === null || r2data.expr === null)
                throw "justifyIffIntro: internal error";
            if (Justification.iffIntroPattern.equals(data.expr)) {
                const r1assumes = setToList(r1calc.assumptions);
                const r2assumes = setToList(r2calc.assumptions);
                let i1 = -1;
                let i2 = -1;
                if (data.expr.values[0].equals(r1data.expr)
                    && data.expr.values[1].equals(r2data.expr)) {
                    i1 = indexOfSequent(data.expr.values[1],
                        r1assumes,seqData,seqCalc);
                    i2 = indexOfSequent(data.expr.values[0],
                        r2assumes,seqData,seqCalc);
                }
                if (data.expr.values[0].equals(r2data.expr)
                    && data.expr.values[1].equals(r1data.expr)) {
                    i1 = indexOfSequent(data.expr.values[0],
                        r1assumes,seqData,seqCalc);
                    i2 = indexOfSequent(data.expr.values[1],
                        r2assumes,seqData,seqCalc);
                }
                if (i1 !== -1 && i2 !== -2) {
                    calc.valid = true;
                    r1assumes.forEach((v,i) => {
                        if (i !== i1)
                            calc.assumptions.add(v);
                    });
                    r2assumes.forEach((v,i) => {
                        if (i !== i2)
                            calc.assumptions.add(v);
                    });
                    return;
                }
            }
            calc.valid = false;
        }
    }

    // G:=(cont) -> G:=P (any P)
    private static contElimCont = new ExprCont();
    public static justifyContElim(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
        if (data.refs.size !== 1)
            calc.valid = false;
        else {
            const refs = setToList(data.refs);
            const [refData,refCalc] = getSequent(refs[0],seqData,seqCalc);
            if (refData.expr === null)
                throw "justifyContElim: internal error";
            if (Justification.contElimCont.equals(refData.expr)) {
                calc.valid = true;
                refCalc.assumptions.forEach(s => calc.assumptions.add(s));
                return;
            }
            calc.valid = false;
        }
    }

    // G1:=P, G2:=(not P) -> (G1 union G2):=(cont) (any P)
    private static contIntroCont = new ExprCont();
    public static justifyContIntro(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
        if (data.expr === null || data.refs.size !== 2
            || !data.expr.equals(Justification.contIntroCont))
            calc.valid = false;
        else {
            const refs = setToList(data.refs);
            const [r1data,r1calc] = getSequent(refs[0],seqData,seqCalc);
            const [r2data,r2calc] = getSequent(refs[1],seqData,seqCalc);
            if (r1data.expr === null || r2data.expr === null)
                throw "justifyContIntro: internal error";
            // expressions are ~P,P in either order
            if (r1data.expr.equals(new ExprNot(r2data.expr))
                || r2data.expr.equals(new ExprNot(r1data.expr))) {
                calc.valid = true;
                r1calc.assumptions.forEach(s => calc.assumptions.add(s));
                r2calc.assumptions.forEach(s => calc.assumptions.add(s));
                return;
            }
            calc.valid = false;
        }
    }

    /**
     * Checks a sequent for correctness and modifies the data arrays as
     * necessary.
     * @param id sequent ID
     * @param seqData main data array
     * @param seqCalc main calc array
     * @throws exception if an error occurs
     */
    public static justify(id: string, seqData: SequentData[],
                        seqCalc: Map<string,SequentCalc>) {
        const calc = seqCalc.get(id);
        if (calc === undefined)
            throw "justify: nonexistent ID";
        const data = seqData[calc.index];
        const refsData: SequentData[] = []; // list of the refs
        const refsAssumes: Set<string>[] = [];
        let anyInvalid = false; // check if any refs are not valid
        data.refs.forEach(s => {
            const calc2 = seqCalc.get(s);
            if (calc2 === undefined)
                throw "justify: nonexistent ID";
            refsData.push(seqData[calc2.index]);
            refsAssumes.push(calc2.assumptions);
            if (!calc2.valid)
                anyInvalid = true;
        });
        const expr = data.expr; // logic expression
        calc.assumptions = new Set<string>(); // start with no assumptions
        if (expr === null || anyInvalid) {
            calc.valid = false;
            return;
        }
        // all refs are valid, expr is not null
        switch (data.rule) {
            case "": // not justified
                calc.valid = false;
                break;
            case "assume":
                Justification.justifyAssume(data,calc,seqData,seqCalc);
                break;
            case "notE":
                Justification.justifyNotElim(data,calc,seqData,seqCalc);
                break;
            case "notI":
                Justification.justifyNotIntro(data,calc,seqData,seqCalc);
                break;
            case "andE":
                Justification.justifyAndElim(data,calc,seqData,seqCalc);
                break;
            case "andI":
                Justification.justifyAndIntro(data,calc,seqData,seqCalc);
                break;
            case "orE":
                Justification.justifyOrElim(data,calc,seqData,seqCalc);
                break;
            case "orI":
                Justification.justifyOrIntro(data,calc,seqData,seqCalc);
                break;
            case "ifE":
                Justification.justifyIfElim(data,calc,seqData,seqCalc);
                break;
            case "ifI":
                Justification.justifyIfIntro(data,calc,seqData,seqCalc);
                break;
            case "iffE":
                Justification.justifyIffElim(data,calc,seqData,seqCalc);
                break;
            case "iffI":
                Justification.justifyIffIntro(data,calc,seqData,seqCalc);
                break;
            case "contE":
                Justification.justifyContElim(data,calc,seqData,seqCalc);
                break;
            case "contI":
                Justification.justifyContIntro(data,calc,seqData,seqCalc);
                break;
            default: // will never happen
                throw "justify: invalid rule";
        }
    }

    /**
     * Checks all sequents.
     * @param data main data array
     * @param calc main calc array
     * @throws error if there is a problem justifying any sequent
     */
    public static justify_all(data: SequentData[],
                        calc: Map<string,SequentCalc>) {
        const ids: string[] = [];
        data.forEach(v => ids.push(v.id));
        ids.forEach(id => Justification.justify(id,data,calc));
    }

    /**
     * Updates a root sequent and all those that depend on it.
     * @param id root sequent ID
     * @param data main data array
     * @param calc main calc array
     */
    public static justify_reachable(id: string, data: SequentData[],
                        calc: Map<string,SequentCalc>) {
        const queue = [id];
        let i = 0;
        while (i < queue.length) {
            Justification.justify(queue[i],data,calc);
            const seqCalc = calc.get(queue[i]);
            if (seqCalc === undefined)
                throw "justify_reachable: nonexistent sequent ID";
            data[seqCalc.index].ref_by.forEach(s => queue.push(s));
            ++i;
        }
    }

    /**
     * Checks validity of the sequent data. Throws an exception if there is a
     * problem (disallowed sequent reference).
     * @param data main data array
     * @param calc main calc array
     * @throws exception if there is a problem with the data
     */
    public static check_refs(data: SequentData[],
                        calc: Map<string,SequentCalc>) {
        ;
    }
}

export default Justification;
