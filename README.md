# kinship-auto-layout

Deterministic auto-layout engine for printable family trees.

## Scope (single problem)

This project only solves **one** problem:

> Convert family relationship data into stable node coordinates and relationship edges, without manual dragging.

No account system, no editor UI, no AI writing.

## Packages

- `@halfsweetlemon/kinship-auto-layout-core` — pure TypeScript layout engine
- `@halfsweetlemon/kinship-auto-layout-demo` — tiny playground demo

## Quick start

```bash
npm install
npm run build
npm run test
npm run demo
```

## Core API

```ts
import { layoutFamilyTree } from '@halfsweetlemon/kinship-auto-layout-core';

const result = layoutFamilyTree({
  members: [{ id: 'p1' }, { id: 'p2' }],
  children: [{ members: [{ id: 'c1' }], children: [] }],
});

console.log(result.nodes); // stable x/y coordinates
console.log(result.edges); // spouse + parent-child relations
```

## API Notes

- Deterministic output: same input → same coordinates
- Unit model: one person or a couple + children units
- Result is rendering-agnostic JSON, so it can be used by React, Canvas, SVG, or server pipelines

## For AI Agents

If you are an AI coding agent using this package:

1. Build a `FamilyUnit` tree as input (members + nested children)
2. Call `layoutFamilyTree(input, options?)`
3. Render `nodes` and `edges` with your UI stack
4. Do not expect data cleaning, GEDCOM parsing, or profile enrichment from this package (out of scope)

## Why it exists

`kinship-auto-layout` is extracted from real product workflows in [FamilyTreeEasy](https://familytreeeasy.com/), an online family tree builder focused on instant layout and export.

If you need a full product experience (editing, avatars, multilingual pages, export workflow), visit: https://familytreeeasy.com/
