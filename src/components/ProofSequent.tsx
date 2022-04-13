import React, { ReactElement, FC, useState } from "react";
import Sequent from "../logic/Sequent";
import RuleSelector from "./RuleSelector";
import "./ProofSequent.css";

interface Props {
    seq: Sequent,
    delSeq: (id: string) => boolean,
    moveSeq: (id: string, offset: number) => boolean
}

const ProofSequent: FC<Props> = ({seq, delSeq,
                                    moveSeq}: Props): ReactElement => {
    const [val, setVal] = useState(seq);
    const [editing, setEditing] = useState(false);
    return (
        <tr className={"proofsequent"}>
            <td>
                <button onClick={() => moveSeq(seq.id,-1)}>
                    &and;
                </button>
                <button onClick={() => moveSeq(seq.id,1)}>
                    &or;
                </button>
            </td>
            <td>
                {val.id}
            </td>
            <td className={"seqref"}>
                {"{"}{val.refs}{"}"} &#8866;
            </td>
            <td>
                {editing ? <input type="text" readOnly={false}
                    onChange={ (e) => {
                        console.log(e);
                    }} />
                : val.expr && val.expr.toString()}
            </td>
            <td>
                <RuleSelector />
            </td>
            <td>
                {val.valid}
            </td>
            <td>
                <input type="text" value={'comment'} readOnly />
            </td>
            <td>
                <button onClick={() => setEditing(!editing)}>
                    {editing ? "Done" : "Edit"}
                </button>
                <button onClick={() => alert('not implemented')}>
                    Check
                </button>
                <button onClick={() => {
                    if (confirm("Confirm delete sequent?") && !delSeq(seq.id))
                        alert("Error deleting sequent.");
                }}>
                    Delete
                </button>
            </td>
        </tr>
    );
};

export default ProofSequent;
