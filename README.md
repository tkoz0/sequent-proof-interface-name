# Sequent Proof Interface Name (SPIN)

Sequent Proof Interface Name (SPIN) is a React+TypeScript web app for creating
proofs with propositional logic using the Fitch Sequent System (FSS).

The file `CODE_NOTES.md` contains documentation about the program structure and
design choices in the code that should be helpful for programmers interested in
contributing to SPIN or using parts of its code elsewhere.

## Features

- Create and order a list of propositional logic sequents
- Automatically check sequent justifications and compute assumption sets
- Open and save proof files

## Instructions

### Menu

Use the open/save buttons to open/save a file. When saving, you will be prompted
for a file name. Click the new proof button to reset to a blank proof. You will
be asked to confirm this. Click new sequent to add a sequent to the proof. You
will be prompted for a sequent ID.

### Editing Sequents

The up/down buttons on the left are used to reorder sequents. On the right, the
sequent ID can be changed with the rename button, or the sequent deleted with
the delete button. Click edit to switch a sequent to edit mode. You will be able
to enter a logic expression and comment in the appropriate text boxes. Use the
checkboxes in the select column to reference other sequents for deriving a new
sequent. The justification rule can be selected with the dropdown in the rule
column. When clicking done, the sequent (and those that depend on it) are
checked automatically. While editing, the sequent is highlighted in yellow.
Referenced sequents (selected by the checkboxes) are highlighted in orange.

## Logic Expressions

SPIN is largely inspired by Slate, a software used in Selmer Bringsjord's logic
classes at Rensselaer Polytechnic Institute. For easy of parsing, it uses lisp
S expressions in the same style Slate uses. A statement can be an atom (variable
name) consisting of '_', letters, and numbers, not starting with a number. Some
valid examples are "P", "_Q", "c1", "x_1". Logic statements can be formed with
connectives in the following formats:

| Statement | S expression |
|-----------|--------------|
| &not;P    | (not P)      |
| P&and;Q   | (and P Q)    |
| P&or;Q    | (or P Q)     |
| P&rarr;Q  | (if P Q)     |
| P&harr;Q  | (iff P Q)    |
| &perp;    | (cont)       |

In these examples, P and Q are allowed to be any logic statement in S expression
form. The AND and OR connectives generalize to more than 2 statements. The
contradiction symbol is handled as a connective in order to differentiate it
from atoms.

Here are some examples:

| Statement                 | S expression            |
|---------------------------|-------------------------|
| &not;(A&rarr;(B&or;C))    | (not (if A (or B C)))   |
| (X&and;Y)&harr;&not;Z     | (iff (and X Y) (not Z)) |
| (P&rarr;Q)&and;(Q&rarr;R) | (and (if P Q) (if Q R)) |
| (M&harr;N)&or;L           | (or (iff M N) L)        |

## Fitch Sequent System (FSS)

There are 14 rules in the Fitch Sequent System (FSS). SPIN implements 13 of
them. The only one excluded is thinning, which can be done with other inference
rules in FSS. Thinning was left out because SPIN computes the assumption sets
automatically much like Slate does.

### Assumption

$$ \vdash \{P\} \vDash P $$

From nothing, we can infer that any statement is a consequence of itself.

### Thinning (not implemented in SPIN)

$$ \{\Gamma_1\vDash P\} \vdash (\Gamma_1\cup\Gamma_2)\vDash P $$

If we can infer $P$ from $\Gamma_1$, then we can infer $P$ from any set of
statements containing all of $\Gamma_1$.

### $\land$ Intro

$$ \{\Gamma_1\vDash P_1, \Gamma_2\vDash P_2, \ldots, \Gamma_n\vDash P_n\}
\vdash (\Gamma_1\cup\Gamma_2\cup\ldots\cup\Gamma_n)
\vDash P_1\land P_2\land\ldots\land P_n $$

If we can infer $P_1,\ldots,P_n$, then we can infer $P_1\land\ldots\land P_n$
from the union of all their assumption sets.

### $\land$ Elim

$$ \{\Gamma\vDash P_1\land P_2\land\ldots\land P_n\} \vdash \Gamma\vDash P_i $$

If we can infer $P_1\land\ldots\land P_n$, then we can infer $P_i$
($1\leq i\leq n$) from the same assumptions.

### $\lor$ Elim

$$ \{\Gamma_0\vDash P_1\lor P_2\lor\ldots\lor P_n,
(\Gamma_1\cup\{P_1\})\vDash Q, (\Gamma_2\cup\{P_2\})\vDash Q, \ldots,
(\Gamma_n\cup\{P_n\})\vDash Q \}$$
$$ \vdash (\Gamma_0\cup\Gamma_1\cup\ldots\cup\Gamma_n)\vDash Q $$

If we can infer $P_1\lor\ldots\lor P_n$ and have "subproof" sequents for each
$P_i$ that conclude $Q$ by assuming $P_i$, then we can infer $Q$ from the
combined assumptions after removing $P_i$ from each subproof.

### $\lor$ Intro

$$ \{\Gamma\vDash P_i\} \vdash \Gamma\vDash P_1\lor P_2\lor\ldots\lor P_n$$

If we can infer a statement from $\Gamma$, then we can infer an OR statement
containing it from $\Gamma$.

### $\neg$ Elim

$$ \{\Gamma\vDash\neg\neg P\} \vdash \Gamma\vDash P $$

If we can infer a statement from $\Gamma$, then we can infer the double
negation taken from removing 2 negations on the left.

### $\neg$ Intro

$$ \{(\Gamma\cup\{P\})\vDash\bot\} \vdash \Gamma\vDash\neg P $$

If we can infer a contradiction from some statements, then we can infer the
negation of one of those statements after removing it from the assumption set.

### $\bot$ Elim

$$ \{\Gamma\vDash\bot\} \vdash \Gamma\vDash P $$

If we can infer a contradiction from $\Gamma$, then we can infer any statement
we want from $\Gamma$.

### $\bot$ Intro

$$ \{\Gamma_1\vDash P,\Gamma_2\vDash\neg P\}
\vdash (\Gamma_1\cup\Gamma_2) \vDash\bot $$

If we can infer a statement and its negation, then we can infer a contradiction
from the assumptions combined.

### $\rightarrow$ Elim

$$ \{\Gamma_1\vDash P,\Gamma_2\vDash P\rightarrow Q\}
\vdash (\Gamma_1\cup\Gamma_2)\vDash Q $$

If we can infer $P$ and $P\rightarrow Q$, then combining their assumptions we
can infer $Q$.

### $\rightarrow$ Intro

$$ \{(\Gamma\cup\{P\})\vDash Q\} \vdash \Gamma\vDash P\rightarrow Q $$

If we can infer $Q$, then we can infer $P\rightarrow Q$ by removing $P$ from the
assumptions.

### $\leftrightarrow$ Elim

$$ \{\Gamma_1\vDash P,\Gamma_2\vDash P\leftrightarrow Q\}
\vdash (\Gamma_1\cup\Gamma_2)\vDash Q $$
$$ \{\Gamma_1\vDash Q,\Gamma_2\vDash P\leftrightarrow Q\}
\vdash (\Gamma_1\cup\Gamma_2)\vDash P $$

If we can infer $P$ (or $Q$) and $P\leftrightarrow Q$, then we can infer $Q$
(or $P$) by combining their assumptions. (Biconditional elimination works in
both orders).

### $\leftrightarrow$ Intro

$$ \{(\Gamma_1\cup\{P\})\vDash Q,(\Gamma_2\cup\{Q\})\vDash P\}
\vdash (\Gamma_1\cup\Gamma_2)\vDash P\leftrightarrow Q $$

If we have sequents from which we can infer $P\rightarrow Q$ and
$Q\rightarrow P$, then we can infer $P\leftrightarrow Q$.
