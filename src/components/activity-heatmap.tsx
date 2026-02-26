"use client";

import { useState } from "react";
import { activityCalendar } from "@/lib/data";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// 0 to 4 scale
const INTENSITY_COLOR: Record<number, string> = {
    0: "dark:bg-slate-700 bg-slate-200 opacity-40",
    1: "bg-teal-400/30",
    2: "bg-teal-400/60",
    3: "bg-teal-400/80",
    4: "bg-teal-400",
};

interface Props {
    days?: number;
    compact?: boolean;
}

export default function ActivityHeatmap({ days = 365, compact = false }: Props) {
    const [tooltip, setTooltip] = useState<{ date: string; intensity: number } | null>(null);

    const slice = activityCalendar.slice(-days);

    // Pad the front so the first entry aligns to its correct weekday (Sun=0)
    const firstDow = new Date(slice[0].date).getDay();
    type Cell = (typeof slice)[0] | null;
    const padded: Cell[] = [...Array(firstDow).fill(null), ...slice];

    // Build week columns
    const weeks: Cell[][] = [];
    for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));

    // Build month labels
    type MonthLabel = { col: number; label: string };
    const monthLabels: MonthLabel[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
        for (const cell of week) {
            if (!cell) continue;
            const m = new Date(cell.date).getMonth();
            if (m !== lastMonth) {
                // only add if it's not the very first column, or if it is the first month we encounter
                monthLabels.push({ col: wi, label: MONTH_NAMES[m] });
                lastMonth = m;
            }
            break;
        }
    });

    const cellSize = compact ? "w-[8px] h-[8px]" : "w-[10px] h-[10px]";
    const gap = compact ? "gap-[2px]" : "gap-[3px]";

    return (
        <div className="w-full overflow-x-auto pb-1">
            {/* Month label row */}
            <div className={`flex ${gap} mb-1`} style={{ minWidth: weeks.length * (compact ? 10 : 13) }}>
                {weeks.map((_, wi) => {
                    const lbl = monthLabels.find(m => m.col === wi);
                    return (
                        <div
                            key={wi}
                            className="flex-shrink-0 text-[9px] text-slate-500 font-medium"
                            style={{ width: compact ? 10 : 12, overflow: "visible", whiteSpace: "nowrap" }}
                        >
                            {lbl ? lbl.label : ""}
                        </div>
                    );
                })}
            </div>

            {/* Week columns */}
            <div className={`flex ${gap}`} style={{ minWidth: weeks.length * (compact ? 10 : 13) }}>
                {weeks.map((week, wi) => (
                    <div key={wi} className={`flex flex-col ${gap}`}>
                        {week.map((day, di) => {
                            if (!day) return <div key={di} className={`${cellSize} flex-shrink-0`} />;
                            return (
                                <div
                                    key={di}
                                    className={`${cellSize} flex-shrink-0 rounded-[2px] cursor-pointer transition-transform hover:scale-125 ${INTENSITY_COLOR[day.intensity]}`}
                                    onMouseEnter={() => setTooltip({ date: day.date, intensity: day.intensity })}
                                    onMouseLeave={() => setTooltip(null)}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Legend & Tooltip Space */}
            <div className="flex items-center justify-between mt-2.5 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">Less</span>
                    {[0, 1, 2, 3, 4].map(s => (
                        <div key={s} className={`${cellSize} rounded-[2px] ${INTENSITY_COLOR[s]}`} />
                    ))}
                    <span className="text-[10px] text-slate-500">More</span>
                </div>

                <div className="text-[11px] text-slate-500 min-h-[16px]">
                    {tooltip && (
                        <span>
                            {tooltip.date} —{" "}
                            <span className="font-semibold text-teal-400">
                                {tooltip.intensity === 0 ? "No activity" : `${tooltip.intensity} events`}
                            </span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
