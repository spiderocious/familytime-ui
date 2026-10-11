import { Repeat } from 'meemaw';

import { ANSWER_RESULT, type BoardRow } from '@shared/types/quiz';
import { Avatar, AVATAR_SIZE } from '@shared/ui/Avatar';
import { cn } from '@shared/utils/cn';

interface AnsweredStripProps {
  board: BoardRow[];
  answeredIds: string[];
  revealed: boolean;
}

/**
 * Who has locked in. While the question is open an avatar simply lights up —
 * it never shows WHAT they chose. At the reveal it shows who was right.
 */
export function AnsweredStrip({ board, answeredIds, revealed }: AnsweredStripProps) {
  const playing = board.filter((row) => row.connected || answeredIds.includes(row.player_id));
  const stable = [...playing].sort((a, b) => a.player_id.localeCompare(b.player_id));

  return (
    <div className="flex items-center gap-4">
      <p className="shrink-0 font-display text-[clamp(18px,1.9vw,30px)] font-extrabold" aria-live="polite">
        {answeredIds.length} of {playing.length} locked in
      </p>
      <ul className="flex flex-wrap gap-2">
        <Repeat each={stable}>
          {(row) => {
            const answered = answeredIds.includes(row.player_id);
            return (
              <li
                key={row.player_id}
                title={row.name}
                className={cn(
                  'rounded-full transition-all duration-300',
                  !answered && 'opacity-35 grayscale',
                  answered && !revealed && 'animate-jelly ring-4 ring-sun',
                  revealed && row.result === ANSWER_RESULT.CORRECT && 'ring-4 ring-action',
                  revealed && row.result === ANSWER_RESULT.WRONG && 'ring-4 ring-danger',
                )}
              >
                <Avatar emoji={row.avatar} size={AVATAR_SIZE.MD} />
              </li>
            );
          }}
        </Repeat>
      </ul>
    </div>
  );
}
