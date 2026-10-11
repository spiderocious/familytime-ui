import { Show } from 'meemaw';

import { Eye, EyeOff } from '@icons';
import type { RoomPlayer } from '@shared/realtime/protocol';
import { Avatar, AVATAR_SIZE } from '@shared/ui/Avatar';
import { CountUp } from '@shared/ui/CountUp';
import { SoundToggle } from '@shared/ui/SoundToggle';

import { usePhonePrefs } from '../../providers/phone-prefs-provider';

interface PlayerHeaderProps {
  me: RoomPlayer;
  score: number | null;
}

/** Who you are and what you have, always at the top of the phone. */
export function PlayerHeader({ me, score }: PlayerHeaderProps) {
  const prefs = usePhonePrefs();

  return (
    <header className="flex items-center gap-3 px-4 pt-4">
      <Avatar emoji={me.avatar} size={AVATAR_SIZE.MD} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-[22px] font-extrabold leading-none">{me.name}</p>
        <Show when={score !== null}>
          <p className="font-display text-[16px] font-bold opacity-85">
            <CountUp value={score ?? 0} /> pts
          </p>
        </Show>
      </div>
      <button
        type="button"
        aria-pressed={prefs.showQuestion}
        aria-label={prefs.showQuestion ? 'Hide questions on my phone' : 'Show questions on my phone'}
        onClick={() => prefs.setShowQuestion(!prefs.showQuestion)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border-3 border-ink bg-surface text-ink shadow-pop-sm transition-transform active:translate-y-1 active:shadow-none"
      >
        <Show when={prefs.showQuestion} fallback={<EyeOff size={20} strokeWidth={3} aria-hidden="true" />}>
          <Eye size={20} strokeWidth={3} aria-hidden="true" />
        </Show>
      </button>
      <SoundToggle />
    </header>
  );
}
