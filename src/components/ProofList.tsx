import React, { ReactElement, FC, useState } from "react";
import Sequent from "../logic/Sequent";
import "./ProofList.css";
import ProofSequent from "./ProofSequent";

interface Props {
    seqs: Sequent[]
}

const ProofList: FC<Props> = ({seqs}: Props): ReactElement => {
    return (
        <div className={"prooflist"}>
            {seqs.map((s) => <ProofSequent seq={s} />)}
        </div>
    );
};

export default ProofList;
