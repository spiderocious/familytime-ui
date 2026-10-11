interface ComingSoonTileProps {
  emoji: string;
  title: string;
}

/** A placeholder on the shelf. Not a button: there is nothing to press yet. */
export function ComingSoonTile({ emoji, title }: ComingSoonTileProps) {
  return (
    <div className="flex min-h-[150px] flex-col items-start justify-between gap-3 rounded-card border-3 border-dashed border-white/50 bg-white/10 p-5 text-white">
      <span className="text-[40px] leading-none opacity-80" aria-hidden="true">
        {emoji}
      </span>
      <span>
        <span className="block font-display text-[22px] font-extrabold leading-none">{title}</span>
        <span className="mt-1 block text-[13px] font-extrabold uppercase tracking-[0.1em] text-white/70">Coming soon</span>
      </span>
    </div>
  );
}
