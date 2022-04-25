# Sequent Proof Interface Name (SPIN)

Sequent Proof Interface Name (SPIN) is a React+TypeScript web app for creating
proofs with propositional logic using the Fitch Sequent System (FSS).

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
checked automatically.

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

## Fitch Sequent System (FSS)

There are 14 rules in the Fitch Sequent System (FSS). SPIN implements 13 of
them. The only one excluded is thinning, which can be done with other inference
rules in FSS. Thinning was left out because SPIN computes the assumption sets
automatically much like Slate does.
