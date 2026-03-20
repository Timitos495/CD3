"use client";

import { useState, useMemo, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ShotIndex = {
  id: string;
  bean_type: string;
  bean_brand: string;
  grinder_model: string;
  grinder_setting: string;
  bean_weight: string;
  drink_weight: string;
  duration: number;
  profile_title: string;
  start_time: string;
};

export type ShotDetail = ShotIndex & {
  drink_tds: string;
  drink_ey: string;
  espresso_notes: string;
  bean_notes: string;
  data: {
    espresso_pressure: string[];
    espresso_flow: string[];
    espresso_weight: string[];
    espresso_pressure_goal: string[];
    espresso_flow_goal: string[];
  };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseArr(arr: any[]): number[] {
  return (arr ?? []).map((v) => parseFloat(v)).filter((v) => !isNaN(v));
}

const ITEMS_PER_PAGE = 50;

// ─── MiniSparkline ────────────────────────────────────────────────────────────

function MiniSparkline({ shot }: { shot: ShotIndex }) {
  const data = (shot as any).data;
  const pressure = parseArr(data?.espresso_pressure);
  const flow     = parseArr(data?.espresso_flow);
  const weight   = parseArr(data?.espresso_weight);

  if (!pressure.length && !flow.length) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-slate-300 text-[9px] italic">no data</span>
      </div>
    );
  }

  const maxLen      = Math.max(pressure.length, flow.length, weight.length);
  const pressureMax = 12;
  const flowMax     = Math.max(...flow, 6);
  const weightMax   = Math.max(...weight, 1);

  const toPath = (arr: number[], max: number) => {
    if (!arr.length) return "";
    return arr.map((v, i) => {
      const x = (i / (maxLen - 1)) * 100;
      const y = 30 - (v / max) * 28;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(" ");
  };

  return (
    <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1="0" y1={30 - t * 28} x2="100" y2={30 - t * 28}
          stroke="#e2e8f0" strokeWidth="0.4" />
      ))}
      {weight.length > 0 && (
        <path d={toPath(weight, weightMax)} fill="none" stroke="#f59e0b" strokeWidth="0.5" opacity="0.8" />
      )}
      {flow.length > 0 && (
        <path d={toPath(flow, flowMax)} fill="none" stroke="#10b981" strokeWidth="0.6" />
      )}
      {pressure.length > 0 && (
        <path d={toPath(pressure, pressureMax)} fill="none" stroke="#3b82f6" strokeWidth="0.6" />
      )}
    </svg>
  );
}

// ─── DetailGraph ──────────────────────────────────────────────────────────────

function DetailGraph({ shot }: { shot: ShotDetail }) {
  const pressure     = parseArr(shot.data?.espresso_pressure);
  const flow         = parseArr(shot.data?.espresso_flow);
  const weight       = parseArr(shot.data?.espresso_weight);
  const pressureGoal = parseArr(shot.data?.espresso_pressure_goal);
  const flowGoal     = parseArr(shot.data?.espresso_flow_goal);

  if (!pressure.length && !flow.length) {
    return (
      <div className="h-48 bg-slate-50 rounded border border-slate-100 flex items-center justify-center text-slate-300 text-xs italic">
        No graph data available
      </div>
    );
  }

  const maxLen      = Math.max(pressure.length, flow.length, weight.length);
  const pressureMax = 12;
  const flowMax     = Math.max(...flow, ...flowGoal, 0.1);
  const weightMax   = Math.max(...weight, 0.1);

  const toPath = (arr: number[], viewH: number, globalMax: number) => {
    if (!arr.length) return "";
    return arr.map((v, i) => {
      const x = (i / (maxLen - 1)) * 200;
      const y = viewH - (v / globalMax) * (viewH - 2);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ");
  };

  return (
    <div className="bg-slate-50 rounded border border-slate-100 p-3">
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-bold mb-2">
        <span className="text-blue-500">— Pressure</span>
        <span className="text-blue-300">-- Goal</span>
        <span className="text-emerald-500">— Flow</span>
        <span className="text-emerald-300">-- Goal</span>
        {weight.length > 0 && <span className="text-amber-500">— Weight</span>}
      </div>
      <svg viewBox="0 0 200 60" className="w-full" preserveAspectRatio="none" style={{ height: "140px" }}>
        {[0.25, 0.5, 0.75].map((t) => (
          <line key={t} x1="0" y1={60 - t * 58} x2="200" y2={60 - t * 58}
            stroke="#e2e8f0" strokeWidth="0.5" />
        ))}
        {pressureGoal.length > 0 && <path d={toPath(pressureGoal, 60, pressureMax)} fill="none" stroke="#93c5fd" strokeWidth="0.8" strokeDasharray="2,2" />}
        {pressure.length > 0     && <path d={toPath(pressure,     60, pressureMax)} fill="none" stroke="#3b82f6" strokeWidth="1.2" />}
        {flowGoal.length > 0     && <path d={toPath(flowGoal,     60, flowMax)}     fill="none" stroke="#6ee7b7" strokeWidth="0.8" strokeDasharray="2,2" />}
        {flow.length > 0         && <path d={toPath(flow,         60, flowMax)}     fill="none" stroke="#10b981" strokeWidth="1.2" />}
        {weight.length > 0       && <path d={toPath(weight,       60, weightMax)}   fill="none" stroke="#f59e0b" strokeWidth="1.2" />}
      </svg>
    </div>
  );
}

// ─── Combobox ─────────────────────────────────────────────────────────────────

function Combobox({ label, options, value, onChange }: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(value);

  const filtered = options.filter((o) => o.toLowerCase().includes(input.toLowerCase()));

  return (
    <div className="relative">
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded px-2 py-1.5 text-xs focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-300">
        <span className="text-slate-400 font-semibold uppercase italic shrink-0">{label}</span>
        <input
          className="outline-none text-slate-700 w-28 bg-transparent"
          placeholder="All"
          value={input}
          onChange={(e) => { setInput(e.target.value); onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        {input && (
          <button className="text-slate-300 hover:text-slate-500 ml-1"
            onClick={() => { setInput(""); onChange(""); }}>✕</button>
        )}
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded shadow-lg z-50 max-h-48 overflow-y-auto min-w-[180px]">
          {filtered.map((o) => (
            <div key={o}
              className="px-3 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
              onMouseDown={() => { setInput(o); onChange(o); setOpen(false); }}>
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ShotDashboard ────────────────────────────────────────────────────────────

export default function ShotDashboard() {
  const [index, setIndex]                 = useState<ShotIndex[]>([]);
  const [indexLoading, setIndexLoading]   = useState(true);
  const [selected, setSelected]           = useState<ShotDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [page, setPage]                   = useState(1);
  const [beanFilter, setBeanFilter]       = useState("");
  const [roasterFilter, setRoasterFilter] = useState("");
  const [dateFrom, setDateFrom]           = useState("");
  const [dateTo, setDateTo]               = useState("");

  useEffect(() => {
    setIndexLoading(true);
    fetch("/api/index")
      .then((r) => r.json())
      .then((data) => {
        setIndex(data.shots ?? []);
        setIndexLoading(false);
      })
      .catch((err) => {
        console.error("Index fetch failed:", err);
        setIndexLoading(false);
      });
  }, []);

  const handleSelect = async (shot: ShotIndex) => {
    setSelected(null);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/shot?id=${shot.id}`);
      const full = await res.json();
      setSelected(full);
    } catch (err) {
      console.error("Detail fetch failed:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const hasFilters = beanFilter || roasterFilter || dateFrom || dateTo;

  const beanOptions = useMemo(() =>
    Array.from(new Set(index.map((s) => s.bean_type).filter(Boolean))).sort(),
    [index]
  );

  const roasterOptions = useMemo(() =>
    Array.from(new Set(index.map((s) => s.bean_brand).filter(Boolean))).sort(),
    [index]
  );

  const filtered = useMemo(() => index.filter((shot) => {
    if (beanFilter && !shot.bean_type?.toLowerCase().includes(beanFilter.toLowerCase())) return false;
    if (roasterFilter && !shot.bean_brand?.toLowerCase().includes(roasterFilter.toLowerCase())) return false;
    if (dateFrom && new Date(shot.start_time) < new Date(dateFrom)) return false;
    if (dateTo && new Date(shot.start_time) > new Date(dateTo + "T23:59:59")) return false;
    return true;
  }), [index, beanFilter, roasterFilter, dateFrom, dateTo]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleBeanFilter    = (v: string) => { setBeanFilter(v);    setPage(1); };
  const handleRoasterFilter = (v: string) => { setRoasterFilter(v); setPage(1); };
  const handleDateFrom      = (v: string) => { setDateFrom(v);      setPage(1); };
  const handleDateTo        = (v: string) => { setDateTo(v);        setPage(1); };
  const clearFilters        = () => { setBeanFilter(""); setRoasterFilter(""); setDateFrom(""); setDateTo(""); setPage(1); };

  const s            = selected;
  const beanName     = s?.bean_type      || "—";
  const roaster      = s?.bean_brand     || "—";
  const grinder      = s?.grinder_model  || "—";
  const grindSetting = s?.grinder_setting ?? "—";
  const dose         = s?.bean_weight    || "—";
  const yieldG       = s?.drink_weight   || "—";
  const duration     = s?.duration != null ? `${Math.round(s.duration)}s` : "—";
  const tds          = s?.drink_tds      || "—";
  const ey           = s?.drink_ey       || "—";
  const profile      = s?.profile_title  || "—";
  const notes        = s?.espresso_notes || s?.bean_notes || null;

  return (
    <main className="flex h-screen bg-[#f1f3f5] text-[#343a40] font-sans overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <div className="w-3/5 flex flex-col h-full border-r border-slate-200">
        <header className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight">All Shots</h1>
              {indexLoading ? (
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                  LOADING...
                </span>
              ) : (
                <>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {index.length.toLocaleString()} TOTAL
                  </span>
                  {hasFilters && (
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {filtered.length} MATCHING
                    </span>
                  )}
                </>
              )}
            </div>
            {hasFilters && (
              <button onClick={clearFilters}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors">
                ✕ Clear filters
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Combobox label="Bean"    options={beanOptions}    value={beanFilter}    onChange={handleBeanFilter} />
            <Combobox label="Roaster" options={roasterOptions} value={roasterFilter} onChange={handleRoasterFilter} />
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded px-2 py-1.5 text-xs focus-within:border-blue-400">
              <span className="text-slate-400 font-semibold uppercase italic shrink-0">From</span>
              <input type="date" className="outline-none text-slate-700 bg-transparent"
                value={dateFrom} onChange={(e) => handleDateFrom(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded px-2 py-1.5 text-xs focus-within:border-blue-400">
              <span className="text-slate-400 font-semibold uppercase italic shrink-0">To</span>
              <input type="date" className="outline-none text-slate-700 bg-transparent"
                value={dateTo} onChange={(e) => handleDateTo(e.target.value)} />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {indexLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
              <div className="text-sm font-medium">Building shot index...</div>
              <div className="text-xs">This only happens once per hour</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4">
                {paginated.map((shot) => {
                  const isSelected = selected?.id === shot.id;
                  return (
                    <div key={shot.id} onClick={() => handleSelect(shot)}
                      className={`bg-white border rounded-sm cursor-pointer flex flex-col transition-all overflow-hidden ${
                        isSelected
                          ? "border-blue-500 shadow-md ring-1 ring-blue-400"
                          : "border-slate-200 hover:border-blue-400 hover:shadow-md"
                      }`}>
                      <div className="h-20 bg-slate-50 border-b border-slate-100 p-2">
                        <MiniSparkline shot={shot} />
                      </div>
                      <div className="p-3 space-y-2">
                        <div>
                          <h2 className="font-bold text-[12px] leading-tight truncate text-slate-900">
                            {shot.bean_type || "—"}
                          </h2>
                          <p className="text-blue-600 text-[10px] font-bold uppercase tracking-wider truncate">
                            {shot.bean_brand || "—"}
                          </p>
                        </div>
                        <div className="text-[10px] space-y-1 text-slate-500">
                          <div className="flex justify-between border-b border-slate-50 pb-1">
                            <span className="font-semibold text-slate-400 uppercase italic">Specs</span>
                            <span className="text-slate-900 font-medium">
                              {shot.bean_weight || "?"}g → {shot.drink_weight || "?"}g in {shot.duration ? `${Math.round(shot.duration)}s` : "—"}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-slate-50 pb-1">
                            <span className="font-semibold text-slate-400 uppercase italic">Grinder</span>
                            <span className="text-slate-900 truncate ml-2 max-w-[100px]">
                              {shot.grinder_model || "—"}
                              {shot.grinder_setting && (
                                <span className="text-blue-500 font-bold ml-1">@{shot.grinder_setting}</span>
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-slate-50 pb-1">
                            <span className="font-semibold text-slate-400 uppercase italic">Date</span>
                            <span>{new Date(shot.start_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-slate-400 uppercase italic">Profile</span>
                            <span className="truncate ml-2 text-slate-700 italic max-w-[100px]">
                              {shot.profile_title || "Default"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filtered.length === 0 && !indexLoading && (
                <div className="py-20 text-center text-slate-400 text-sm italic">
                  No shots match your filters
                </div>
              )}

              {totalPages > 1 && (
                <div className="py-8 flex items-center justify-center gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                    className="px-3 py-1.5 text-xs border border-slate-200 rounded bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    ← Prev
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let p: number;
                      if (totalPages <= 7)             p = i + 1;
                      else if (page <= 4)              p = i + 1;
                      else if (page >= totalPages - 3) p = totalPages - 6 + i;
                      else                             p = page - 3 + i;
                      return (
                        <button key={p} onClick={() => setPage(p)}
                          className={`w-7 h-7 text-xs rounded transition-colors ${
                            p === page
                              ? "bg-blue-500 text-white font-bold"
                              : "bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600"
                          }`}>{p}</button>
                      );
                    })}
                  </div>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                    className="px-3 py-1.5 text-xs border border-slate-200 rounded bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    Next →
                  </button>
                  <span className="text-xs text-slate-400 ml-2">
                    Page {page} of {totalPages} · {filtered.length.toLocaleString()} shots
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <aside className="w-2/5 bg-white flex flex-col h-full p-6 overflow-y-auto">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 italic">Metadata</h3>
        <h2 className="text-xl font-bold mb-4">Shot Details</h2>

        {detailLoading ? (
          <div className="p-4 bg-slate-50 rounded border border-slate-100 text-center animate-pulse">
            <p className="text-slate-400 text-sm italic">Loading shot data...</p>
          </div>
        ) : !selected ? (
          <div className="p-4 bg-slate-50 rounded border border-dashed border-slate-200 text-center">
            <p className="text-slate-400 text-sm italic">Click a shot to load data...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="font-bold text-sm leading-tight">{beanName}</p>
              <p className="text-blue-600 text-[10px] font-bold uppercase tracking-wider">{roaster}</p>
            </div>
            <DetailGraph shot={selected} />
            {([
              ["Grinder",  grinder],
              ["Grind",    grindSetting !== "—" ? `@${grindSetting}` : "—"],
              ["Dose",     dose   !== "—" ? `${dose}g`   : "—"],
              ["Yield",    yieldG !== "—" ? `${yieldG}g` : "—"],
              ["Duration", duration],
              ["TDS",      tds !== "—" ? `${tds}%` : "—"],
              ["EY",       ey  !== "—" ? `${ey}%`  : "—"],
              ["Profile",  profile],
            ] as [string, string][]).map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-slate-100 pb-2 text-sm">
                <span className="text-slate-400 font-medium">{label}</span>
                <span className="text-slate-700 font-medium text-right max-w-[60%] truncate">{value}</span>
              </div>
            ))}
            {notes && (
              <div className="pt-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Notes</p>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded p-3 border border-slate-100">
                  {notes}
                </p>
              </div>
            )}
          </div>
        )}
      </aside>
    </main>
  );
}
