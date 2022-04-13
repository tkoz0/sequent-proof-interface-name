import React, { ReactElement, FC, useState } from "react";

interface Props {
}

const RuleSelector: FC<Props> = (): ReactElement => {
    return (
        <select>
            <option value="">Rule</option>
            <option value="assume">Assume</option>
            <option value="notE">&not; Elim</option>
            <option value="notI">&not; Intro</option>
            <option value="andE">&and; Elim</option>
            <option value="andI">&and; Intro</option>
            <option value="orE">&or; Elim</option>
            <option value="orI">&or; Intro</option>
            <option value="ifE">&rarr; Elim</option>
            <option value="ifI">&rarr; Intro</option>
            <option value="iffE">&harr; Elim</option>
            <option value="iffI">&harr; Intro</option>
            <option value="contE">&perp; Elim</option>
            <option value="contI">&perp; Intro</option>
        </select>
    );
};

export default RuleSelector;
