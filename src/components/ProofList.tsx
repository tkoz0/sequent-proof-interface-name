import React, { ReactElement, FC, useState } from "react";
import Sequent from "../logic/Sequent";
import "./ProofList.css";
import ProofSequent from "./ProofSequent";

interface Props {
    seqList: Sequent[],
    delSeq: (id: string) => boolean,
    moveSeq: (id: string, offset: number) => boolean
}

const ProofList: FC<Props> = ({seqList, delSeq,
                                moveSeq}: Props): ReactElement => {
    return (
        <table className={"prooflist"}>
            <tbody>
                <tr>
                    <th>Move</th>
                    <th>ID</th>
                    <th>Refs</th>
                    <th>Expression</th>
                    <th>Rule</th>
                    <th>Validity</th>
                    <th>Comment</th>
                    <th>Actions</th>
                </tr>
                {
                    seqList.length > 0 ?
                    seqList.map(s =>
                        <ProofSequent key={s.id} seq={s} delSeq={delSeq}
                            moveSeq={moveSeq} />)
                    : <tr><td colSpan={8} className={"nosequents"}>
                        No sequents added yet.</td></tr>
                }
            </tbody>
        </table>
    );
};

export default ProofList;
