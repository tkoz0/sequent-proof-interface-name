import React, { ReactElement, FC } from "react";
import "./Menu.css";

interface Props {
}

const Menu: FC<Props> = (): ReactElement => {
    return (
        <div className={"menu"}>
            <button onClick={() => alert('open')}>
                Open
            </button>
            <button onClick={() => alert('save')}>
                Save
            </button>
            <button onClick={() => alert('undo')}>
                Undo
            </button>
            <button onClick={() => alert('redo')}>
                Redo
            </button>
            <button onClick={() => alert('new sequent')}>
                New Sequent
            </button>
            <button onClick={() => alert('check all')}>
                Check All
            </button>
        </div>
    );
};

export default Menu;
