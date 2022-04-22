import {getSequent, setToList} from "../utils/LogicUtils";
import ExprAny from "./ExprAny";
import ExprNot from "./ExprNot";
import {SequentCalc, SequentData} from "./Sequent";

class Justification {
    // Individual justification functions assume referenced sequents are valid.
    // They modify calc.assumptions and set calc.valid
    // calc.assumptions starts as an empty set
    // Comment in the form of: Seq1,Seq2,... -> NewSeq
    // Sequents are written as {expr1,expr2,...}:=Expr

    // -> {P}:=P
    public static justifyAssume(data: SequentData, calc: SequentCalc,
            _seqData: SequentData[], _seqCalc: Map<string,SequentCalc>): void {
        if (data.refs.size > 0)
            calc.valid = false;
        else {
            calc.assumptions.add(data.id);
            calc.valid = true;
        }
    }

    // {G}:=~~P -> {G}:=P
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

    public static justifyNotIntro(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
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

    public static justifyIfElim(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
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

    public static justifyContElim(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
    }

    public static justifyContIntro(data: SequentData, calc: SequentCalc,
            seqData: SequentData[], seqCalc: Map<string,SequentCalc>): void {
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
