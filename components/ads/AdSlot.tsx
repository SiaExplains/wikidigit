interface AdSlotProps {
  size: "leaderboard" | "in-feed" | "mid-article" | "sidebar" | "end-of-article";
  position?: string;
  className?: string;
}

const slotDimensions: Record<AdSlotProps["size"], { w: number; h: number; label: string }> = {
  leaderboard: { w: 728, h: 90, label: "Leaderboard (728×90)" },
  "in-feed": { w: 468, h: 60, label: "In-Feed (468×60)" },
  "mid-article": { w: 336, h: 280, label: "Mid-Article (336×280)" },
  sidebar: { w: 300, h: 250, label: "Sidebar (300×250)" },
  "end-of-article": { w: 728, h: 90, label: "End of Article (728×90)" },
};

export default function AdSlot({ size, position, className = "" }: AdSlotProps) {
  const slot = slotDimensions[size];

  return (
    <div
      className={`ad-slot-dev flex items-center justify-center mx-auto my-6 ${className}`}
      style={{ maxWidth: slot.w, height: slot.h }}
      data-ad-size={size}
      data-ad-position={position}
      aria-label="Advertisement"
      role="complementary"
    >
      {/* AD SLOT */}
      <span className="text-xs text-amber/60 font-mono select-none">
        AD · {slot.label}
        {position ? ` · ${position}` : ""}
      </span>
    </div>
  );
}
