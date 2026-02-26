"use client";

import { useState } from "react";
import { adherenceGrid, type AdherenceStatus } from "@/lib/data";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const STATUS_COLOR: Record<AdherenceStatus, string> = {
    perfect: "bg-teal-400",
    partial: "bg-amber-400",
    missed: "bg-red-400",
    empty: "dark:bg-slate-700 bg-slate-200 opacity-40",
};

interface Props {
    /** Number of days from the end of the grid to show. Default = all 365. */
    days?: number;
    compact?: boolean;
}

export default function HealthGrid({ days = 365, compact = false }: Props) {
    const [tooltip, setTooltip] = useState<{ date: string; status: AdherenceStatus } | null>(null);

    const slice = adherenceGrid.slice(-days);

    // Pad the front so the first entry aligns to its correct weekday (Sun=0)
    const firstDow = new Date(slice[0].date).getDay();
    type Cell = (typeof slice)[0] | null;
    const padded: Cell[] = [...Array(firstDow).fill(null), ...slice];

    // Build week columns
    const weeks: Cell[][] = [];
    for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));

    // Build month labels: find the column index where each new month starts
    type MonthLabel = { col: number; label: string };
    const monthLabels: MonthLabel[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
        for (const cell of week) {
            if (!cell) continue;
            const m = new Date(cell.date).getMonth();
            if (m !== lastMonth) {
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
                                    className={`${cellSize} flex-shrink-0 rounded-[2px] cursor-pointer transition-transform hover:scale-125 ${STATUS_COLOR[day.status]}`}
                                    onMouseEnter={() => setTooltip({ date: day.date, status: day.status })}
                                    onMouseLeave={() => setTooltip(null)}
                                    title={`${day.date} · ${day.status}`}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                <span className="text-[10px] text-slate-500">Less</span>
                {(["empty", "partial", "perfect"] as AdherenceStatus[]).map(s => (
                    <div key={s} className={`${cellSize} rounded-[2px] ${STATUS_COLOR[s]}`} />
                ))}
                <span className="text-[10px] text-slate-500">More</span>
                <div className="ml-3 flex gap-3 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-[8px] h-[8px] rounded-[1px] bg-teal-400 inline-block" />Perfect</span>
                    <span className="flex items-center gap-1"><span className="w-[8px] h-[8px] rounded-[1px] bg-amber-400 inline-block" />Partial</span>
                    <span className="flex items-center gap-1"><span className="w-[8px] h-[8px] rounded-[1px] bg-red-400 inline-block" />Missed</span>
                </div>
            </div>

            {tooltip && (
                <div className="mt-1 text-[11px] text-slate-500">
                    {tooltip.date} —{" "}
                    <span className={`font-semibold capitalize ${tooltip.status === "perfect" ? "text-teal-400" :
                            tooltip.status === "partial" ? "text-amber-400" :
                                tooltip.status === "missed" ? "text-red-400" : "text-slate-500"
                        }`}>{tooltip.status}</span>
                </div>
            )}
        </div>
    );
}
