import {getSequent, setToList} from "../utils/LogicUtils";
import ExprAny from "./ExprAny";
import ExprCont from "./ExprCont";
import ExprIf from "./ExprIf";
import ExprNot from "./ExprNot";
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
                let index = -1; // index of P
                refAssumes.forEach((v,i) => {
                    const [tmpData,_tmpCalc] = getSequent(v,seqData,seqCalc);
                    if (tmpData.expr === null || data.expr === null)
                        throw "justifyNotIntro: internal error";
                    if (tmpData.expr.equals(data.expr.values[0]))
                        index = i;
                });
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

    public static justifyAndElim(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
    }

    public static justifyAndIntro(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
    }

    public static justifyOrElim(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
    }

    public static justifyOrIntro(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
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

    public static justifyIfIntro(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
    }

    public static justifyIffElim(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
    }

    public static justifyIffIntro(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
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
