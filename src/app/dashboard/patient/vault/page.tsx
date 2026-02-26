"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { vaultRecords, VAULT_TAGS, type VaultTag } from "@/lib/data";
import {
    FolderLock, Upload, Shield, Link, FileText, Image,
    Activity, Lock, Eye, MoreVertical, CheckCircle2,
    Clock, Plus, Search, X, Tag, Cpu
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
    "file-text": FileText,
    "image": Image,
    "activity": Activity,
};

// Tag colour map — cycles through a palette
const TAG_COLORS: Record<string, string> = {
    "X-Ray": "bg-blue-400/15 text-blue-400 border-blue-400/25",
    "MRI": "bg-purple-400/15 text-purple-400 border-purple-400/25",
    "CT Scan": "bg-indigo-400/15 text-indigo-400 border-indigo-400/25",
    "Ultrasound": "bg-cyan-400/15 text-cyan-400 border-cyan-400/25",
    "Lab Report": "bg-teal-400/15 text-teal-400 border-teal-400/25",
    "Blood Test": "bg-red-400/15 text-red-400 border-red-400/25",
    "Urine Test": "bg-yellow-400/15 text-yellow-400 border-yellow-400/25",
    "Prescription": "bg-emerald-400/15 text-emerald-400 border-emerald-400/25",
    "Discharge Summary": "bg-orange-400/15 text-orange-400 border-orange-400/25",
    "ECG": "bg-pink-400/15 text-pink-400 border-pink-400/25",
    "Cardiology": "bg-rose-400/15 text-rose-400 border-rose-400/25",
    "Neurology": "bg-violet-400/15 text-violet-400 border-violet-400/25",
    "Vaccination": "bg-green-400/15 text-green-400 border-green-400/25",
    "Insurance": "bg-amber-400/15 text-amber-400 border-amber-400/25",
    "Other": "bg-slate-400/15 text-slate-400 border-slate-400/25",
};

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemAnim = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

function TagChip({ tag, onRemove, onClick, active }: {
    tag: VaultTag; onRemove?: () => void; onClick?: () => void; active?: boolean;
}) {
    const cls = TAG_COLORS[tag] ?? "bg-slate-400/15 text-slate-400 border-slate-400/25";
    return (
        <span
            onClick={onClick}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border transition-all cursor-pointer select-none
                ${cls} ${active ? "ring-2 ring-offset-1 ring-current ring-offset-transparent" : ""}
                ${onClick ? "hover:opacity-80" : ""}`}
        >
            {tag}
            {onRemove && (
                <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="ml-0.5 hover:opacity-70">
                    <X className="w-2.5 h-2.5" />
                </button>
            )}
        </span>
    );
}

export default function VaultPage() {
    const [dragOver, setDragOver] = useState(false);
    const [search, setSearch] = useState("");
    const [uploading, setUploading] = useState(false);
    const [activeTags, setActiveTags] = useState<VaultTag[]>([]);
    const [showTagPicker, setShowTagPicker] = useState<string | null>(null); // record id

    // Local tag overrides (in real app this goes to DB)
    const [localTags, setLocalTags] = useState<Record<string, VaultTag[]>>({});

    const getRecordTags = (id: string, baseTags: VaultTag[]) =>
        localTags[id] ?? baseTags;

    function addTag(recId: string, tag: VaultTag) {
        const cur = getRecordTags(recId, vaultRecords.find(r => r.id === recId)?.tags ?? []);
        if (cur.includes(tag)) return;
        setLocalTags(prev => ({ ...prev, [recId]: [...cur, tag] }));
    }

    function removeTag(recId: string, tag: VaultTag) {
        const cur = getRecordTags(recId, vaultRecords.find(r => r.id === recId)?.tags ?? []);
        setLocalTags(prev => ({ ...prev, [recId]: cur.filter(t => t !== tag) }));
    }

    function toggleFilterTag(tag: VaultTag) {
        setActiveTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    }

    const filtered = vaultRecords.filter(r => {
        const tags = getRecordTags(r.id, r.tags);
        const matchSearch =
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.type.toLowerCase().includes(search.toLowerCase()) ||
            tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
        const matchTags = activeTags.length === 0 || activeTags.every(t => tags.includes(t));
        return matchSearch && matchTags;
    });

    const simulateUpload = async () => {
        setUploading(true);
        await new Promise(r => setTimeout(r, 2500));
        setUploading(false);
    };

    // All tags present across all records
    const allUsedTags = Array.from(new Set(
        vaultRecords.flatMap(r => getRecordTags(r.id, r.tags))
    )) as VaultTag[];

    return (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 max-w-7xl mx-auto">

            {/* Header */}
            <motion.div variants={itemAnim} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold dark:text-white text-slate-900 flex items-center gap-2">
                        <FolderLock className="w-6 h-6 text-teal-400" />
                        The Vault
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Your encrypted medical records stored on IPFS</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 glass-card rounded-xl text-xs">
                        <Shield className="w-3.5 h-3.5 text-teal-400" />
                        <span className="text-slate-400">{vaultRecords.filter(r => r.verified).length} Blockchain Verified</span>
                    </div>
                    <button className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
                        <Plus className="w-4 h-4" />Upload
                    </button>
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemAnim} className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Records", value: vaultRecords.length, icon: FileText, color: "text-teal-400", bg: "bg-teal-500/10" },
                    { label: "IPFS Pinned", value: vaultRecords.filter(r => r.verified).length, icon: Link, color: "text-blue-400", bg: "bg-blue-500/10" },
                    { label: "Shared With Doctors", value: "2", icon: Eye, color: "text-purple-400", bg: "bg-purple-500/10" },
                ].map((s, i) => {
                    const Icon = s.icon; return (
                        <div key={i} className="glass-card p-4 rounded-2xl flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                                <Icon className={`w-5 h-5 ${s.color}`} />
                            </div>
                            <div>
                                <div className="text-xl font-bold dark:text-white text-slate-900">{s.value}</div>
                                <div className="text-xs text-slate-500">{s.label}</div>
                            </div>
                        </div>
                    );
                })}
            </motion.div>

            {/* Upload Zone */}
            <motion.div
                variants={itemAnim}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); simulateUpload(); }}
                className={`glass-card rounded-2xl p-8 border-2 border-dashed transition-all duration-300 text-center cursor-pointer ${dragOver ? "border-teal-400 bg-teal-500/10" : "border-white/10 hover:border-teal-500/40"
                    }`}
                onClick={simulateUpload}
            >
                {uploading ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-center gap-3">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-8 h-8 border-2 border-teal-500/30 border-t-teal-400 rounded-full"
                            />
                            <span className="text-teal-400 font-medium">Encrypting & uploading to IPFS...</span>
                        </div>
                        <div className="progress-bar max-w-xs mx-auto">
                            <motion.div className="progress-fill" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2.5, ease: "linear" }} />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-14 h-14 rounded-2xl bg-teal-500/15 flex items-center justify-center mx-auto mb-4">
                            <Upload className="w-6 h-6 text-teal-400" />
                        </div>
                        <div className="text-base font-semibold dark:text-white text-slate-900">Drop files here or click to upload</div>
                        <p className="text-sm text-slate-500 mt-1">Files are encrypted client-side before leaving your browser</p>
                        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-600">
                            <span>PDF · JPEG · PNG · DICOM · MP4</span>
                            <span>·</span>
                            <span>Max 50 MB</span>
                        </div>
                    </>
                )}
            </motion.div>

            {/* Search + Tag Filters */}
            <motion.div variants={itemAnim} className="glass-card p-4 rounded-2xl space-y-3">
                {/* Search bar */}
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by name, type or tag..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="glass-input pl-9 w-full"
                        />
                    </div>
                    {activeTags.length > 0 && (
                        <button
                            onClick={() => setActiveTags([])}
                            className="btn-ghost text-xs flex items-center gap-1.5 px-3"
                        >
                            <X className="w-3.5 h-3.5" /> Clear filters
                        </button>
                    )}
                </div>

                {/* Tag filter pills */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <Tag className="w-3 h-3" /> Filter by tag:
                    </span>
                    {allUsedTags.map(tag => (
                        <TagChip
                            key={tag}
                            tag={tag}
                            onClick={() => toggleFilterTag(tag)}
                            active={activeTags.includes(tag)}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Records */}
            <motion.div variants={stagger} className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {filtered.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 text-slate-500"
                        >
                            <FolderLock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p>No records match your filters</p>
                        </motion.div>
                    ) : filtered.map((rec) => {
                        const Icon = iconMap[rec.icon] || FileText;
                        const tags = getRecordTags(rec.id, rec.tags);
                        const isPickerOpen = showTagPicker === rec.id;

                        return (
                            <motion.div
                                key={rec.id}
                                variants={itemAnim}
                                layout
                                className="glass-card glass-card-hover p-4 rounded-2xl"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-5 h-5 text-teal-400" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-sm dark:text-white text-slate-900 truncate">{rec.name}</span>
                                            {rec.verified && (
                                                <div className="blockchain-badge flex-shrink-0">
                                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                                    Verified
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                            <span>{rec.type}</span>
                                            <span>·</span>
                                            <span>{rec.date}</span>
                                            <span>·</span>
                                            <span>{rec.size}</span>
                                        </div>

                                        {/* Tags row */}
                                        <div className="flex items-center gap-1.5 flex-wrap mt-2">
                                            {tags.map(tag => (
                                                <TagChip
                                                    key={tag}
                                                    tag={tag}
                                                    onRemove={() => removeTag(rec.id, tag)}
                                                />
                                            ))}
                                            <button
                                                onClick={() => setShowTagPicker(isPickerOpen ? null : rec.id)}
                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border border-dashed border-slate-500/40 text-slate-500 hover:border-teal-400/50 hover:text-teal-400 transition-colors"
                                            >
                                                <Plus className="w-2.5 h-2.5" /> Add tag
                                            </button>
                                        </div>

                                        {/* Tag picker dropdown */}
                                        <AnimatePresence>
                                            {isPickerOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -6, height: 0 }}
                                                    animate={{ opacity: 1, y: 0, height: "auto" }}
                                                    exit={{ opacity: 0, y: -6, height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="flex flex-wrap gap-1.5 mt-2 p-3 rounded-xl inner-card">
                                                        <span className="w-full text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Pick tags</span>
                                                        {VAULT_TAGS.map(tag => {
                                                            const already = tags.includes(tag);
                                                            return (
                                                                <button
                                                                    key={tag}
                                                                    onClick={() => already ? removeTag(rec.id, tag) : addTag(rec.id, tag)}
                                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border transition-all
                                                                        ${TAG_COLORS[tag] ?? "bg-slate-400/15 text-slate-400 border-slate-400/25"}
                                                                        ${already ? "opacity-40" : "hover:opacity-80"}`}
                                                                >
                                                                    {already && <X className="w-2.5 h-2.5" />}
                                                                    {tag}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {rec.cid && (
                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                <Link className="w-3 h-3 text-slate-600" />
                                                <span className="text-[10px] font-mono text-slate-600 truncate max-w-xs">
                                                    {rec.cid.slice(0, 30)}...
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right side */}
                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                        {rec.sharedWith.length > 0 ? (
                                            <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                                <Eye className="w-3 h-3" />
                                                Shared with {rec.sharedWith.length} doctor{rec.sharedWith.length > 1 ? "s" : ""}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-[10px] text-slate-600">
                                                <Lock className="w-3 h-3" />
                                                Private
                                            </div>
                                        )}
                                        <div className="flex gap-1.5">
                                            <button className="w-7 h-7 glass-card rounded-lg flex items-center justify-center hover:border-teal-500/30 transition-colors">
                                                <Eye className="w-3 h-3 text-slate-400" />
                                            </button>
                                            <button className="w-7 h-7 glass-card rounded-lg flex items-center justify-center hover:border-teal-500/30 transition-colors">
                                                <Cpu className="w-3 h-3 text-slate-400" />
                                            </button>
                                            <button className="w-7 h-7 glass-card rounded-lg flex items-center justify-center hover:border-teal-500/30 transition-colors">
                                                <MoreVertical className="w-3 h-3 text-slate-400" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}
