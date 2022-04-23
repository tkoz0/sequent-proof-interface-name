import React, { ReactElement, FC } from "react";
import {FOOTER_MESSAGE} from "../utils/Constants";
import "./Footer.css";

interface Props {
}

const Footer: FC<Props> = (): ReactElement => {
    return (
        <div className={"footer"}>
            {FOOTER_MESSAGE}
        </div>
    );
};

export default Footer;
