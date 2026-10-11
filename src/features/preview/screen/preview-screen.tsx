import { Repeat } from 'meemaw';
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Play } from '@icons';
import { PATHS } from '@shared/constants/routes';
import { ANSWER_RESULT, type BoardRow } from '@shared/types/quiz';
import { ANSWERS } from '@shared/ui/answers';
import { Avatar, AVATAR_SIZE } from '@shared/ui/Avatar';
import { Button, BUTTON_SIZE, BUTTON_VARIANT } from '@shared/ui/Button';
import { Card } from '@shared/ui/Card';
import { BOARD_SIZE, Leaderboard } from '@shared/ui/Leaderboard';
import { Logo, LOGO_SIZE } from '@shared/ui/Logo';
import { BACKDROP, PartyBackdrop } from '@shared/ui/PartyBackdrop';
import { Pill, PILL_TONE } from '@shared/ui/Pill';
import { Segmented } from '@shared/ui/Segmented';
import { Stepper } from '@shared/ui/Stepper';
import { TimerBar } from '@shared/ui/TimerBar';
import { Toggle } from '@shared/ui/Toggle';
import { cn } from '@shared/utils/cn';

const SWATCHES = [
  { name: 'Stage', className: 'bg-stage text-white', use: 'The frame. Party screens.' },
  { name: 'Canvas', className: 'bg-canvas text-ink', use: 'The room. Working screens.' },
  { name: 'Surface', className: 'bg-surface text-ink', use: 'Cards only.' },
  { name: 'Ink', className: 'bg-ink text-white', use: 'Type and every outline.' },
  { name: 'Action', className: 'bg-action text-white', use: 'Go. Correct.' },
  { name: 'Accent', className: 'bg-accent text-white', use: 'Celebration only.' },
  { name: 'Sun', className: 'bg-sun text-ink', use: 'Highlights. First place.' },
  { name: 'Bubble', className: 'bg-bubble text-white', use: 'Party colour.' },
  { name: 'Sky', className: 'bg-sky text-ink', use: 'Party colour.' },
  { name: 'Berry', className: 'bg-berry text-white', use: 'Between questions.' },
  { name: 'Danger', className: 'bg-danger text-white', use: 'Wrong. Destructive.' },
];

const PEOPLE = ['🦁', '🐼', '🦄', '🐸', '🐙', '🦉'];

const row = (id: string, name: string, avatar: string, score: number, delta: number, streak: number): BoardRow => ({
  player_id: id,
  name,
  avatar,
  score,
  round_score: delta,
  delta,
  rank: 0,
  prev_rank: 0,
  streak,
  result: delta > 0 ? ANSWER_RESULT.CORRECT : ANSWER_RESULT.WRONG,
  connected: true,
});

const BOARD_A = [row('a', 'Grandma', '🦉', 4200, 950, 4), row('b', 'Tobi', '🦁', 3900, 0, 0), row('c', 'Mum', '🐼', 3100, 720, 1)];
const BOARD_B = [row('b', 'Tobi', '🦁', 4880, 980, 1), row('a', 'Grandma', '🦉', 4200, 0, 0), row('c', 'Mum', '🐼', 3990, 890, 2)];

interface BlockProps {
  title: string;
  note: string;
  children: ReactNode;
}

function Block({ title, note, children }: BlockProps) {
  return (
    <section className="flex flex-col gap-4">
      <header>
        <h2 className="text-[34px]">{title}</h2>
        <p className="max-w-[70ch] text-[16px] font-semibold text-ink-3">{note}</p>
      </header>
      {children}
    </section>
  );
}

/**
 * The design system, live. Every token and component the game is built from,
 * rendered from the real code rather than described — if it is wrong here, it
 * is wrong in the game.
 */
export default function PreviewScreen() {
  const [difficulty, setDifficulty] = useState('mixed');
  const [rounds, setRounds] = useState(3);
  const [endless, setEndless] = useState(false);
  const [overtaken, setOvertaken] = useState(false);

  return (
    <PartyBackdrop tone={BACKDROP.CANVAS}>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-5 py-10">
        <header className="flex flex-col items-start gap-4">
          <Link to={PATHS.home} className="font-display text-[18px] font-extrabold text-stage underline">
            ← Back to the game
          </Link>
          <Logo size={LOGO_SIZE.LG} />
          <h1 className="text-[52px]">Living-room party</h1>
          <p className="max-w-[68ch] text-[18px] font-semibold text-ink-2">
            Built on Gbedity’s bright-room game-night system — cobalt stage, mint canvas, white cards, forest ink — and
            pushed toward play. Three rules do the work: every object wears a 3px ink outline; depth is a solid
            drop-edge the control presses into, never a blur; and things arrive with a bounce.
          </p>
        </header>

        <Block title="Colour" note="Three layers carry depth: stage, canvas, card. Each colour has one job and keeps it.">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <Repeat each={SWATCHES}>
              {(swatch) => (
                <li key={swatch.name} className={cn('rounded-card border-3 border-ink p-4 shadow-pop-sm', swatch.className)}>
                  <p className="font-display text-[22px] font-extrabold leading-none">{swatch.name}</p>
                  <p className="mt-1 text-[13px] font-bold opacity-85">{swatch.use}</p>
                </li>
              )}
            </Repeat>
          </ul>
        </Block>

        <Block title="Type" note="Baloo 2 shouts: titles, numbers, buttons. Nunito works: labels and sentences. Numerals are tabular everywhere.">
          <Card className="flex flex-col gap-3 p-6">
            <p className="font-display text-[72px] font-extrabold leading-none">Round 2</p>
            <p className="font-display text-[34px] font-extrabold leading-none">What is the capital of Nigeria?</p>
            <p className="text-[18px] font-semibold text-ink-2">Everyone answers at once. Right is good. Right and fast is better.</p>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink-3">Game code · 12,480 pts · 1.4s</p>
          </Card>
        </Block>

        <Block title="Buttons" note="One button. It sits on its drop-edge and travels exactly that depth when pressed — press one.">
          <div className="flex flex-wrap items-end gap-4">
            <Button size={BUTTON_SIZE.XL} icon={<Play size={26} strokeWidth={3} fill="currentColor" aria-hidden="true" />}>
              Start
            </Button>
            <Button variant={BUTTON_VARIANT.STAGE} size={BUTTON_SIZE.LG}>
              Join
            </Button>
            <Button variant={BUTTON_VARIANT.SUN}>Next</Button>
            <Button variant={BUTTON_VARIANT.PLAIN}>Settings</Button>
            <Button variant={BUTTON_VARIANT.DANGER} size={BUTTON_SIZE.SM}>
              End now
            </Button>
            <Button disabled>Waiting</Button>
          </div>
        </Block>

        <Block title="The four answers" note="Fixed order. Each colour is locked to a shape and a letter, so colour is never the only way to tell them apart.">
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Repeat each={[...ANSWERS]}>
              {(answer) => {
                const Shape = answer.shape;
                return (
                  <li key={answer.letter} className={cn('flex items-center gap-3 rounded-card border-3 border-ink p-4 shadow-pop', answer.bg, answer.text)}>
                    <Shape size={36} strokeWidth={3} fill="currentColor" aria-hidden="true" />
                    <span className="font-display text-[28px] font-extrabold">Answer {answer.letter}</span>
                  </li>
                );
              }}
            </Repeat>
          </ul>
        </Block>

        <Block title="People" note="An animal on a coloured plate. The plate colour comes from the emoji, so a player looks the same on every screen.">
          <div className="flex flex-wrap items-end gap-4">
            <Repeat each={PEOPLE}>{(emoji) => <Avatar key={emoji} emoji={emoji} size={AVATAR_SIZE.XL} />}</Repeat>
            <Avatar emoji="🐢" size={AVATAR_SIZE.LG} away />
            <Avatar emoji="🦊" size={AVATAR_SIZE.MD} />
            <Avatar emoji="🐧" size={AVATAR_SIZE.SM} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill tone={PILL_TONE.SUN}>🧠 General Knowledge</Pill>
            <Pill tone={PILL_TONE.STAGE}>Round 2</Pill>
            <Pill tone={PILL_TONE.GO}>Ready</Pill>
            <Pill tone={PILL_TONE.ACCENT}>Round winner</Pill>
            <Pill tone={PILL_TONE.BERRY}>Endless</Pill>
            <Pill tone={PILL_TONE.BUBBLE}>New</Pill>
            <Pill tone={PILL_TONE.DANGER}>Out of time</Pill>
          </div>
        </Block>

        <Block title="Controls" note="Settings are chosen, not typed: one of a few, a number nudged, a switch.">
          <Card className="flex flex-col gap-5 p-6">
            <Segmented
              label="Difficulty"
              value={difficulty}
              onChange={setDifficulty}
              options={[
                { value: 'easy', label: '🐣 Easy' },
                { value: 'medium', label: '🤓 Medium' },
                { value: 'hard', label: '🧨 Hard' },
                { value: 'mixed', label: '🎲 Mixed' },
              ]}
            />
            <div className="flex flex-wrap items-center gap-8">
              <Stepper label="rounds" value={rounds} min={1} max={20} onChange={setRounds} disabled={endless} />
              <label className="flex items-center gap-3 font-display text-[20px] font-extrabold">
                <Toggle label="Endless" checked={endless} onChange={setEndless} />
                Endless
              </label>
            </div>
          </Card>
        </Block>

        <Block title="The clock" note="Drains green, turns sun at half, and goes tomato with a heartbeat in the last five seconds.">
          <div className="flex flex-col gap-4 rounded-card border-3 border-ink bg-stage p-5">
            <TimerBar fraction={0.8} secondsLeft={16} />
            <TimerBar fraction={0.4} secondsLeft={8} />
            <TimerBar fraction={0.15} secondsLeft={3} />
          </div>
        </Block>

        <Block title="Scoreboard" note="Rows are placed by rank and slide between places, so an overtake is something you watch happen.">
          <div className="flex flex-col gap-4 rounded-card border-3 border-ink bg-berry p-5">
            <Leaderboard rows={overtaken ? BOARD_B : BOARD_A} size={BOARD_SIZE.SCREEN} showDelta />
            <Button variant={BUTTON_VARIANT.SUN} className="self-start" onClick={() => setOvertaken((value) => !value)}>
              Play the next question
            </Button>
          </div>
        </Block>

        <Block title="Motion" note="Things pop, drop, wobble and bob. Anyone who asks their device for less motion gets the same game standing still.">
          <div className="flex flex-wrap gap-4">
            <Repeat each={['animate-pop-in', 'animate-jelly', 'animate-wiggle', 'animate-bob', 'animate-heartbeat', 'animate-shake']}>
              {(animation) => (
                <div key={animation} className="flex flex-col items-center gap-2">
                  <span className={cn('inline-flex h-20 w-20 items-center justify-center rounded-card border-3 border-ink bg-sun text-[40px] shadow-pop-sm', animation)} aria-hidden="true">
                    🎈
                  </span>
                  <code className="text-[12px] font-bold text-ink-3">{animation.replace('animate-', '')}</code>
                </div>
              )}
            </Repeat>
          </div>
        </Block>
      </main>
    </PartyBackdrop>
  );
}
