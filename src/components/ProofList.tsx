import React, { ReactElement, FC, useState } from "react";
import {SequentCalc, SequentData} from "../logic/Sequent";
import "./ProofList.css";
import ProofSequent from "./ProofSequent";

interface Props {
    seqData: SequentData[];
    seqCalc: Map<string,SequentCalc>;
    updateData: (id: string, sd: SequentData) => void;
    updateCalc: (id: string, sc: SequentCalc) => void;
    removeSequent: (id: string) => boolean;
    moveSequent: (id: string, offset: number) => boolean;
    editing: string | null;
    editSequent: (id: string) => boolean;
    finishSequent: (id: string, seq: SequentData) => boolean;
    renameSequent: (oldId: string, newId: string) => boolean;
}

const ProofList: FC<Props> = ({seqData, seqCalc, updateData, updateCalc,
        removeSequent, moveSequent, editing,
        editSequent, finishSequent, renameSequent}: Props): ReactElement => {
    return (
        <table className={"prooflist"}>
            <tbody>
                <tr>
                    <th>Move</th>
                    <th>ID</th>
                    <th>Assumptions</th>
                    <th>Expression</th>
                    <th>Select</th>
                    <th>Rule</th>
                    <th>Validity</th>
                    <th>Comment</th>
                    <th>Actions</th>
                </tr>
                {
                    seqData.length > 0 ?
                    seqData.map(s =>
                        <ProofSequent key={s.id} seqData={s}
                            seqCalc={seqCalc.get(s.id)!}
                            updateData={(sd) => updateData(s.id,sd)}
                            updateCalc={(sc) => updateCalc(s.id,sc)}
                            removeSequent={removeSequent}
                            moveSequent={moveSequent} editing={editing}
                            editSequent={editSequent}
                            finishSequent={finishSequent}
                            renameSequent={renameSequent} />)
                    : <tr><td colSpan={9} className={"nosequents"}>
                        No sequents added yet.</td></tr>
                }
            </tbody>
        </table>
    );
};

export default ProofList;
