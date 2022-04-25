import React, { ReactElement, FC, useRef } from "react";
import {SequentData} from "../logic/Sequent";
import "./Menu.css";

interface Props {
    addSequent: (s: SequentData) => boolean;
    clearProof: () => void;
    editing: string | null;
    loadProofFile: (data: string) => boolean;
    saveProofFile: () => string;
}

const Menu: FC<Props> = ({addSequent, clearProof, editing,
        loadProofFile, saveProofFile}: Props): ReactElement => {
    const inputFile = useRef<HTMLInputElement>(null);
    const openFile = () => {
        if (inputFile.current)
            inputFile.current.click();
    };

    return (
        <div className={"menu"}>
            <button onClick={() => openFile()}>
                Open
            </button>
            { /* hidden input element to open a file */ }
            <input type="file" style={{display:"none"}} accept={".spin,.json"}
                ref={inputFile} multiple={false} onChange={async e => {
                    const files = e.target.files;
                    if (files !== null && files.length > 0) {
                        const data = await new Promise<string>(
                                (resolve,reject) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                                if (!reader.result)
                                    throw "open: failure";
                                resolve(reader.result.toString());
                            };
                            reader.onabort = () => reject("open: failure");
                            reader.readAsText(files[0]);
                        })
                        try {
                            if (!loadProofFile(data))
                                alert("Proof file was not loaded.");
                        } catch (err) {
                            alert("Error loading proof file: "+err);
                        }
                    }
                }} />
            <button onClick={() => { // save
                let fname = prompt("Enter a file name:");
                if (fname === null)
                    return;
                if (!fname.endsWith(".spin"))
                    fname += ".spin";
                const data = saveProofFile();
                const file = new Blob([data],{type:"text/json"});
                const a = document.createElement("a");
                const url = URL.createObjectURL(file);
                a.href = url;
                a.download = fname;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                });
            }}>
                Save
            </button>
            <button onClick={() => {
                if (confirm("Reset the current proof?"))
                    clearProof();
            }}>
                New Proof
            </button>
            {/*
            <button onClick={() => alert('not implemented')}>
                Undo
            </button>
            <button onClick={() => alert('not implemented')}>
                Redo
            </button>
            */}
            <button onClick={() => {
                const id = prompt("Enter ID:");
                if (id === null)
                    return;
                else if (id.length === 0)
                    alert("ID cannot be empty.");
                else if (!id.match(/^[0-9A-Za-z_-]+$/))
                    alert("ID can only contain letters, numbers, '_' and '-'.");
                else
                    addSequent({
                        comment: "",
                        expr: null,
                        expr_text: "",
                        id: id,
                        ref_by: new Set<string>(),
                        refs: new Set<string>(),
                        rule: ""
                    });
            }}>
                New Sequent
            </button>
        </div>
    );
};

export default Menu;
