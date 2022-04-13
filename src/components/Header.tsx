import React, { ReactElement, FC } from "react";
import {APP_TITLE_IS_TEMPORARY, APP_TITLE_LONG, APP_TITLE_SHORT} from "../utils/Constants";
import "./Header.css";

const Header: FC = (): ReactElement => {
    return (
        <div className={"header"}>
            {APP_TITLE_LONG} ({APP_TITLE_SHORT})
            {APP_TITLE_IS_TEMPORARY && " (Temporary Name)"}
        </div>
    );
};

export default Header;
