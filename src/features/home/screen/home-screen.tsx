import { useNavigate } from 'react-router-dom';

import { PATHS } from '@shared/constants/routes';
import { Logo, LOGO_SIZE } from '@shared/ui/Logo';
import { BACKDROP, PartyBackdrop } from '@shared/ui/PartyBackdrop';
import { SoundToggle } from '@shared/ui/SoundToggle';

import { GameShelf } from './parts/game-shelf/GameShelf';
import { JoinBox } from './parts/join-box/JoinBox';

/**
 * The front door. Two ways in: host a game on this screen, or join one that is
 * already on a big screen nearby.
 */
export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <PartyBackdrop tone={BACKDROP.STAGE}>
      <SoundToggle className="absolute right-5 top-5 z-20" />
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-5 pb-16 pt-12 md:px-10">
        <header className="flex flex-col items-center gap-5 text-center">
          <Logo size={LOGO_SIZE.LG} className="animate-drop-in" />
          <p className="max-w-[30ch] animate-slide-up font-display text-[clamp(22px,3.2vw,34px)] font-bold leading-tight">
            Games for the whole family. One big screen, a phone each.
          </p>
        </header>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <GameShelf onPlay={(gameId) => navigate(PATHS.hostSetup(gameId))} />
          <aside className="flex flex-col gap-4 lg:pt-[52px]">
            <JoinBox onJoin={(code) => navigate(PATHS.joinWithCode(code))} />
            <button
              type="button"
              onClick={() => navigate(PATHS.solo)}
              className="flex items-center justify-between gap-3 rounded-card border-3 border-ink bg-sun p-5 text-left text-ink shadow-pop transition-transform active:translate-y-[6px] active:shadow-none"
            >
              <span>
                <span className="block font-display text-[26px] font-extrabold leading-none">Play solo</span>
                <span className="block text-[15px] font-semibold text-ink-2">Just you, ten questions, on this device.</span>
              </span>
              <span className="text-[40px] leading-none" aria-hidden="true">
                ⚡
              </span>
            </button>
            <ol className="flex flex-col gap-2 rounded-card border-3 border-white/40 bg-white/10 p-5 text-[16px] font-bold">
              <li>1. Put this page on the TV and host a game.</li>
              <li>2. Everyone scans the code with their phone.</li>
              <li>3. Answer fast. Fastest right answer scores most.</li>
            </ol>
          </aside>
        </div>
      </main>
    </PartyBackdrop>
  );
}
