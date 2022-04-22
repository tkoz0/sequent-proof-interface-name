import React, {useState} from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import Menu from './components/Menu';
import ProofList from './components/ProofList';
import "./App.css";
import {SequentData, SequentCalc} from './logic/Sequent';
import {ENABLE_PARSER_TEST} from './utils/Constants';
import ParserTestButton from './components/ParserTestButton';
import Justification from './logic/Justification';

function App() {
    // list of sequents representing the proof
    const [seqData, setSeqData] = useState<SequentData[]>([]);
    // list of extra data for sequents during runtime
    const [seqCalc, setSeqCalc] = useState(new Map<string,SequentCalc>());
    // which sequent is being edited or null
    const [editing, setEditing] = useState<string | null>(null);

    /**
     * Resets the proof to a blank list.
     */
    const clearProof = (): void => {
        setSeqData([]);
        setSeqCalc(new Map<string,SequentCalc>());
        setEditing(null);
    };

    /**
     * Sets the sequent to editing, only when no sequent is currently editing.
     * @param id sequent ID
     * @returns true if set to editing
     */
    const editSequent = (id: string): boolean => {
        if (editing !== null)
            return false;
        const calc = seqCalc.get(id);
        if (calc === undefined)
            throw "editSequent: nonexistent ID";
        const data = seqData[calc.index];
        const newSeqCalc = new Map<string,SequentCalc>();
        seqCalc.forEach((v,k) => {
            newSeqCalc.set(k,{
                ...v,
                canCheck: v.index < calc.index,
                checked: data.refs.has(k)
            });
        });
        setSeqCalc(newSeqCalc);
        setEditing(id);
        return true;
    };

    /**
     * Sets the sequent to done, only when it is currently editing. This
     * function handles calculating some of the properties.
     * @param id sequent ID
     * @param seq new sequent data
     * @returns true if set to done
     */
    const finishSequent = (id: string, seq: SequentData): boolean => {
        if (editing !== id)
            return false;
        const calc = seqCalc.get(id);
        if (calc === undefined)
            throw "finishSequent: nonexistent ID";
        const newSeqCalc = new Map<string,SequentCalc>();
        const newRefs = new Set<string>();
        seqCalc.forEach((v,k) => {
            if (v.checked)
                newRefs.add(k);
            newSeqCalc.set(k,{
                ...v,
                canCheck: false,
                checked: false
            });
        });
        let newSeqData = [...seqData.slice(0,calc.index),
                    {
                        ...seq,
                        refs: newRefs
                    },...seqData.slice(calc.index+1)];
        newSeqData.forEach(v => { // update ref_by
            if (newRefs.has(v.id))
                v.ref_by.add(v.id);
            else
                v.ref_by.delete(v.id);
        });
        Justification.justify_reachable(id,newSeqData,newSeqCalc);
        setSeqData(newSeqData);
        setSeqCalc(newSeqCalc);
        setEditing(null);
        return true;
    };

    /**
     * Replace data for a sequent in the state.
     * @param id sequent ID
     * @param sd sequent data
     */
    const updateData = (id: string, sd: SequentData): void => {
        const newSeqData = [...seqData];
        const calc = seqCalc.get(id);
        if (calc === undefined)
            throw "updateData: nonexistent ID";
        newSeqData[calc.index] = sd;
        setSeqData(newSeqData);
    };

    /**
     * Replace calculated data for a sequent in the state.
     * @param id sequent ID
     * @param sc sequent calculated data
     */
    const updateCalc = (id: string, sc: SequentCalc): void => {
        const newSeqCalc = new Map<string,SequentCalc>();
        seqCalc.forEach((v,k) => newSeqCalc.set(k,v));
        newSeqCalc.set(id,sc);
        setSeqCalc(newSeqCalc);
    }

    /**
     * Adds a sequent to the end of the proof list.
     * @param s sequent object
     * @returns true if added successfully, null if currently in edit mode
     */
    const addSequent = (s: SequentData): boolean => {
        if (seqCalc.has(s.id))
            alert("Sequent with this ID already exists.");
        else if (editing !== null)
            alert("Please finish editing the current sequent.");
        else {
            updateCalc(s.id,{
                assumptions: new Set<string>(),
                canCheck: false,
                checked: false,
                index: seqData.length,
                valid: false
            });
            setSeqData([...seqData,s]);
            return true;
        }
        return false;
    };

    /**
     * Removes a sequent from the proof list.
     * @param id id of the sequent to remove
     * @returns true if removed successfully
     */
    const removeSequent = (id: string): boolean => {
        const calc = seqCalc.get(id);
        if (calc === undefined)
            return false;
        if (editing === id)
            finishSequent(id,seqData[calc.index]);
        const toUpdate = seqData[calc.index].ref_by;
        const newSeqData = [...seqData.slice(0,calc.index),
                        ...seqData.slice(calc.index+1)];
        const newSeqCalc = new Map<string,SequentCalc>();
        seqCalc.forEach((v,k) => newSeqCalc.set(k,v));
        newSeqCalc.delete(id);
        newSeqData.forEach((v,i) => {
            const calc2 = newSeqCalc.get(v.id);
            if (calc2 === undefined) // should never happen
                throw "removeSequent: internal error";
            newSeqCalc.set(v.id,{
                ...calc2,
                index: i
            });
            v.refs.delete(id);
            v.ref_by.delete(id);
        });
        toUpdate.forEach(s =>
            Justification.justify_reachable(s,newSeqData,newSeqCalc));
        setSeqData(newSeqData);
        setSeqCalc(newSeqCalc);
        return true;
    };

    /**
     * Swaps order of 2 sequents. This is meant to move a sequent up/down.
     * Returns false if reordering would make a sequent depend on a later one.
     * @param id id of the sequent
     * @param offset offset of sequent to swap with (must be -1 or 1)
     * @returns false if swap is not allowed
     */
    const moveSequent = (id: string, offset: number): boolean => {
        const calc1 = seqCalc.get(id);
        if (calc1 === undefined)
            return true;
        const i = calc1.index - (offset === 1 ? 0 : 1); // lower index
        if (i === -1 || i === seqData.length-1)
            return true;
        if (seqData[i+1].refs.has(seqData[i].id)) // swap not allowed
            return false;
        const newSeqCalc = new Map<string,SequentCalc>();
        seqCalc.forEach((v,k) => {
            if (v.index === i)
                newSeqCalc.set(k,{...v,index:i+1})
            else if (v.index === i+1)
                newSeqCalc.set(k,{...v,index:i});
            else
                newSeqCalc.set(k,v);
        });
        const newSeqData = [...seqData.slice(0,i),seqData[i+1],
                    seqData[i],...seqData.slice(i+2)];
        setSeqData(newSeqData);
        setSeqCalc(newSeqCalc);
        return true;
    };

    return (
        <>
            <Header />
            <Menu addSequent={addSequent}
                  clearProof={clearProof}
                  editing={editing} />
            <ProofList seqData={seqData} seqCalc={seqCalc}
                updateData={updateData} updateCalc={updateCalc}
                removeSequent={removeSequent}
                moveSequent={moveSequent} editing={editing}
                editSequent={editSequent} finishSequent={finishSequent} />
            <Footer />
            {ENABLE_PARSER_TEST && <ParserTestButton />}
        </>
    );
}

export default App;
