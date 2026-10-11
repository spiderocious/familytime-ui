import { Repeat, Show } from 'meemaw';
import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import { ArrowRight, Eye } from '@icons';
import { PATHS } from '@shared/constants/routes';
import { ROOM_PHASE } from '@shared/realtime/protocol';
import { sessionStore } from '@shared/services/session-store';
import { SOUND, sound } from '@shared/services/sound';
import { Avatar, AVATAR_SIZE } from '@shared/ui/Avatar';
import { Button, BUTTON_SIZE, BUTTON_VARIANT } from '@shared/ui/Button';
import { Card } from '@shared/ui/Card';
import { InlineError } from '@shared/ui/InlineError';
import { LoadingScreen } from '@shared/ui/LoadingScreen';
import { Logo, LOGO_SIZE } from '@shared/ui/Logo';
import { BACKDROP, PartyBackdrop } from '@shared/ui/PartyBackdrop';
import { Toggle } from '@shared/ui/Toggle';
import { cn } from '@shared/utils/cn';

import { useJoinRoom } from '../api/use-join-room';
import { useRoomInfo, type RoomInfo } from '../api/use-room-info';
import { usePhonePrefs } from '../providers/phone-prefs-provider';

const CODE_LENGTH = 5;
const MAX_NAME_LENGTH = 16;

function CodeStep() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const ready = code.length === CODE_LENGTH;

  const submit = (event: FormEvent): void => {
    event.preventDefault();
    if (ready) navigate(PATHS.joinWithCode(code));
  };

  return (
    <Card big className="w-full max-w-md animate-pop-in p-6 text-ink">
      <form onSubmit={submit} className="flex flex-col gap-5">
        <h1 className="text-center text-[36px]">Enter the code</h1>
        <p className="text-center text-[16px] font-bold text-ink-3">It is on the big screen.</p>
        <input
          aria-label="Game code"
          value={code}
          autoFocus
          onChange={(event) => setCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, CODE_LENGTH))}
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          placeholder="ABCDE"
          className="h-20 w-full rounded-btn border-3 border-ink bg-canvas-tint text-center font-display text-[44px] font-extrabold uppercase tracking-[0.3em] placeholder:text-ink-5"
        />
        <Button type="submit" variant={BUTTON_VARIANT.STAGE} size={BUTTON_SIZE.XL} disabled={!ready} icon={<ArrowRight size={26} strokeWidth={3} aria-hidden="true" />}>
          Next
        </Button>
      </form>
    </Card>
  );
}

interface DetailsStepProps {
  info: RoomInfo;
}

function DetailsStep({ info }: DetailsStepProps) {
  const navigate = useNavigate();
  const join = useJoinRoom();
  const prefs = usePhonePrefs();
  const [name, setName] = useState(() => sessionStore.lastName());
  const [avatar, setAvatar] = useState(() => {
    const last = sessionStore.lastAvatar();
    return info.avatars.includes(last) ? last : (info.avatars[Math.floor(Math.random() * info.avatars.length)] ?? '');
  });

  const trimmed = name.trim();
  // The server's field error for the name, shown under the field it belongs to.
  const nameError = join.error?.fieldErrors?.name?.[0];
  const generalError = join.isError && nameError === undefined ? join.error.message : undefined;

  const submit = (event: FormEvent): void => {
    event.preventDefault();
    if (trimmed === '') return;
    join.mutate(
      { code: info.code, name: trimmed, avatar },
      {
        onSuccess: (joined) => {
          sessionStore.setSeat(joined.code, { playerId: joined.player_id, token: joined.player_token, name: joined.name, avatar: joined.avatar });
          sound.play(SOUND.JOIN);
          navigate(PATHS.play(joined.code), { replace: true });
        },
      },
    );
  };

  return (
    <Card big className="w-full max-w-md animate-pop-in p-5 text-ink">
      <form onSubmit={submit} className="flex flex-col gap-5">
        <header className="text-center">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-ink-3">
            Joining {info.game_title} · {info.code}
          </p>
          <h1 className="mt-1 text-[34px]">Who’s playing?</h1>
          <Show when={info.phase === ROOM_PHASE.PLAYING}>
            <p className="mt-2 rounded-chip bg-sun-soft px-3 py-1.5 text-[14px] font-bold">The game has started — jump in from the next question.</p>
          </Show>
        </header>

        <div className="flex items-center gap-3">
          <Avatar emoji={avatar} size={AVATAR_SIZE.XL} className="animate-bob" />
          <label className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-ink-3">Your name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value.slice(0, MAX_NAME_LENGTH))}
              autoFocus
              autoComplete="given-name"
              maxLength={MAX_NAME_LENGTH}
              placeholder="e.g. Grandma"
              aria-invalid={nameError !== undefined}
              className="h-14 w-full rounded-btn border-3 border-ink bg-canvas-tint px-4 font-display text-[26px] font-extrabold placeholder:text-ink-5"
            />
          </label>
        </div>
        <Show when={nameError !== undefined}>
          <InlineError message={nameError ?? ''} />
        </Show>

        <fieldset>
          <legend className="mb-2 text-[13px] font-extrabold uppercase tracking-[0.1em] text-ink-3">Pick your animal</legend>
          <div className="grid grid-cols-5 gap-2">
            <Repeat each={info.avatars}>
              {(emoji) => (
                <button
                  key={emoji}
                  type="button"
                  aria-label={`Avatar ${emoji}`}
                  aria-pressed={emoji === avatar}
                  onClick={() => {
                    sound.play(SOUND.TAP);
                    setAvatar(emoji);
                  }}
                  className={cn(
                    'flex aspect-square items-center justify-center rounded-2xl border-3 text-[30px] leading-none transition-transform',
                    emoji === avatar ? 'scale-110 border-ink bg-sun shadow-pop-sm' : 'border-transparent bg-canvas-tint',
                  )}
                >
                  {emoji}
                </button>
              )}
            </Repeat>
          </div>
        </fieldset>

        <label className="flex items-center justify-between gap-3 rounded-btn border-3 border-ink bg-sky-soft p-3">
          <span className="flex items-center gap-3">
            <Eye size={24} strokeWidth={3} aria-hidden="true" className="shrink-0" />
            <span>
              <span className="block font-display text-[18px] font-extrabold leading-tight">Show questions on my phone</span>
              <span className="block text-[13px] font-semibold text-ink-3">Handy if you can’t see the big screen well.</span>
            </span>
          </span>
          <Toggle label="Show questions on my phone" checked={prefs.showQuestion} onChange={prefs.setShowQuestion} />
        </label>

        <Show when={generalError !== undefined}>
          <InlineError message={generalError ?? ''} />
        </Show>

        <Button type="submit" size={BUTTON_SIZE.XL} disabled={trimmed === '' || join.isPending || !info.joinable}>
          <Show when={!join.isPending} fallback="Joining…">
            Let me in!
          </Show>
        </Button>
      </form>
    </Card>
  );
}

/** The way in on a phone: the code (unless the QR supplied it), then a name and an animal. */
export default function JoinScreen() {
  const { code = '' } = useParams();
  const roomCode = code.toUpperCase();
  const info = useRoomInfo(roomCode);

  // Already seated in this room on this phone: straight back to the game.
  if (roomCode !== '' && sessionStore.getSeat(roomCode) !== null) {
    return <Navigate to={PATHS.play(roomCode)} replace />;
  }
  if (roomCode !== '' && info.isPending) {
    return <LoadingScreen label="Finding the game…" />;
  }

  return (
    <PartyBackdrop tone={BACKDROP.STAGE}>
      <main className="flex min-h-screen flex-col items-center gap-6 px-4 pb-10 pt-8">
        <Link to={PATHS.home} aria-label="Family Time home">
          <Logo size={LOGO_SIZE.SM} />
        </Link>

        <Show when={roomCode === ''}>
          <CodeStep />
        </Show>

        <Show when={roomCode !== '' && info.isError}>
          <Card big className="flex w-full max-w-md animate-pop-in flex-col items-center gap-4 p-6 text-center text-ink">
            <span className="text-[64px] leading-none" aria-hidden="true">
              🔎
            </span>
            <h1 className="text-[32px]">Can’t find {roomCode}</h1>
            <p className="text-[17px] font-bold text-ink-3">{info.error?.message}</p>
            <Link to={PATHS.join} className="font-display text-[20px] font-extrabold text-stage underline">
              Try another code
            </Link>
          </Card>
        </Show>

        <Show when={info.data !== undefined}>{info.data === undefined ? null : <DetailsStep info={info.data} />}</Show>
      </main>
    </PartyBackdrop>
  );
}
