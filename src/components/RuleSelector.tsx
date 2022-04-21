import React, { ReactElement, FC, useState } from "react";
import {InferenceRule} from "../utils/LogicUtils";

interface Props {
    enabled: boolean;
    value: InferenceRule;
    setValue: (rule: InferenceRule) => void;
}

const RuleSelector: FC<Props> = ({enabled, value,
        setValue}: Props): ReactElement => {
    return (
        <select disabled={!enabled} value={value}
            onChange={e => setValue(e.target.value as InferenceRule)}>
            <option value=""></option>
            <option value="assume">Assume</option>
            <option value="thin">Thin</option>
            <option value="andE">&and; Elim</option>
            <option value="andI">&and; Intro</option>
            <option value="orE">&or; Elim</option>
            <option value="orI">&or; Intro</option>
            <option value="notE">&not; Elim</option>
            <option value="notI">&not; Intro</option>
            <option value="contE">&perp; Elim</option>
            <option value="contI">&perp; Intro</option>
            <option value="ifE">&rarr; Elim</option>
            <option value="ifI">&rarr; Intro</option>
            <option value="iffE">&harr; Elim</option>
            <option value="iffI">&harr; Intro</option>
        </select>
    );
};

export default RuleSelector;
