import { describe, expect, it } from 'vitest';

import { DIFFICULTY, PACING, type QuizCategoryOption, type QuizConfig } from '@shared/types/quiz';

import { countForCategory, countMatching } from '../count-matching';
import { estimateMinutes } from '../estimate-minutes';

const base: QuizConfig = {
  difficulty: DIFFICULTY.MIXED,
  categories: [],
  rounds: 3,
  questions_per_round: 10,
  endless: false,
  seconds_per_question: 20,
  pacing: PACING.AUTO,
};

const category = (slug: string, easy: number, medium: number, hard: number): QuizCategoryOption => ({
  slug,
  label: slug,
  emoji: '',
  blurb: '',
  colour: '',
  easy,
  medium,
  hard,
  total: easy + medium + hard,
});

describe('estimateMinutes', () => {
  it('estimates the default game at about a quarter of an hour', () => {
    expect(estimateMinutes(base)).toBe(13);
  });

  it('grows with rounds and with the clock', () => {
    const longer = estimateMinutes({ ...base, rounds: 6 }) ?? 0;
    const slower = estimateMinutes({ ...base, seconds_per_question: 30 }) ?? 0;
    expect(longer).toBeGreaterThan(estimateMinutes(base) ?? 0);
    expect(slower).toBeGreaterThan(estimateMinutes(base) ?? 0);
  });

  it('never reports less than a minute', () => {
    expect(estimateMinutes({ ...base, rounds: 1, questions_per_round: 3, seconds_per_question: 5 })).toBeGreaterThanOrEqual(1);
  });

  it('has no estimate for an endless game', () => {
    expect(estimateMinutes({ ...base, endless: true })).toBeNull();
  });
});

describe('countMatching', () => {
  const categories = [category('bible', 30, 40, 35), category('maths', 40, 36, 24)];

  it('counts every category when none is picked', () => {
    expect(countMatching(categories, base)).toBe(205);
  });

  it('counts only the picked categories at the picked difficulty', () => {
    expect(countMatching(categories, { ...base, categories: ['maths'], difficulty: DIFFICULTY.HARD })).toBe(24);
    expect(countMatching(categories, { ...base, difficulty: DIFFICULTY.EASY })).toBe(70);
  });

  it('reads the right column for each difficulty', () => {
    const maths = category('maths', 40, 36, 24);
    expect(countForCategory(maths, DIFFICULTY.EASY)).toBe(40);
    expect(countForCategory(maths, DIFFICULTY.MEDIUM)).toBe(36);
    expect(countForCategory(maths, DIFFICULTY.HARD)).toBe(24);
    expect(countForCategory(maths, DIFFICULTY.MIXED)).toBe(100);
  });
});
