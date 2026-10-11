import { Repeat, Show } from 'meemaw';
import { QRCodeSVG } from 'qrcode.react';

import { PATHS } from '@shared/constants/routes';
import { Card } from '@shared/ui/Card';

interface JoinPanelProps {
  code: string;
}

const LOCAL_HOSTS = ['localhost', '127.0.0.1', '[::1]'];

/**
 * How to get in: a QR code, and the same thing spelled out for anyone whose
 * camera will not cooperate.
 *
 * The link is built from the address THIS page was opened at, because that is
 * the one address known to work on this network. If that address is localhost,
 * phones cannot reach it — so the panel says so rather than showing a QR code
 * that leads nowhere.
 */
export function JoinPanel({ code }: JoinPanelProps) {
  const joinUrl = `${window.location.origin}${PATHS.joinWithCode(code)}`;
  const unreachable = LOCAL_HOSTS.includes(window.location.hostname);

  return (
    <Card big className="flex animate-pop-in flex-col items-center gap-5 p-[clamp(16px,2vw,32px)] text-center text-ink">
      <p className="font-display text-[clamp(20px,2vw,30px)] font-extrabold leading-tight">
        Scan to join, or go to
        <span className="block break-all text-stage">{window.location.host}/join</span>
      </p>

      <div className="rounded-[24px] border-3 border-ink bg-white p-3">
        <QRCodeSVG value={joinUrl} size={220} level="M" marginSize={0} className="h-[clamp(140px,15vw,240px)] w-[clamp(140px,15vw,240px)]" />
      </div>

      <div>
        <p className="text-[14px] font-extrabold uppercase tracking-[0.14em] text-ink-3">Game code</p>
        <p className="mt-2 flex justify-center gap-2" aria-label={`Game code ${code.split('').join(' ')}`}>
          <Repeat each={code.split('')}>
            {(letter, index) => (
              <span
                key={`${letter}-${index}`}
                style={{ ['--i' as string]: index }}
                className="stagger inline-flex h-[clamp(52px,5.4vw,88px)] w-[clamp(44px,4.6vw,76px)] animate-pop-in items-center justify-center rounded-2xl border-3 border-ink bg-sun font-display text-[clamp(34px,3.8vw,62px)] font-extrabold leading-none shadow-pop-sm"
              >
                {letter}
              </span>
            )}
          </Repeat>
        </p>
      </div>

      <Show when={unreachable}>
        <p className="rounded-chip border-2 border-accent bg-accent-soft px-3 py-2 text-[14px] font-bold text-ink">
          Phones cannot open “localhost”. Open this page using this computer’s network address (for example
          192.168.x.x) so the code works for everyone.
        </p>
      </Show>
    </Card>
  );
}
