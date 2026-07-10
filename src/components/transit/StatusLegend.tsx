import type { StationStatus } from "@/lib/transit/types";
import { statusColorVar } from "@/lib/transit/types";

/**
 * StatusLegend — the closed three-status vocabulary (doc 02): color + word,
 * never color alone. System voice.
 */
const LEGEND: { status: StationStatus; word: string }[] = [
  { status: "visited", word: "Visited" },
  { status: "progress", word: "In progress" },
  { status: "planning", word: "Planning" },
];

export default function StatusLegend({ className }: { className?: string }) {
  return (
    <ul
      className={["flex flex-wrap gap-x-6 gap-y-2", className]
        .filter(Boolean)
        .join(" ")}
      aria-label="Status legend"
    >
      {LEGEND.map((item) => (
        <li key={item.status} className="jccl-telemetry flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: statusColorVar(item.status) }}
          />
          {item.word.toUpperCase()}
        </li>
      ))}
    </ul>
  );
}
