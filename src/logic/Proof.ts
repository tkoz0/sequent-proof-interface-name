import Sequent from "./Sequent";

/**
 * Represents a proof in a sequent system.
 */
class Proof {
    private _seqs : Map<string,Sequent>;
    constructor() {
        this._seqs = new Map<string,Sequent>();
    }
    get seqs() {
        return this._seqs;
    }
    public addSequent(s: Sequent) {
        if (this._seqs.has(s.id))
            throw "sequent with this ID already exists";
        else
            this._seqs.set(s.id,s);
    }
    public removeSequent(id: string) {
        if (this._seqs.has(id))
            this._seqs.delete(id);
        else
            throw "sequent with that ID does not exist";
    }
}

export default Proof;
