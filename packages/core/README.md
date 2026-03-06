# @halfsweetlemon/kinship-auto-layout-core

Deterministic auto-layout engine for family trees.

It solves one focused problem:

> Convert kinship data into stable node coordinates and relationship edges (spouse / parent-child), without manual dragging.

---

## Install

```bash
npm i @halfsweetlemon/kinship-auto-layout-core
```

## Quick Start

```ts
import { layoutFamilyTree } from '@halfsweetlemon/kinship-auto-layout-core';

const result = layoutFamilyTree({
  members: [{ id: 'father' }, { id: 'mother' }],
  children: [{ members: [{ id: 'child' }], children: [] }],
});

console.log(result.nodes);
console.log(result.edges);
console.log(result.meta);
```

## Input Model

```ts
type FamilyUnit = {
  members: { id: string; name?: string; gender?: 'male' | 'female' | 'unknown' }[];
  children: FamilyUnit[];
}
```

- `members`: one person or a couple
- `children`: nested family units

## API

### `layoutFamilyTree(input, options?)`

Returns:

- `nodes`: `{ id, x, y }[]`
- `edges`: `{ source, target, type }[]`
  - `type`: `"spouse" | "parent-child"`
- `meta`: `{ width, height, generations }`

### Options

All optional:

- `nodeWidth` (default `220`)
- `nodeHeight` (default `64`)
- `spouseGap` (default `40`)
- `siblingGap` (default `32`)
- `generationGap` (default `72`)
- `startX` (default `0`)
- `startY` (default `0`)

## Guarantees

- Deterministic layout: same input -> same output
- Rendering-agnostic JSON output (works with SVG/Canvas/React Flow/etc.)
- No side effects / no browser dependency in core logic

## Non-Goals

- GEDCOM parsing
- Data cleaning / entity resolution
- Profile enrichment or content generation

## For AI Coding Agents

1. Build a valid `FamilyUnit` tree
2. Call `layoutFamilyTree(input, options?)`
3. Render `nodes` + `edges` in your target UI

If input data quality is uncertain, validate upstream before calling this package.

## Ecosystem

This package is extracted from real production workflows used in [FamilyTreeEasy](https://familytreeeasy.com/), where instant family-tree layout is part of the editing experience.

If you need a full online app (editor + export workflow), see: <https://familytreeeasy.com/>

## License

MIT
