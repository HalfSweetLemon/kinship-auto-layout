import type { FamilyUnit, LayoutEdge, LayoutNode, LayoutOptions, LayoutResult } from './types.js';

interface UnitMeasure {
  selfW: number;
  subtreeW: number;
  childrenTotalW: number;
}

const DEFAULTS: Required<LayoutOptions> = {
  nodeWidth: 220,
  nodeHeight: 64,
  spouseGap: 40,
  siblingGap: 32,
  generationGap: 72,
  startX: 0,
  startY: 0,
};

export function layoutFamilyTree(input: FamilyUnit, options: LayoutOptions = {}): LayoutResult {
  const cfg = { ...DEFAULTS, ...options };
  const nodes: LayoutNode[] = [];
  const edges: LayoutEdge[] = [];
  const measures = new Map<FamilyUnit, UnitMeasure>();

  const measure = (unit: FamilyUnit): UnitMeasure => {
    const childrenMeasures = unit.children.map(measure);
    const selfW = unit.members.length === 2
      ? cfg.nodeWidth * 2 + cfg.spouseGap
      : cfg.nodeWidth;

    const childrenTotalW = childrenMeasures.length === 0
      ? 0
      : childrenMeasures.reduce((sum, m) => sum + m.subtreeW, 0) + cfg.siblingGap * (childrenMeasures.length - 1);

    const subtreeW = Math.max(selfW, childrenTotalW);
    const result: UnitMeasure = { selfW, subtreeW, childrenTotalW };
    measures.set(unit, result);
    return result;
  };

  const addPerson = (id: string, x: number, y: number) => nodes.push({ id, x, y });
  const addSpouseEdge = (leftId: string, rightId: string) => edges.push({ source: leftId, target: rightId, type: 'spouse' });
  const addParentChildEdge = (parentId: string, childId: string) => edges.push({ source: parentId, target: childId, type: 'parent-child' });

  let maxLevel = 0;

  const layout = (unit: FamilyUnit, leftX: number, level: number): void => {
    const m = measures.get(unit);
    if (!m) return;

    maxLevel = Math.max(maxLevel, level);

    const centerX = leftX + m.subtreeW / 2;
    const y = cfg.startY + level * (cfg.nodeHeight + cfg.generationGap);

    if (unit.members.length === 1) {
      addPerson(unit.members[0].id, centerX - cfg.nodeWidth / 2, y);
    } else if (unit.members.length >= 2) {
      const left = centerX - (cfg.nodeWidth * 2 + cfg.spouseGap) / 2;
      const a = unit.members[0];
      const b = unit.members[1];
      addPerson(a.id, left, y);
      addPerson(b.id, left + cfg.nodeWidth + cfg.spouseGap, y);
      addSpouseEdge(a.id, b.id);
    }

    if (unit.children.length > 0) {
      let childLeft = centerX - m.childrenTotalW / 2;

      for (const child of unit.children) {
        const childMeasure = measures.get(child);
        if (!childMeasure) continue;

        if (child.members[0]) {
          for (const parent of unit.members) {
            addParentChildEdge(parent.id, child.members[0].id);
          }
        }

        layout(child, childLeft, level + 1);
        childLeft += childMeasure.subtreeW + cfg.siblingGap;
      }
    }
  };

  const rootMeasure = measure(input);
  layout(input, cfg.startX, 0);

  return {
    nodes,
    edges,
    meta: {
      width: rootMeasure.subtreeW,
      height: (maxLevel + 1) * cfg.nodeHeight + maxLevel * cfg.generationGap,
      generations: maxLevel + 1,
    },
  };
}
