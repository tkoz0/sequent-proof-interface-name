import Sequent from "./Sequent";

/**
 * Represents a proof in a sequent system.
 */
class Proof {
    private _seqs : Map<string,number>;
    private _list : Array<Sequent>;
    constructor() {
        this._seqs = new Map<string,number>();
        this._list = [];
    }
    get seqs() {
        return this._seqs;
    }
    get list() {
        return this._list;
    }
    /**
     * Add a sequent to the proof.
     * @param s sequent to add
     * @param updater function for updating the React state
     * @returns true if the sequent was successfully added
     */
    public addSequent(s: Sequent, updater: any): boolean {
        if (this._seqs.has(s.id)) // do not allow duplicate IDs
            return false;
        else {
            let newList = [...this._list];
            newList.push(s);
            this._seqs.set(s.id,this._list.length);
            this._list = newList;
            updater(this._list);
            return true;
        }
    }
    /**
     * Remove a sequent from the proof. Sequents depending on it are affected.
     * @param id id of the sequent to remove
     * @returns true if the sequent was successfully removed
     */
    public removeSequent(id: string): boolean {
        if (this._seqs.has(id)) {
            this._seqs.delete(id);
            this._list = this._list.filter(s => s.id !== id);
            return true;
        }
        else
            return false;
    }
}

export default Proof;
