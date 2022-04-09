import React, { ReactElement, FC, useState } from "react";
import Sequent from "../logic/Sequent";

interface Props {
    seq: Sequent
}

const ProofSequent: FC<Props> = ({seq}: Props): ReactElement => {
    const [val, setVal] = useState(0);
    return (
        <div className={"proofsequent"}>
            <button>
                up
            </button>
            <button>
                down
            </button>
            <span>
                {seq.refs.join(',')}
            </span>
            <input type="text" value={seq.expr.toString().toString()} />
            <span>
                valid?
            </span>
            <button>
                delete
            </button>
        </div>
    );
};

export default ProofSequent;
