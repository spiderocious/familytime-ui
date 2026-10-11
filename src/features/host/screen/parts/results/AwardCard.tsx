import { Flame, Sparkles, Target, Zap, type LucideIcon } from '@icons';
import { AWARD, type QuizAward } from '@shared/types/quiz';
import { Avatar, AVATAR_SIZE } from '@shared/ui/Avatar';
import { cn } from '@shared/utils/cn';

interface AwardCardProps {
  award: QuizAward;
  index: number;
}

const ART: Record<string, { icon: LucideIcon; plate: string }> = {
  [AWARD.SPEED_DEMON]: { icon: Zap, plate: 'bg-sky text-ink' },
  [AWARD.SHARPSHOOTER]: { icon: Target, plate: 'bg-bubble text-white' },
  [AWARD.ON_FIRE]: { icon: Flame, plate: 'bg-accent text-white' },
};
const FALLBACK_ART = { icon: Sparkles, plate: 'bg-sun text-ink' };

/** A superlative handed out at the end, so there is more than one way to win the night. */
export function AwardCard({ award, index }: AwardCardProps) {
  const art = ART[award.key] ?? FALLBACK_ART;
  const Icon = art.icon;

  return (
    <li
      style={{ ['--i' as string]: index + 28 }}
      className="stagger flex animate-pop-in items-center gap-3 rounded-card border-3 border-ink bg-surface p-3 text-ink shadow-pop-sm"
    >
      <span className={cn('inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-3 border-ink', art.plate)}>
        <Icon size={28} strokeWidth={3} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-[20px] font-extrabold leading-none">{award.title}</p>
        <p className="truncate text-[13px] font-bold text-ink-3">{award.blurb}</p>
        <p className="mt-1 flex items-center gap-2 font-display text-[18px] font-extrabold">
          <Avatar emoji={award.avatar} size={AVATAR_SIZE.SM} />
          <span className="truncate">{award.name}</span>
          <span className="shrink-0 text-[14px] font-extrabold text-action-deep">{award.value}</span>
        </p>
      </div>
    </li>
  );
}
