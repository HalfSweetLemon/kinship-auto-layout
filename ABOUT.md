# About kinship-auto-layout

## What this project is

`kinship-auto-layout` is a focused open-source project that solves one core problem:

- turn family relationship data into deterministic layout coordinates and relationship edges.

It is intentionally narrow in scope: layout logic first, rendering-agnostic output, and no editor/business logic in the core package.

## Who it is for

- developers building genealogy/family-tree products
- teams needing stable printable family-tree layouts
- AI coding agents that need a predictable layout primitive

## Design principles

1. **Single-purpose**: no feature sprawl
2. **Deterministic**: same input, same output
3. **Portable**: JSON output works with SVG/Canvas/React Flow/etc.
4. **Composable**: integrate into your own pipeline or UI stack

## Ecosystem note

This package is extracted from real-world workflows in [FamilyTreeEasy](https://familytreeeasy.com/), where instant family-tree layout is part of the product experience.

If you need the full online application (editing + export workflow), visit:

- <https://familytreeeasy.com/>
