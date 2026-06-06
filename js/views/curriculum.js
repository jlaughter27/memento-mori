// views/curriculum.js — printable scope & sequence with Common Core alignment.
import { BY_GRADE, getStandard, standardsCount } from '../curriculum/index.js';
import { isMastered } from '../state.js';
import { navigate } from '../ui/shell.js';
import { sfx } from '../ui/sound.js';
import { escapeHtml } from '../ui/dom.js';

export function renderCurriculum(root) {
  const grades = [3, 4, 5, 6];
  root.innerHTML = `
    <div class="curric-wrap">
      <header class="curric-top no-print">
        <button class="btn-ghost" id="curric-back">← Back</button>
        <button class="btn" id="curric-print">🖨️ Print</button>
      </header>
      <div class="curric-doc">
        <h1 class="curric-h1">🦊 MathQuest Curriculum Map</h1>
        <p class="curric-sub">${BY_GRADE[3].length + BY_GRADE[4].length + BY_GRADE[5].length + BY_GRADE[6].length}
          skills · ${standardsCount} Common Core standards · Grades 3–6</p>
        ${grades.map((g) => `
          <section class="curric-grade">
            <h2 class="curric-g">Grade ${g}</h2>
            <table class="curric-table">
              <thead><tr><th>Skill</th><th>Standard</th><th>What it means</th><th class="no-print">Status</th></tr></thead>
              <tbody>
                ${BY_GRADE[g].map((s) => {
                  const st = getStandard(s.id);
                  return `<tr>
                    <td>${s.emoji || ''} ${escapeHtml(s.title)}</td>
                    <td class="ct-code">${st ? escapeHtml(st.code) : '—'}</td>
                    <td class="ct-text">${st ? escapeHtml(st.text) : ''}</td>
                    <td class="no-print">${isMastered(s.id) ? '✅' : '⬜'}</td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </section>`).join('')}
        <p class="curric-foot">Aligned to the Common Core State Standards for Mathematics. MathQuest is private by design — all progress stays on this device.</p>
      </div>
    </div>`;
  root.querySelector('#curric-back').addEventListener('click', () => { sfx.tap(); navigate('#/parent'); });
  root.querySelector('#curric-print').addEventListener('click', () => { sfx.tap(); window.print(); });
}
