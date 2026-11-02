// Chạy: node test/test.js
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
require(path.join(root, 'assets/player.js'));

const algos = {
  heap: ['heap', 'heap_sort', a => a.at(-1).arr],
  insertion: ['insertion', 'insertion_sort', a => a.at(-1).arr],
  quick: ['quick', 'quick_sort', a => a.at(-1).arr],
  merge: ['merge', 'merge_sort', a => a.at(-1).pieces[0].vals],
};
const inputs = [
  [5, 2, 8, 1, 9, 3, 7, 4], [1], [2, 1], [1, 2, 3, 4, 5], [5, 4, 3, 2, 1],
  [3, 3, 3, 1, 1, 2], [-5, 0, 7, -5, 100, 999, -999, 4, 4, 2, 1, 0],
];
for (let r = 0; r < 200; r++) {
  const n = 1 + Math.floor(Math.random() * 12);
  inputs.push(Array.from({ length: n }, () => Math.floor(Math.random() * 40) - 10));
}
let fail = 0;
for (const [name, [js, cpp, final]] of Object.entries(algos)) {
  const A = require(path.join(root, 'assets/js', js + '.js'));
  const src = fs.readFileSync(path.join(root, 'cpp', cpp + '.cpp'), 'utf8').replace(/\s+/g, ' ');
  // 1) mọi dòng code hiển thị phải có trong file .cpp
  A.code.forEach((l, i) => {
    if (l.trim() && !src.includes(l.trim().replace(/\s+/g, ' '))) { console.log(`FAIL ${name}: dòng ${i + 1} không có trong ${cpp}.cpp: ${l}`); fail++; }
  });
  let maxSteps = 0;
  for (const inp of inputs) {
    const steps = A.gen(inp.slice());
    maxSteps = Math.max(maxSteps, steps.length);
    const want = inp.slice().sort((x, y) => x - y);
    const got = final(steps);
    if (JSON.stringify(got) !== JSON.stringify(want)) { console.log(`FAIL ${name}: ${inp} -> ${got}`); fail++; }
    steps.forEach((s, k) => {
      if (!(s.line >= 1 && s.line <= A.code.length)) { console.log(`FAIL ${name}: line ${s.line} ngoài phạm vi`); fail++; }
      if (typeof s.note !== 'string' || !s.note) { console.log(`FAIL ${name}: thiếu note`); fail++; }
      const html = A.render(s, steps[k - 1] || null);
      if (typeof html !== 'string' || /undefined|NaN/.test(html)) { console.log(`FAIL ${name}: render có undefined/NaN ở bước ${k}`); fail++; }
      A.vars(s).forEach(g => g.items.forEach(it => { if (it[1] === undefined || it[1] !== it[1]) { console.log(`FAIL ${name}: vars xấu`, it); fail++; } }));
    });
  }
  console.log(`${name}: ${inputs.length} mảng OK, tối đa ${maxSteps} bước`);
}
console.log(fail ? `${fail} LỖI` : 'TẤT CẢ ĐỀU ĐÚNG');
process.exit(fail ? 1 : 0);
