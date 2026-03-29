import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { caseTimeline, kpiData, recentAlerts } from "../data/mockData";

// ─────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────
const tickerItems = [
  {
    from: "SBI-8821",
    amount: "₹1,21,000",
    to: "HDFC-3341",
    tag: "Suspicious",
    debit: true,
  },
  {
    from: "ICICI-6612",
    amount: "₹9,800",
    to: "PNB-5572",
    tag: "Structuring",
    debit: true,
  },
  {
    from: "Kotak-7782",
    amount: "₹37,000",
    to: "Canara-9921",
    tag: "Cleared",
    debit: false,
  },
  {
    from: "Axis-0091",
    amount: "₹31,000",
    to: "SBI-8821",
    tag: "Round-Trip",
    debit: true,
  },
  {
    from: "BOI-1190",
    amount: "₹18,000",
    to: "Canara-9921",
    tag: "Normal",
    debit: false,
  },
  {
    from: "HDFC-3341",
    amount: "₹72,500",
    to: "Kotak-7782",
    tag: "Round-Trip",
    debit: true,
  },
  {
    from: "UCO-4410",
    amount: "₹10,000",
    to: "BOB-2234",
    tag: "Cleared",
    debit: false,
  },
  {
    from: "BOB-2234",
    amount: "₹7,000",
    to: "Canara-9921",
    tag: "Normal",
    debit: false,
  },
];

const tickerItemsDouble = [
  ...tickerItems.map((t, i) => ({ ...t, key: `a${i}` })),
  ...tickerItems.map((t, i) => ({ ...t, key: `b${i}` })),
];

const bankRisks = [
  {
    bank: "SBI",
    score: 94,
    level: "critical",
    bars: [40, 60, 80, 70, 90, 85, 94],
  },
  {
    bank: "HDFC",
    score: 78,
    level: "high",
    bars: [30, 45, 60, 55, 70, 75, 78],
  },
  {
    bank: "ICICI",
    score: 72,
    level: "high",
    bars: [20, 35, 50, 48, 60, 65, 72],
  },
  {
    bank: "Axis",
    score: 55,
    level: "medium",
    bars: [10, 20, 30, 40, 45, 50, 55],
  },
  {
    bank: "Canara",
    score: 61,
    level: "medium",
    bars: [25, 30, 40, 55, 58, 60, 61],
  },
  { bank: "PNB", score: 38, level: "low", bars: [15, 20, 28, 32, 35, 37, 38] },
  { bank: "BOI", score: 44, level: "low", bars: [20, 22, 30, 36, 40, 42, 44] },
  { bank: "BOB", score: 29, level: "low", bars: [5, 10, 15, 20, 22, 26, 29] },
  { bank: "UCO", score: 18, level: "low", bars: [5, 8, 10, 12, 14, 16, 18] },
  {
    bank: "Kotak",
    score: 67,
    level: "medium",
    bars: [20, 30, 40, 50, 58, 63, 67],
  },
];

const sparklineData = [
  { day: "Mon", v: 62 },
  { day: "Tue", v: 74 },
  { day: "Wed", v: 58 },
  { day: "Thu", v: 88 },
  { day: "Fri", v: 72 },
  { day: "Sat", v: 95 },
  { day: "Sun", v: 110 },
];

const riskPalette: Record<
  string,
  { bg: string; text: string; bar: string; border: string }
> = {
  critical: {
    bg: "#FEF2F2",
    text: "#DC2626",
    bar: "#EF4444",
    border: "#FECACA",
  },
  high: { bg: "#FFF7ED", text: "#C2410C", bar: "#F97316", border: "#FED7AA" },
  medium: { bg: "#FEFCE8", text: "#A16207", bar: "#EAB308", border: "#FEF08A" },
  low: { bg: "#F0FDF4", text: "#15803D", bar: "#22C55E", border: "#BBF7D0" },
};

const severityBorder: Record<string, string> = {
  Critical: "border-red-400",
  High: "border-orange-400",
  Medium: "border-yellow-400",
  Low: "border-green-400",
};

const eventTypeColor: Record<string, string> = {
  alert: "bg-red-400",
  info: "bg-blue-400",
  action: "bg-purple-400",
  note: "bg-amber-400",
};

const eventTypeIcon: Record<string, string> = {
  alert: "🚨",
  info: "ℹ️",
  action: "⚡",
  note: "📝",
};

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function PulseGauge({ animated }: { animated: boolean }) {
  const cx = 140;
  const cy = 150;
  const r = 110;
  const sweep = 270;
  const startAngle = 135;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPath = (pct: number) => {
    const angle = startAngle + sweep * pct;
    const x = cx + r * Math.cos(toRad(angle));
    const y = cy + r * Math.sin(toRad(angle));
    const largeArc = sweep * pct > 180 ? 1 : 0;
    const sx = cx + r * Math.cos(toRad(startAngle));
    const sy = cy + r * Math.sin(toRad(startAngle));
    return `M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${x} ${y}`;
  };

  const circumference = (2 * Math.PI * r * sweep) / 360;
  const fillPct = 0.73;

  return (
    <svg
      width="280"
      height="280"
      viewBox="0 0 280 280"
      className="overflow-visible"
      role="img"
      aria-label="Financial Pulse Gauge — Today's Transaction Volume"
    >
      <title>Financial Pulse — Today&apos;s Transaction Volume</title>
      <defs>
        <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <filter id="gaugeGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d={arcPath(1)}
        fill="none"
        stroke="#E2E8F0"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d={arcPath(fillPct)}
        fill="none"
        stroke="url(#gaugeGrad)"
        strokeWidth="14"
        strokeLinecap="round"
        filter="url(#gaugeGlow)"
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: animated ? 0 : circumference,
          transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      />

      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        fontSize="32"
        fontWeight="900"
        fill="#1E293B"
        fontFamily="Plus Jakarta Sans, sans-serif"
      >
        ₹4.2Cr
      </text>
      <text
        x={cx}
        y={cy + 16}
        textAnchor="middle"
        fontSize="11"
        fill="#94A3B8"
        fontFamily="Plus Jakarta Sans, sans-serif"
        fontWeight="500"
      >
        TODAY&apos;S VOLUME
      </text>
      <text
        x={cx}
        y={cy + 34}
        textAnchor="middle"
        fontSize="11"
        fill="#3B82F6"
        fontFamily="Plus Jakarta Sans, sans-serif"
        fontWeight="600"
      >
        73% of daily target
      </text>

      <g transform="translate(117, 18)">
        <rect
          x="0"
          y="0"
          width="50"
          height="30"
          rx="15"
          fill="#EEF2FF"
          stroke="#C7D2FE"
          strokeWidth="1"
        />
        <text
          x="25"
          y="12"
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill="#4338CA"
          fontFamily="Plus Jakarta Sans, sans-serif"
        >
          4,233
        </text>
        <text
          x="25"
          y="24"
          textAnchor="middle"
          fontSize="7"
          fill="#6366F1"
          fontFamily="Plus Jakarta Sans, sans-serif"
        >
          txns
        </text>
      </g>
      <g transform="translate(14, 195)">
        <rect
          x="0"
          y="0"
          width="58"
          height="30"
          rx="15"
          fill="#FFF7ED"
          stroke="#FED7AA"
          strokeWidth="1"
        />
        <text
          x="29"
          y="12"
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill="#C2410C"
          fontFamily="Plus Jakarta Sans, sans-serif"
        >
          ₹29.8L
        </text>
        <text
          x="29"
          y="24"
          textAnchor="middle"
          fontSize="7"
          fill="#F97316"
          fontFamily="Plus Jakarta Sans, sans-serif"
        >
          at risk
        </text>
      </g>
      <g transform="translate(202, 195)">
        <rect
          x="0"
          y="0"
          width="56"
          height="30"
          rx="15"
          fill="#F0FDF4"
          stroke="#BBF7D0"
          strokeWidth="1"
        />
        <text
          x="28"
          y="12"
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill="#15803D"
          fontFamily="Plus Jakarta Sans, sans-serif"
        >
          12 cases
        </text>
        <text
          x="28"
          y="24"
          textAnchor="middle"
          fontSize="7"
          fill="#22C55E"
          fontFamily="Plus Jakarta Sans, sans-serif"
        >
          active
        </text>
      </g>
    </svg>
  );
}

function AreaSparkline() {
  const w = 340;
  const h = 60;
  const max = Math.max(...sparklineData.map((d) => d.v));
  const pts = sparklineData.map((d, i) => ({
    x: (i / (sparklineData.length - 1)) * w,
    y: h - (d.v / max) * (h - 8) - 4,
    day: d.day,
  }));
  const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `0,${h} ${polyline} ${w},${h}`;
  return (
    <div className="mt-4">
      <p className="text-[10px] font-semibold text-slate-400 mb-1 tracking-wide uppercase">
        7-Day Transaction Volume
      </p>
      <svg
        width="100%"
        viewBox={`0 0 ${w} ${h + 16}`}
        role="img"
        aria-label="7-day transaction volume sparkline"
      >
        <title>7-Day Transaction Volume</title>
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#sparkGrad)" />
        <polyline
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polyline}
        />
        {pts.map((p) => (
          <g key={p.day}>
            <circle cx={p.x} cy={p.y} r="3" fill="#3B82F6" />
            <text
              x={p.x}
              y={h + 14}
              textAnchor="middle"
              fontSize="8"
              fill="#94A3B8"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              {p.day}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function HealthGauge({
  label,
  value,
  color,
  trackColor,
  size = 100,
}: {
  label: string;
  value: number;
  color: string;
  trackColor: string;
  size?: number;
}) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const sweep = 270;
  const arcLen = (circ * sweep) / 360;
  const filled = (value / 100) * arcLen;
  const offset = circ * 0.25;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={`${label}: ${value}%`}
        >
          <title>{`${label}: ${value}%`}</title>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={trackColor}
            strokeWidth="8"
            strokeDasharray={`${arcLen} ${circ - arcLen}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${filled} ${circ - filled}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-black" style={{ color }}>
            {value}%
          </span>
        </div>
      </div>
      <span className="text-[10px] font-medium text-slate-500 text-center leading-tight max-w-[72px]">
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────
export default function Dashboard() {
  const [gaugeAnimated, setGaugeAnimated] = useState(false);
  const [hoveredBank, setHoveredBank] = useState<string | null>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  void tickerRef;

  useEffect(() => {
    const t = setTimeout(() => setGaugeAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  void kpiData;

  return (
    <div className="p-5 space-y-5 animate-fade-in-up min-h-full">
      {/* ── TRANSACTION TICKER ── */}
      <div
        className="overflow-hidden rounded-xl bg-slate-800 border border-slate-700 shadow-sm"
        style={{ height: "36px" }}
        data-ocid="dashboard.ticker.panel"
      >
        <div
          ref={tickerRef}
          className="flex items-center gap-0 whitespace-nowrap h-full"
          style={{ animation: "ticker-scroll 38s linear infinite" }}
        >
          {tickerItemsDouble.map((item) => (
            <span
              key={item.key}
              className="inline-flex items-center gap-1.5 px-4 text-xs font-mono h-full"
            >
              <span className="text-slate-300 font-semibold">{item.from}</span>
              <span className="text-slate-500">→</span>
              <span
                className={
                  item.debit
                    ? "text-red-400 font-bold"
                    : "text-emerald-400 font-bold"
                }
              >
                {item.amount}
              </span>
              <span className="text-slate-500">→</span>
              <span className="text-slate-300">{item.to}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  item.tag === "Suspicious" || item.tag === "Round-Trip"
                    ? "bg-red-900/60 text-red-300"
                    : item.tag === "Structuring"
                      ? "bg-orange-900/60 text-orange-300"
                      : "bg-emerald-900/60 text-emerald-300"
                }`}
              >
                {item.tag}
              </span>
              <span className="text-slate-600 mx-2">·</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      {/* ── HERO SECTION ── */}
      <div className="grid grid-cols-5 gap-4" data-ocid="dashboard.hero.panel">
        <div className="col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-black text-gray-900 tracking-tight">
                Financial Pulse
              </h2>
              <p className="text-xs text-slate-400">
                Live transaction monitor · March 29, 2026
              </p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 rounded-full px-3 py-1 border border-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <span className="text-[11px] text-emerald-700 font-bold">
                Live
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <PulseGauge animated={gaugeAnimated} />
            <div className="w-full max-w-sm">
              <AreaSparkline />
            </div>
          </div>
        </div>

        <div
          className="col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col"
          data-ocid="dashboard.feed.panel"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-sm font-black text-gray-900">Live Pulse</h2>
          </div>
          <div className="flex-1 space-y-2 overflow-hidden">
            {recentAlerts.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                className={`flex items-start gap-2.5 p-2.5 rounded-xl border-l-[3px] ${
                  severityBorder[alert.severity]
                } bg-slate-50/70 hover:bg-slate-100/80 hover:shadow-sm hover:translate-x-0.5 transition-all duration-200 cursor-pointer group`}
                data-ocid={`dashboard.feed.item.${i + 1}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[11px] font-bold text-gray-800 truncate">
                      {alert.type}
                    </span>
                    <Badge
                      className={`text-[9px] px-1.5 py-0 h-4 border flex-shrink-0 ${
                        alert.severity === "Critical"
                          ? "bg-red-50 text-red-600 border-red-200"
                          : alert.severity === "High"
                            ? "bg-orange-50 text-orange-600 border-orange-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight truncate">
                    {alert.account} · {alert.amount}
                  </p>
                </div>
                <span className="text-[9px] text-slate-400 flex-shrink-0 mt-0.5">
                  {alert.time}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-blue-600 hover:bg-blue-50 justify-center"
              data-ocid="dashboard.feed.view_all.button"
            >
              View all alerts →
            </Button>
          </div>
        </div>
      </div>

      {/* ── RISK HEATMAP ── */}
      <div
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"
        data-ocid="dashboard.heatmap.panel"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-black text-gray-900">
              Risk Distribution by Bank
            </h2>
            <p className="text-xs text-slate-400">
              Real-time risk scores · 10 monitored institutions
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-semibold">
            {(["critical", "high", "medium", "low"] as const).map((lvl) => (
              <span key={lvl} className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ background: riskPalette[lvl].bar }}
                />
                <span className="capitalize">{lvl}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-10 gap-2">
          {bankRisks.map((bank) => {
            const pal = riskPalette[bank.level];
            const isHovered = hoveredBank === bank.bank;
            return (
              <div
                key={bank.bank}
                className="relative flex flex-col gap-1.5 p-2.5 rounded-xl border cursor-pointer transition-all duration-200"
                style={{
                  background: pal.bg,
                  borderColor: isHovered ? pal.bar : pal.border,
                  transform: isHovered
                    ? "scale(1.06) translateY(-2px)"
                    : "scale(1)",
                  boxShadow: isHovered ? `0 8px 20px ${pal.bar}30` : "none",
                }}
                onMouseEnter={() => setHoveredBank(bank.bank)}
                onMouseLeave={() => setHoveredBank(null)}
                data-ocid={`dashboard.heatmap.bank.${bank.bank.toLowerCase()}`}
              >
                <span
                  className="text-[11px] font-black"
                  style={{ color: pal.text }}
                >
                  {bank.bank}
                </span>
                <div className="flex items-end gap-px h-8">
                  {bank.bars.map((b, bi) => (
                    <div
                      key={`${bank.bank}-bar-${bi}`}
                      className="flex-1 rounded-t-sm transition-all duration-300"
                      style={{
                        height: `${b}%`,
                        background: pal.bar,
                        opacity:
                          bi === bank.bars.length - 1
                            ? 1
                            : 0.4 + (bi / bank.bars.length) * 0.6,
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: pal.text }}
                  >
                    {bank.score}
                  </span>
                  <span className="text-[8px]" style={{ color: pal.bar }}>
                    ▲
                  </span>
                </div>
                {isHovered && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 bg-slate-800 text-white text-[10px] rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-xl pointer-events-none">
                    <div className="font-bold">{bank.bank} Bank</div>
                    <div>
                      Risk Score:{" "}
                      <span style={{ color: pal.bar }}>{bank.score}/100</span>
                    </div>
                    <div className="capitalize">{bank.level} Risk</div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BOTTOM SPLIT ── */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"
          data-ocid="dashboard.timeline.panel"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-gray-900">
              Investigation Timeline
            </h2>
            <Badge className="bg-blue-50 text-blue-700 border-blue-100 text-[10px]">
              CASE-2024-001
            </Badge>
          </div>
          <div className="relative">
            <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-slate-100" />
            <div className="space-y-4">
              {caseTimeline.map((item, i) => (
                <motion.div
                  key={item.time}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  className="flex gap-3 items-start relative cursor-pointer group"
                  data-ocid={`dashboard.timeline.item.${i + 1}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-[12px] ${eventTypeColor[item.type]} shadow-sm group-hover:scale-110 transition-transform duration-200`}
                  >
                    {eventTypeIcon[item.type]}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-xs font-semibold text-gray-800 leading-tight group-hover:text-blue-700 transition-colors">
                      {item.event}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {item.time}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"
          data-ocid="dashboard.health.section"
        >
          <div className="mb-4">
            <h2 className="text-sm font-black text-gray-900">System Health</h2>
            <p className="text-xs text-slate-400">
              AI model performance metrics
            </p>
          </div>
          <div className="flex items-center justify-around py-2">
            <HealthGauge
              label="Detection Rate"
              value={94}
              color="#3B82F6"
              trackColor="#DBEAFE"
              size={110}
            />
            <HealthGauge
              label="Auto-blocked"
              value={78}
              color="#8B5CF6"
              trackColor="#EDE9FE"
              size={110}
            />
            <HealthGauge
              label="False Positive"
              value={6}
              color="#10B981"
              trackColor="#D1FAE5"
              size={110}
            />
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Model accuracy</span>
              <span className="font-bold text-blue-700">94.2%</span>
            </div>
            <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                style={{ width: "94.2%" }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Cases resolved today</span>
              <span className="font-bold text-emerald-600">8 / 12</span>
            </div>
            <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                style={{ width: "67%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
