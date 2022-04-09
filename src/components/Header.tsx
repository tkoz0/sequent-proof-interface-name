import React, { ReactElement, FC } from "react";
import {APP_TITLE_LONG, APP_TITLE_SHORT} from "../utils/constants";
import "./Header.css";

interface Props {
}

const Header: FC<Props> = (): ReactElement => {
    return (
        <div className={"header"}>
            {APP_TITLE_LONG} ({APP_TITLE_SHORT})
        </div>
    );
};

export default Header;
