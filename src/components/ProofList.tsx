import React, { ReactElement, FC, useState } from "react";
import Sequent from "../logic/Sequent";
import "./ProofList.css";
import ProofSequent from "./ProofSequent";

interface Props {
    seqList: Sequent[],
    delSeq: (id: string) => boolean,
    moveSeq: (id: string, offset: number) => boolean
    editing: boolean,
    setEditing: React.Dispatch<React.SetStateAction<boolean>>
}

const ProofList: FC<Props> = ({seqList, delSeq,
        moveSeq, editing, setEditing}: Props): ReactElement => {
    return (
        <table className={"prooflist"}>
            <tbody>
                <tr>
                    <th>Move</th>
                    <th>ID</th>
                    <th>References</th>
                    <th>Expression</th>
                    <th>Select</th>
                    <th>Rule</th>
                    <th>Validity</th>
                    <th>Comment</th>
                    <th>Actions</th>
                </tr>
                {
                    seqList.length > 0 ?
                    seqList.map(s =>
                        <ProofSequent key={s.id} seq={s} delSeq={delSeq}
                            moveSeq={moveSeq}
                            proofEditing={editing}
                            proofSetEditing={setEditing} />)
                    : <tr><td colSpan={8} className={"nosequents"}>
                        No sequents added yet.</td></tr>
                }
            </tbody>
        </table>
    );
};

export default ProofList;
