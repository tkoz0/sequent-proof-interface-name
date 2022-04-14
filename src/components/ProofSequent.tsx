import React, { ReactElement, FC, useState } from "react";
import Sequent from "../logic/Sequent";
import RuleSelector from "./RuleSelector";
import "./ProofSequent.css";

interface Props {
    seq: Sequent,
    delSeq: (id: string) => boolean,
    moveSeq: (id: string, offset: number) => boolean,
    proofEditing: boolean,
    proofSetEditing: React.Dispatch<React.SetStateAction<boolean>>
}

const ProofSequent: FC<Props> = ({seq, delSeq,
        moveSeq, proofEditing, proofSetEditing}: Props): ReactElement => {
    const [val, setVal] = useState(seq);
    const [editing, setEditing] = useState(false);
    return (
        <tr className={"proofsequent"}>
            <td className="seqmove">
                <button onClick={() => moveSeq(seq.id,-1)}>
                    &and;
                </button>
                <button onClick={() => moveSeq(seq.id,1)}>
                    &or;
                </button>
            </td>
            <td className="seqid">
                {val.id}
            </td>
            <td className="seqref">
                {"{"}{val.refs}{"}"} &#8872;
            </td>
            <td className="seqexpr">
                {editing ? <textarea readOnly={false}
                    onChange={(e) => {
                    }} />
                : val.expr && val.expr.toString()}
            </td>
            <td className="seqsel">
                <input type={"checkbox"} disabled={!proofEditing} />
            </td>
            <td className="seqrule">
                {editing ? <RuleSelector editing={editing} />
                : val.rule }
            </td>
            <td className="seqvalid">
                {val.valid}
            </td>
            <td className="seqcomment">
                {editing ? <textarea readOnly={false}
                    onChange={(e) => {
                    }} />
                : val.comment }
            </td>
            <td className="seqactions">
                <button onClick={() => {
                    if (editing) {
                        proofSetEditing(false);
                        setEditing(false);
                        // TODO save edits and replace sequent
                    } else {
                        if (proofEditing)
                            alert("Only can edit one sequent at a time.");
                        else {
                            proofSetEditing(true);
                            setEditing(true);
                            // TODO set current values
                        }
                    }
                }} className={editing ? "donebutton" : "editbutton"}>
                    {editing ? "Done" : "Edit"}
                </button>
                <button className="checkbutton" onClick={() => alert('not implemented')}>
                    Check
                </button>
                <button onClick={() => {
                    if (!confirm("Confirm delete sequent?"))
                        return;
                    if (!delSeq(seq.id))
                        alert("Error deleting sequent.");
                    else if (editing) {
                        proofSetEditing(false);
                        setEditing(false);
                    }
                }} className="deletebutton">
                    Delete
                </button>
            </td>
        </tr>
    );
};

export default ProofSequent;
