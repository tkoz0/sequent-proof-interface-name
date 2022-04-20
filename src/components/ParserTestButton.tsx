import React, { ReactElement, FC } from "react";
import Parser from "../logic/Parser";

const Menu: FC = (): ReactElement => {
    return (
        <button onClick={() => {
            let s = prompt("enter a string");
            if (s === null)
                alert("you did not enter a string");
            else {
                let e = null;
                try {
                    e = Parser.parse(s);
                } catch (error) {
                    alert("parsing error: "+error);
                }
                if (e !== null)
                    alert(e.toString() + '\n' + e.toSaveString());
            }
        }}>
            Test Parser
        </button>
    );
};

export default Menu;
