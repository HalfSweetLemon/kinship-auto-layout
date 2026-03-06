# kinship-auto-layout-core

Deterministic auto-layout engine for family trees.

It solves one focused problem:

> Convert kinship data into stable node coordinates and relationship edges (spouse / parent-child), without manual dragging.

---

## Install

```bash
npm i @halfsweetlemon/kinship-auto-layout-core
```

## Why this?

Standard graph layouts usually don't model spouse links and centered parent-child branches the way family trees need. This engine emphasizes:

1. **Symmetry**: children are centered under their parent unit.
2. **Stability**: same input always produces the same coordinates.
3. **Pure logic**: no DOM dependency in core output.

## Visual Mental Model

```text
Input (FamilyUnit)

[father] --spouse-- [mother]
          |
        child

Output (coordinates + edges)

nodes:
- father: (x=0,   y=0)
- mother: (x=260, y=0)
- child:  (x=130, y=136)

edges:
- father -> mother   (spouse)
- father -> child    (parent-child)
- mother -> child    (parent-child)
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

- `members`: one person or one couple (`length` should be 1 or 2)
- For a couple, current implementation treats `members[0]` and `members[1]` as partners in display order
- `children`: nested family units

> Note: multiple spouses for one person are not modeled in a single `FamilyUnit`; represent them as separate branches in your upstream data model.

## API

### `layoutFamilyTree(input, options?)`

Returns:

- `nodes`: `{ id, x, y }[]`
- `edges`: `{ source, target, type }[]` (`type`: `"spouse" | "parent-child"`)
- `meta`: `{ width, height, generations }`

### Coordinate System

- Origin is top-left: `(0, 0)`
- `x` grows to the right, `y` grows downward
- Node position is top-left corner of each node box

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `nodeWidth` | `number` | `220` | Width of a single member node |
| `nodeHeight` | `number` | `64` | Height of a single member node |
| `spouseGap` | `number` | `40` | Horizontal gap between spouses |
| `siblingGap` | `number` | `32` | Horizontal gap between sibling subtrees |
| `generationGap` | `number` | `72` | Vertical gap between generations |
| `startX` | `number` | `0` | Root layout start X |
| `startY` | `number` | `0` | Root layout start Y |

> `nodeWidth` is for one node only; it does **not** include `spouseGap`.

## Guarantees

- Deterministic layout: same input -> same output
- Rendering-agnostic JSON output (SVG/Canvas/React Flow/etc.)
- No side effects / no browser dependency in core logic

## Edge Cases

- This package assumes an acyclic tree-shaped input
- Cyclic kinship graphs are out of scope; behavior is undefined (validate upstream)

## Non-Goals

- GEDCOM parsing
- Data cleaning / entity resolution
- Profile enrichment or content generation

## For AI Coding Agents

1. Build a valid acyclic `FamilyUnit` tree
2. Call `layoutFamilyTree(input, options?)`
3. Render `nodes` + `edges` in your target UI
4. Use `import type { FamilyUnit, LayoutResult }` for strong typing

If input quality is uncertain, validate before calling this package.

## Playground

This repo includes a browser demo app (`apps/demo`) to inspect input JSON and rendered output side-by-side.

## Ecosystem

This package is extracted from real production workflows used in [FamilyTreeEasy](https://familytreeeasy.com/), where instant family-tree layout is part of the editing experience.

If you need a full online app (editor + export workflow), see: <https://familytreeeasy.com/>

## License

MIT
