// curriculum/index.js — aggregate all grades + lookup helpers.
import g2 from './grade2.js';
import g3 from './grade3.js';
import g4 from './grade4.js';
import g5 from './grade5.js';
import g6 from './grade6.js';
import g7 from './grade7.js';
import wordbank from './wordbank.js';
import rewardsData from './rewards-data.js';
import standards from './standards.js';

export const ALL_SKILLS = [...g2, ...g3, ...g4, ...g5, ...g6, ...g7];
export const BY_GRADE = { 2: g2, 3: g3, 4: g4, 5: g5, 6: g6, 7: g7 };
// grades that actually have content, low→high (drives grade tabs / pickers)
export const GRADES = Object.keys(BY_GRADE).map(Number).filter((g) => BY_GRADE[g] && BY_GRADE[g].length).sort((a, b) => a - b);
export { wordbank, rewardsData, standards };

const byId = new Map(ALL_SKILLS.map((s) => [s.id, s]));
export const getSkill = (id) => byId.get(id);
// prefer the curated standards map; fall back to a `cc` field on the skill (grades 2 & 7)
export const getStandard = (id) => standards[id] || (byId.get(id) && byId.get(id).cc) || null;
export const standardsCount = new Set(
  ALL_SKILLS.map((s) => (getStandard(s.id) || {}).code).filter(Boolean)
).size;

export const STRANDS = [
  'Numbers & Place Value',
  'Addition & Subtraction',
  'Multiplication',
  'Division',
  'Fractions',
  'Decimals',
  'Geometry & Measurement',
  'Data & Patterns',
  'Money & Time',
  'Ratios & Algebra',
];

export const STRAND_META = {
  'Numbers & Place Value': { emoji: '🔢', color: '#6c5ce7' },
  'Addition & Subtraction': { emoji: '➕', color: '#00b894' },
  'Multiplication': { emoji: '✖️', color: '#e17055' },
  'Division': { emoji: '➗', color: '#0984e3' },
  'Fractions': { emoji: '🍕', color: '#e84393' },
  'Decimals': { emoji: '🔟', color: '#fd79a8' },
  'Geometry & Measurement': { emoji: '📐', color: '#00cec9' },
  'Data & Patterns': { emoji: '📊', color: '#fdcb6e' },
  'Money & Time': { emoji: '💰', color: '#55efc4' },
  'Ratios & Algebra': { emoji: '⚖️', color: '#a29bfe' },
};

export function skillsForGrade(grade) {
  return BY_GRADE[grade] || [];
}

// group a grade's skills by strand, preserving strand order
export function groupedByStrand(grade) {
  const skills = skillsForGrade(grade);
  const groups = [];
  for (const strand of STRANDS) {
    const inStrand = skills.filter((s) => s.strand === strand);
    if (inStrand.length) groups.push({ strand, skills: inStrand, ...STRAND_META[strand] });
  }
  // catch any strand not in canonical list (safety)
  const seen = new Set(STRANDS);
  for (const s of skills) {
    if (!seen.has(s.strand)) {
      seen.add(s.strand);
      groups.push({ strand: s.strand, skills: skills.filter((x) => x.strand === s.strand), emoji: '⭐', color: '#888' });
    }
  }
  return groups;
}

export function strandSkills(grade, strand) {
  return skillsForGrade(grade).filter((s) => s.strand === strand);
}
