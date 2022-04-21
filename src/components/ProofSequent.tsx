import React, { ReactElement, FC, useState } from "react";
import {SequentCalc, SequentData} from "../logic/Sequent";
import RuleSelector from "./RuleSelector";
import "./ProofSequent.css";
import Parser from "../logic/Parser";
import ExprBase from "../logic/ExprBase";

interface Props {
    seqData: SequentData;
    seqCalc: SequentCalc;
    updateData: (sd: SequentData) => void;
    updateCalc: (sc: SequentCalc) => void;
    removeSequent: (id: string) => boolean;
    moveSequent: (id: string, offset: number) => boolean;
    editing: string | null;
    editSequent: (id: string) => boolean;
    finishSequent: (id: string, seq: SequentData) => boolean;
}

const ProofSequent: FC<Props> = ({seqData, seqCalc, updateData, updateCalc,
        removeSequent, moveSequent, editing,
        editSequent, finishSequent}: Props): ReactElement => {
    // values entered into the text boxes
    const [textExpr, setTextExpr] = useState("");
    const [textComment, setTextComment] = useState("");

    return (
        <tr className={"proofsequent"
                    + (editing === seqData.id ? " proofediting"
                    : (seqCalc.checked ? " seqselected" : ""))}>
            <td className="seqmove">
                <button disabled={editing !== null}
                        onClick={() => moveSequent(seqData.id,-1)}>
                    &and;
                </button>
                <button disabled={editing !== null}
                        onClick={() => moveSequent(seqData.id,1)}>
                    &or;
                </button>
            </td>
            <td className="seqid">{seqData.id}</td>
            <td className="seqref">
                {"{"}{editing === seqData.id ? "?"
                : "TODO"}{"}"} &#8872;
            </td>
            <td className="seqexpr">
{//TODO make background red for invalid and yellow for none
}
                {editing === seqData.id ?
                    <textarea defaultValue={textExpr} onChange={e => {
                        setTextExpr(e.target.value);
                    }} />
                : seqData.expr !== null ? seqData.expr.toString() :
                    textExpr === "" ? "<none>" : "<invalid>" }
            </td>
            <td className="seqsel">
                <input type={"checkbox"} disabled={!seqCalc.canCheck}
                    checked={seqCalc.checked}
                    onChange={() => {
                        updateCalc({
                            ...seqCalc,
                            checked: !seqCalc.checked
                        });
                    }} />
            </td>
            <td className="seqrule">
                <RuleSelector enabled={editing === seqData.id}
                    value={editing === seqData.id ? seqData.rule : seqData.rule}
                    setValue={(rule) => {
                        updateData({
                            ...seqData,
                            rule: rule
                        });
                    }}/>
            </td>
            <td className="seqvalid">
{//TODO use green/red background or get x and check icons for this
}
                TODO {editing === seqData.id ? seqCalc.valid : seqCalc.valid}
            </td>
            <td className="seqcomment">
                {editing === seqData.id ?
                    <textarea defaultValue={textComment} onChange={e => {
                        setTextComment(e.target.value);
                    }} />
                : seqData.comment }
            </td>
            <td className="seqactions">
                <button onClick={() => { // done/edit
                    if (editing === seqData.id) {
                        let parsed: null | ExprBase = null;
                        try {
                            parsed = Parser.parse(textExpr);
                        } catch (error) {
                            if (textExpr !== "")
                                alert("Invalid expression: "+error);
                        }
                        finishSequent(seqData.id,{
                            ...seqData,
                            comment: textComment,
                            expr: parsed
                            // finishSequent handles refs, ref_by
                            // rule is already set by dropdown onChange
                        });
                    }
                    else if (!editSequent(seqData.id))
                        alert("Please finish editing current sequent.");
                }}  className={editing === seqData.id ? "donebutton"
                                                    : "editbutton"}
                    disabled={editing !== null && editing !== seqData.id}>
                    {editing === seqData.id ? "Done" : "Edit"}
                </button>
                <button disabled={editing !== null}
                    onClick={() => { // delete
                    if (!confirm("Delete this sequent?"))
                        return;
                    if (!removeSequent(seqData.id))
                        alert("Error deleting sequent.");
                }} className="deletebutton">
                    Delete
                </button>
            </td>
        </tr>
    );
};

export default ProofSequent;
