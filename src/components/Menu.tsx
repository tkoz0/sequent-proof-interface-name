import React, { ReactElement, FC } from "react";
import "./Menu.css";

interface Props {
}

const Menu: FC<Props> = (): ReactElement => {
    return (
        <div className={"menu"}>
            <button>
                Open
            </button>
            <button>
                Save
            </button>
            <button>
                Undo
            </button>
            <button>
                Redo
            </button>
            <button>
                New Sequent
            </button>
        </div>
    );
};

export default Menu;
