export type Gender = 'male' | 'female' | 'unknown';

export interface Person {
  id: string;
  name?: string;
  gender?: Gender;
}

export interface FamilyUnit {
  members: Person[]; // 1 or 2 members (single / couple)
  children: FamilyUnit[];
}

export interface LayoutOptions {
  nodeWidth?: number;
  nodeHeight?: number;
  spouseGap?: number;
  siblingGap?: number;
  generationGap?: number;
  startX?: number;
  startY?: number;
}

export interface LayoutNode {
  id: string;
  x: number;
  y: number;
}

export type EdgeType = 'spouse' | 'parent-child';

export interface LayoutEdge {
  source: string;
  target: string;
  type: EdgeType;
}

export interface LayoutResult {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  meta: {
    width: number;
    height: number;
    generations: number;
  };
}
