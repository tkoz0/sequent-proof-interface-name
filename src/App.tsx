import React, {useEffect, useRef, useState} from 'react';
import {v4 as uuid} from 'uuid';
import Footer from './components/Footer';
import Header from './components/Header';
import Menu from './components/Menu';
import ProofList from './components/ProofList';
import "./App.css";
import {SequentData, SequentCalc} from './logic/Sequent';
import {ENABLE_PARSER_TEST} from './utils/Constants';
import ParserTestButton from './components/ParserTestButton';
import Justification from './logic/Justification';
import {getSequent, InferenceRule, setToList} from './utils/LogicUtils';
import Parser from './logic/Parser';
import ExprBase from './logic/ExprBase';

function App() {
    // list of sequents representing the proof
    const [seqData, setSeqData] = useState<SequentData[]>([]);
    // list of extra data for sequents during runtime
    const [seqCalc, setSeqCalc] = useState(new Map<string,SequentCalc>());
    // which sequent is being edited or null
    const [editing, setEditing] = useState<string | null>(null);

    const onUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";
    };

    const cb = useRef(onUnload);
    useEffect(() => { cb.current = onUnload }, [onUnload]);
    useEffect(() => {
        window.addEventListener("beforeunload",onUnload);
        return () => window.removeEventListener("beforeunload",onUnload);
    },[]);

    /**
     * Resets the proof to a blank list.
     */
    const clearProof = (): void => {
        setSeqData([]);
        setSeqCalc(new Map<string,SequentCalc>());
        setEditing(null);
    };

    /**
     * Load a proof from file data. If an error occurs, throws an exception.
     * @param data string representation of the file
     * @returns true if file data was loaded, false otherwise
     * @throws except if there is an error parsing the file data
     */
    const loadProofFile = (data: string): boolean => {
        const jsonData = JSON.parse(data);
        const program = jsonData["program"] as string;
        const filetype = jsonData["filetype"] as string;
        const version = jsonData["version"] as number;
        if (program !== "spin")
            alert("Warning: program name data is incorrect");
        if (filetype !== "sequent-propositional")
            alert("Warning: filetype data is not supported");
        if (version !== 1)
            alert("Warning: file version is not supported");
        const proof = jsonData["proof"]["sequents"] as any[];
        const newSeqData: SequentData[] = [];
        const newSeqCalc = new Map<string,SequentCalc>();
        proof.forEach(obj => {
            const id = obj["id"] as string;
            if (newSeqCalc.has(id))
                throw "loadProofFile: duplicate sequent ID found";
            const expr = obj["expr"] as string;
            let expr_val: null | ExprBase = null;
            try {
                if (expr !== "")
                    expr_val = Parser.parse(expr);
            } catch (err) {
                throw "loadProofFile: error parsing a sequent";
            }
            const expr_text = obj["expr_text"] as string;
            const rule = obj["rule"] as string as InferenceRule;
            const refs = obj["refs"] as any[];
            const comment = obj["comment"] as string;
            const sequent: SequentData = {
                comment: comment,
                expr: expr_val,
                expr_text: expr_text,
                id: id,
                ref_by: new Set<string>(),
                refs: new Set<string>(),
                rule: rule
            };
            refs.forEach(u => {
                const v = u as string;
                if (!newSeqCalc.has(v))
                    throw "loadProofFile: sequent has invalid reference";
                sequent.refs.add(v);
            });
            newSeqCalc.set(id,{
                assumptions: new Set<string>(),
                canCheck: false,
                checked: false,
                index: newSeqData.length,
                valid: false,
                uuid: uuid()
            });
            newSeqData.push(sequent);
        });
        newSeqData.forEach(v => { // set ref_by
            v.refs.forEach(s => {
                const [tmpData,_tmpCalc] = getSequent(s,newSeqData,newSeqCalc);
                tmpData.ref_by.add(v.id);
            });
        });
        Justification.justify_all(newSeqData,newSeqCalc);
        clearProof();
        setSeqCalc(newSeqCalc);
        setSeqData(newSeqData);
        return true;
    };

    /**
     * Returns a string representation of the current proof.
     */
    const saveProofFile = (): string => {
        const data = {
            program: "spin",
            filetype: "sequent-propositional",
            version: 1,
            proof: {
                sequents: new Array<any>()
            }
        };
        seqData.forEach(seq => {
            data.proof.sequents.push({
                id: seq.id,
                expr: seq.expr === null ? "" : seq.expr.toSaveString(),
                expr_text: seq.expr_text,
                rule: seq.rule as string,
                refs: setToList(seq.refs),
                comment: seq.comment
            });
        });
        return JSON.stringify(data);
    };

    /**
     * Rename a sequent.
     * @param oldId existing sequent ID
     * @param newId new sequent ID
     * @returns true if the rename was successful
     */
    const renameSequent = (oldId: string, newId: string): boolean => {
        if (editing !== null || seqCalc.has(newId) || !seqCalc.has(oldId))
            return false;
        const [_oldData,oldCalc] = getSequent(oldId,seqData,seqCalc);
        const newSeqData = [...seqData];
        const newSeqCalc = new Map<string,SequentCalc>();
        seqCalc.forEach((v,k) => newSeqCalc.set(k,v));
        newSeqCalc.set(newId,oldCalc);
        newSeqCalc.delete(oldId);
        newSeqCalc.forEach(v => {
            if (v.assumptions.has(oldId)) {
                v.assumptions.delete(oldId);
                v.assumptions.add(newId);
            }
        });
        newSeqData.forEach(v => {
            if (v.id === oldId)
                v.id = newId;
            if (v.ref_by.has(oldId)) {
                v.ref_by.delete(oldId);
                v.ref_by.add(newId);
            }
            if (v.refs.has(oldId)) {
                v.refs.delete(oldId);
                v.refs.add(newId);
            }
        });
        setSeqData(newSeqData);
        setSeqCalc(newSeqCalc);
        return true;
    }

    /**
     * Sets the sequent to editing, only when no sequent is currently editing.
     * @param id sequent ID
     * @returns true if set to editing
     */
    const editSequent = (id: string): boolean => {
        if (editing !== null)
            return false;
        const [data,calc] = getSequent(id,seqData,seqCalc);
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
        const [_data,calc] = getSequent(id,seqData,seqCalc);
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
                v.ref_by.add(id);
            else
                v.ref_by.delete(id);
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
        const [_data,calc] = getSequent(id,seqData,seqCalc);
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
        else {
            updateCalc(s.id,{
                assumptions: new Set<string>(),
                canCheck: false,
                checked: false,
                index: seqData.length,
                valid: false,
                uuid: uuid()
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
            <Menu addSequent={addSequent} clearProof={clearProof}
                loadProofFile={loadProofFile} saveProofFile={saveProofFile}
                editing={editing} />
            <ProofList seqData={seqData} seqCalc={seqCalc}
                updateData={updateData} updateCalc={updateCalc}
                removeSequent={removeSequent} moveSequent={moveSequent}
                editing={editing} editSequent={editSequent}
                finishSequent={finishSequent} renameSequent={renameSequent} />
            <Footer />
            {ENABLE_PARSER_TEST && <ParserTestButton />}
        </>
    );
}

export default App;
