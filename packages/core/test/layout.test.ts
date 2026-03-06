import { describe, expect, it } from 'vitest';
import { layoutFamilyTree } from '../src/layout';
import type { FamilyUnit } from '../src/types';

describe('layoutFamilyTree', () => {
  it('lays out a single member', () => {
    const data: FamilyUnit = { members: [{ id: 'p1' }], children: [] };
    const out = layoutFamilyTree(data);

    expect(out.nodes).toHaveLength(1);
    expect(out.edges).toHaveLength(0);
    expect(out.meta.generations).toBe(1);
  });

  it('creates spouse edge for two-member family unit', () => {
    const data: FamilyUnit = {
      members: [{ id: 'a' }, { id: 'b' }],
      children: [],
    };
    const out = layoutFamilyTree(data);

    expect(out.nodes).toHaveLength(2);
    expect(out.edges.some((e) => e.type === 'spouse')).toBe(true);
  });

  it('creates parent-child edges for each parent', () => {
    const data: FamilyUnit = {
      members: [{ id: 'father' }, { id: 'mother' }],
      children: [{ members: [{ id: 'child' }], children: [] }],
    };

    const out = layoutFamilyTree(data);
    const pcEdges = out.edges.filter((e) => e.type === 'parent-child');
    expect(pcEdges).toHaveLength(2);
    expect(pcEdges.map((e) => e.source).sort()).toEqual(['father', 'mother']);
  });
});
