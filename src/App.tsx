import React, {useState} from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import Menu from './components/Menu';
import ProofList from './components/ProofList';
import ExprAtom from './logic/ExprAtom';
import Sequent from './logic/Sequent';
import "./App.css";
import Proof from './logic/Proof';

function App() {
    //const [proof, setProof] = useState(new Proof());
    return (
        <>
            <Header />
            <Menu />
            <ProofList seqs={[new Sequent("1",new ExprAtom("A"))]} />
            <Footer />
        </>
    );
}

export default App;
