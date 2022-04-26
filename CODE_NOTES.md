# SPIN Code Notes

## Basics

Files and directories:
- `App.tsx` - the main file for the app
- `src/components` - react components in the app
- `src/logic` - data structures and algorithms for the logic stuff
- `src/utils` - other things that did not quite fit in components or logic

The HTML structure comes from seeing how the components are combined, beginning
from `App.tsx`. In this file, the data structures for representing the UI are
defined and several functions for operating on them. The functions and variables
are passed into child components that need them. The `editing` variable
specifies which sequent is in edit mode, or `null` if none is in edit mode.

Most of the functions in the code have comments specifying what they do, the
inputs, return values, and errors if it may throw an error.

## Proof Structures

The sequent data is split into `seqData` and `seqCalc`. This design was
initially intended to separate the data that would be saved to a file
(`seqData`) and the data calculated at runtime (`seqCalc`), but the usage did
not quite adhere to that completely. The `seqData` is a list of `SequentData`
objects, defined in `Sequent.ts`. The `seqCalc` is a map of string (sequent IDs)
to `SequentCalc` objects, also defined in `Sequent.ts`.

Each sequent can have its own values for some variables. The part that connects
them together is the references (`refs` and `ref_by`). Both of these are sets of
strings. Sequent IDs must be unique and the following 2 properties must be
maintained in the data structures:
- Sequent A has sequent B in its `refs` if and only if sequent B has A in its
  `ref_by`
- If sequent A has sequent B in its `refs`, then sequent B must have a smaller
  list index than sequent A

In graph theory terms, the edges formed by `refs` must be maintained as a
directed acyclic graph with a topological sorting order from largest index to
smallest index. For each reference to a previous sequent, there is a matching
reference to a later sequent.

## Logic - Data Structures

The `ExprBase` class defines components relevant to logic expressions. It is an
abstract class since logic expressions should have a specific type. The type
information is used to determine the type of logic expression. The other `Expr`
classes define specific logic expression types, supporting conversion to a
string for display on the webpage and a string for serialization. Each also has
the `equals` function which is used to compare the values. These types, except
for `ExprAtom` are recursive and can contain other logic expression types.

The `ExprAny` class is a special exception. This was designed for pattern
matching so when justifying inference rules, expressions can be compared to an
expected form. This was not used very much and the places where it was used do
not really need it. It can easily be replaced with some type checking.

## Logic - Parsing

The parsing is done by processing an input string as a series of tokens. The
types of tokens are the parenthesis `(` and `)`, as well as contiguous sequences
of letters, numbers, and underscores. Tokens are separated by whitespace or by
switching from a parenthesis to a nonparenthesis character and vice versa. The
parsing algorithm is recursive and can be summarized by this pseudocode:
- Read a character `c`
- If `c == '('` then
  - Read the connective name (`and`, `not`, ...)
  - Recursively read expressions until reaching the matching `)`
  - Must read the correct number of expressions, variable for `and` and `or`
  - Construct the logic expression and return it
- Else
  - Expect a variable name and return it as a `ExprAtom`

## Logic - Justifications

The justifications logic is the most complicated part. It would take a lot of
writing to describe all of them here so some main ideas will be provided. The
sequent references may be in any order, so their patterns must be matched to
what is expected.

For example, if we are trying to check a if elim, then we expect 2 sequents
where one has the form P&rarr;Q and the other is equal to P. We may have to
check these in both orders since a sequent system does not necessarily give a
nice order to the referenced sequents. Once we can match these, we must check
that the sequent we are checking has Q as its expression. For this rule, the
assumption set is computed by combining the 2 assumption sets from the
referenced sequents.

Some rules require removing an assumption. In these cases, we search the
assumptions for an expected form and include all except that assumption. One
rule that requires this is not intro. The most complicated rule is or elim,
which requires matching components of the OR statement to the "subproof"
sequents so we can remove an assumption of each of them. This is handled with
bipartite matching and the Ford-Fulkerson algorithm.

The justification code is structured to handle some checking common to all
justifications first (such as checking that all referenced sequents are valid).
From there, the appropriate function is called depending on the rule. The
`calc.assumptions` set is initially empty and the justification functions for
each rule add to it. The `calc.valid` value is also set by whether or not the
rule can be properly justified.
