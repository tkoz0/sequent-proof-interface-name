import React, { ReactElement, FC } from "react";
import Proof from "../logic/Proof";
import Sequent from "../logic/Sequent";
import "./Menu.css";

interface Props {
    addSeq: (s: Sequent) => boolean,
    clearProof: () => void
}

const Menu: FC<Props> = ({addSeq, clearProof}: Props): ReactElement => {
    return (
        <div className={"menu"}>
            <button onClick={() => alert('not implemented')}>
                Open
            </button>
            <button onClick={() => alert('not implemented')}>
                Save
            </button>
            <button onClick={() => {
                if (confirm("Reset the current proof?"))
                    clearProof();
            }}>
                New Proof
            </button>
            <button onClick={() => alert('not implemented')}>
                Undo
            </button>
            <button onClick={() => alert('not implemented')}>
                Redo
            </button>
            <button onClick={() => {
                const id = prompt("Enter ID:");
                if (id === null || id.length == 0)
                    alert("ID cannot be empty.");
                else if (!addSeq(new Sequent(id)))
                    alert("Sequent with this ID already exists.");
            }}>
                New Sequent
            </button>
            <button onClick={() => alert('not implemented')}>
                Check All
            </button>
        </div>
    );
};

export default Menu;
