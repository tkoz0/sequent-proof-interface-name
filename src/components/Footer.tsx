import React, { ReactElement, FC } from "react";
import "./Footer.css";

interface Props {
}

const Footer: FC<Props> = (): ReactElement => {
    return (
        <div className={"footer"}>
            Footer Text
        </div>
    );
};

export default Footer;
