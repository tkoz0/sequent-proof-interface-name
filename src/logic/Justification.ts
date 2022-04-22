import {SequentCalc, SequentData} from "./Sequent";

class Justification {
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
        const refs: string[] = []; // list of the refs
        data.refs.forEach(s => refs.push(s));
        const expr = data.expr; // logic expression
        if (expr === null) { // null expression cannot be correct
            calc.assumptions = new Set<string>();
            calc.valid = false;
            return;
        }
        const rule = data.rule; // justification rule
        calc.assumptions = new Set<string>(); // start with no assumptions
        switch (rule) {
            case "": // not justified
                calc.valid = false;
                break;
            case "assume": // {psi} := psi
                if (refs.length > 0) {
                    calc.valid = false;
                } else {
                    calc.assumptions.add(id);
                    calc.valid = true;
                }
                break;
            case "notE":
// TODO implement other justifications
                break;
            case "notI":
                break;
            case "andE":
                break;
            case "andI":
                break;
            case "orE":
                break;
            case "orI":
                break;
            case "ifE":
                break;
            case "ifI":
                break;
            case "iffE":
                break;
            case "iffI":
                break;
            case "contE":
                break;
            case "contI":
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
