import React, {useState} from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import Menu from './components/Menu';
import ProofList from './components/ProofList';
import "./App.css";
import Sequent from './logic/Sequent';
import Parser from './logic/Parser';
import {ENABLE_PARSER_TEST} from './utils/Constants';

function App() {
    // use a list of sequents
    // have a separate function for checking correctness
    // make addSequent and removeSequent utility functions defined here
    // can pass these functions down as needed
    // const [proof, setProof] = useState<Sequent[]>([]);
    // const addSequent = (seq: Sequent) => { setProof([...proof,seq]); }
    // for removeSequent, use list slicing
    const [proof, setProof] = useState<Sequent[]>([]);
    const [seqMap, setSeqMap] = useState(new Map<string,number>());
    const [editing, setEditing] = useState(false);

    const clearProof = (): void => {
        setProof([]);
        setSeqMap(new Map<string,number>());
        setEditing(false);
    };

    /**
     * Adds a sequent to the end of the proof list.
     * @param s sequent object
     * @returns true if added successfully
     */
    const addSequent = (s: Sequent): boolean => {
        if (seqMap.has(s.id))
            return false;
        seqMap.set(s.id,proof.length);
        setProof([...proof,s]);
        return true;
    };

    /**
     * Removes a sequent from the proof list.
     * @param id id of the sequent to remove
     * @returns true if removed successfully
     */
    const removeSequent = (id: string): boolean => {
        const index = seqMap.get(id);
        if (index === undefined)
            return false;
        const newProof = [...proof.slice(0,index),
                        ...proof.slice(index+1,proof.length)]
        seqMap.delete(id);
        newProof.forEach((s,i) => seqMap.set(s.id,i));
        setProof(newProof);
        return true;
    };

    /**
     * Swaps order of 2 sequents. This is meant to move a sequent up/down.
     * @param id id of the sequent
     * @param offset offset of sequent to swap with
     * @returns true if order has changed
     */
    const moveSequent = (id: string, offset: number): boolean => {
        const index1 = seqMap.get(id);
        if (index1 === undefined)
            return false;
        const index2 = index1 + offset;
        if (index2 < 0 || index2 >= proof.length)
            return false;
        const newProof = [...proof];
        const temp = newProof[index1];
        newProof[index1] = newProof[index2];
        newProof[index2] = temp;
        seqMap.set(newProof[index1].id,index1);
        seqMap.set(newProof[index2].id,index2);
        setProof(newProof);
        return true;
    }

    return (
        <>
            <Header />
            <Menu addSeq={addSequent} clearProof={clearProof} />
            <ProofList seqList={proof} delSeq={removeSequent}
                moveSeq={moveSequent} editing={editing}
                setEditing={setEditing} />
            <Footer />
            { ENABLE_PARSER_TEST &&
                <button className={"parsertest"} onClick={() => {
                    let s = prompt("enter a string");
                    if (s === null)
                        alert("you did not enter a string");
                    else {
                        let e = Parser.parse(s);
                        if (e === null)
                            alert("parse failed");
                        else
                            alert(e.toString() + '\n' + e.toSaveString());
                    }
                }}>
                    Test Parser
                </button>
            }
        </>
    );
}

export default App;
