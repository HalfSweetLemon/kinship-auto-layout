import { layoutFamilyTree, type FamilyUnit } from '@kinship-auto-layout/core';

const inputEl = document.getElementById('input') as HTMLTextAreaElement;
const outputEl = document.getElementById('output') as HTMLPreElement;
const runEl = document.getElementById('run') as HTMLButtonElement;
const loadPresetEl = document.getElementById('loadPreset') as HTMLButtonElement;
const presetEl = document.getElementById('preset') as HTMLSelectElement;
const graphEl = document.getElementById('graph') as SVGSVGElement;

const NODE_W = 220;
const NODE_H = 64;

const presets: Record<string, FamilyUnit> = {
  single: { members: [{ id: 'me' }], children: [] },
  nuclear: {
    members: [{ id: 'father' }, { id: 'mother' }],
    children: [{ members: [{ id: 'child' }], children: [] }],
  },
  'three-gen': {
    members: [{ id: 'grandpa' }, { id: 'grandma' }],
    children: [
      {
        members: [{ id: 'father' }, { id: 'mother' }],
        children: [
          { members: [{ id: 'me' }], children: [] },
          { members: [{ id: 'sister' }], children: [] },
        ],
      },
    ],
  },
};

inputEl.value = JSON.stringify(presets.nuclear, null, 2);

function renderGraph(result: ReturnType<typeof layoutFamilyTree>) {
  const minX = Math.min(...result.nodes.map((n) => n.x), 0);
  const minY = Math.min(...result.nodes.map((n) => n.y), 0);
  const maxX = Math.max(...result.nodes.map((n) => n.x + NODE_W), 0);
  const maxY = Math.max(...result.nodes.map((n) => n.y + NODE_H), 0);
  const pad = 40;

  const width = maxX - minX + pad * 2;
  const height = maxY - minY + pad * 2;

  const vbW = Math.max(width, 600);
  const vbH = Math.max(height, 360);
  graphEl.setAttribute('viewBox', `0 0 ${vbW} ${vbH}`);
  graphEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  const pos = new Map(
    result.nodes.map((n) => [
      n.id,
      { x: n.x - minX + pad, y: n.y - minY + pad },
    ]),
  );

  const lines = result.edges
    .map((e) => {
      const s = pos.get(e.source);
      const t = pos.get(e.target);
      if (!s || !t) return '';

      if (e.type === 'spouse') {
        const x1 = s.x + NODE_W;
        const y1 = s.y + NODE_H / 2;
        const x2 = t.x;
        const y2 = t.y + NODE_H / 2;
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#64748b" stroke-width="2"/>`;
      }

      const x1 = s.x + NODE_W / 2;
      const y1 = s.y + NODE_H;
      const x2 = t.x + NODE_W / 2;
      const y2 = t.y;
      return `<path d="M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}" fill="none" stroke="#94a3b8" stroke-width="2"/>`;
    })
    .join('');

  const nodes = result.nodes
    .map((n) => {
      const p = pos.get(n.id)!;
      return `
      <g>
        <rect x="${p.x}" y="${p.y}" width="${NODE_W}" height="${NODE_H}" rx="10" fill="#ffffff" stroke="#2563eb" stroke-width="1.5"/>
        <text x="${p.x + 12}" y="${p.y + 38}" font-size="16" fill="#0f172a" font-family="system-ui, sans-serif">${n.id}</text>
      </g>`;
    })
    .join('');

  graphEl.innerHTML = `<g>${lines}${nodes}</g>`;
}

const run = () => {
  try {
    const parsed = JSON.parse(inputEl.value) as FamilyUnit;
    const result = layoutFamilyTree(parsed);
    outputEl.textContent = JSON.stringify(result, null, 2);
    renderGraph(result);
  } catch (err) {
    outputEl.textContent = String(err);
    graphEl.innerHTML = '';
  }
};

loadPresetEl.addEventListener('click', () => {
  const key = presetEl.value;
  const data = presets[key] || presets.nuclear;
  inputEl.value = JSON.stringify(data, null, 2);
  run();
});

runEl.addEventListener('click', run);
run();
