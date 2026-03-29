import { Button } from "@/components/ui/button";
import { Download, FileText, TrendingUp } from "lucide-react";
import { useRef, useState } from "react";
import { analyticsData } from "../data/mockData";

function InteractiveLineChart({
  data,
  color,
  label,
}: { data: number[]; color: string; label: string }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 500;
  const h = 120;
  const pad = 10;

  const coords = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: h - pad - ((v - min) / (max - min)) * (h - pad * 2),
  }));
  const points = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const areaPoints = `${coords[0].x},${h} ${points} ${coords[coords.length - 1].x},${h}`;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * w;
    let closest = 0;
    let minD = Number.POSITIVE_INFINITY;
    coords.forEach((c, i) => {
      const d = Math.abs(c.x - mx);
      if (d < minD) {
        minD = d;
        closest = i;
      }
    });
    setHoverIdx(closest);
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      viewBox={`0 0 ${w} ${h + 24}`}
      className="overflow-visible cursor-crosshair"
      aria-label={`${label} trend chart`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverIdx(null)}
    >
      <title>{label} trend</title>
      <defs>
        <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={pad}
          y1={pad + t * (h - pad * 2)}
          x2={w - pad}
          y2={pad + t * (h - pad * 2)}
          stroke="#F1F5F9"
          strokeWidth="1"
        />
      ))}
      <polygon points={areaPoints} fill={`url(#grad-${label})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {coords.map((c, i) => (
        <circle
          key={analyticsData.months[i]}
          cx={c.x}
          cy={c.y}
          r={hoverIdx === i ? 6 : 3}
          fill={hoverIdx === i ? "white" : color}
          stroke={color}
          strokeWidth={hoverIdx === i ? 2.5 : 0}
          style={{ transition: "r 0.15s ease" }}
        />
      ))}
      {hoverIdx !== null && (
        <>
          <line
            x1={coords[hoverIdx].x}
            y1={pad}
            x2={coords[hoverIdx].x}
            y2={h}
            stroke={color}
            strokeWidth="1"
            strokeDasharray="4,3"
            opacity={0.5}
          />
          <rect
            x={coords[hoverIdx].x - 22}
            y={coords[hoverIdx].y - 22}
            width={44}
            height={18}
            rx={5}
            fill={color}
            opacity={0.9}
          />
          <text
            x={coords[hoverIdx].x}
            y={coords[hoverIdx].y - 9}
            textAnchor="middle"
            fontSize="9"
            fill="white"
            fontWeight="700"
          >
            {data[hoverIdx]}
          </text>
        </>
      )}
      {analyticsData.months.map((m, i) => (
        <text
          key={m}
          x={coords[i].x}
          y={h + 16}
          textAnchor="middle"
          fontSize="8"
          fill={hoverIdx === i ? color : "#94A3B8"}
          fontWeight={hoverIdx === i ? "700" : "400"}
        >
          {m}
        </text>
      ))}
    </svg>
  );
}

function InteractiveBarChart({
  data,
  color,
}: { data: number[]; color: string }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const max = Math.max(...data);
  const barW = 30;
  const gap = 12;
  const h = 120;
  const pad = 10;
  return (
    <svg
      width="100%"
      viewBox={`0 0 ${(barW + gap) * data.length} ${h + 24}`}
      aria-label="Transaction volume chart"
    >
      <title>Transaction volume</title>
      {data.map((v, i) => (
        <g
          key={analyticsData.months[i]}
          onMouseEnter={() => setHoverIdx(i)}
          onMouseLeave={() => setHoverIdx(null)}
          style={{ cursor: "pointer" }}
        >
          <rect
            x={i * (barW + gap)}
            y={pad + (1 - v / max) * (h - pad * 2)}
            width={barW}
            height={(v / max) * (h - pad * 2)}
            rx={5}
            fill={hoverIdx === i ? color : `${color}BB`}
            style={{ transition: "fill 0.15s ease" }}
          />
          {hoverIdx === i && (
            <>
              <rect
                x={i * (barW + gap) - 4}
                y={pad + (1 - v / max) * (h - pad * 2) - 22}
                width={barW + 8}
                height={18}
                rx={5}
                fill={color}
              />
              <text
                x={i * (barW + gap) + barW / 2}
                y={pad + (1 - v / max) * (h - pad * 2) - 9}
                textAnchor="middle"
                fontSize="9"
                fill="white"
                fontWeight="700"
              >
                {v}
              </text>
            </>
          )}
          <text
            x={i * (barW + gap) + barW / 2}
            y={h + 16}
            textAnchor="middle"
            fontSize="8"
            fill={hoverIdx === i ? color : "#94A3B8"}
            fontWeight={hoverIdx === i ? "700" : "400"}
          >
            {analyticsData.months[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

const alertDistribution = [
  { type: "Layering", count: 48, pct: 78, color: "#3B82F6" },
  { type: "Round-Tripping", count: 31, pct: 52, color: "#8B5CF6" },
  { type: "Structuring", count: 55, pct: 89, color: "#EF4444" },
  { type: "Cross-Border", count: 23, pct: 38, color: "#F97316" },
  { type: "Profile Mismatch", count: 18, pct: 30, color: "#EAB308" },
];

const scheduledReports = [
  {
    name: "Weekly FIU Summary",
    schedule: "Every Monday 9:00 AM",
    status: "Active",
    last: "2026-03-24",
  },
  {
    name: "Monthly Risk Dashboard",
    schedule: "1st of each month",
    status: "Active",
    last: "2026-03-01",
  },
  {
    name: "Quarterly Audit Report",
    schedule: "Every 3 months",
    status: "Paused",
    last: "2026-01-01",
  },
];

const summaryStats = [
  {
    label: "Total Flagged",
    value: "247",
    change: "+22% YoY",
    color: "text-blue-700",
    gradient: "from-blue-50 to-blue-100",
    icon: "🚨",
  },
  {
    label: "Avg Risk Score",
    value: "68.4",
    change: "+5.2 pts",
    color: "text-purple-700",
    gradient: "from-purple-50 to-purple-100",
    icon: "⚠️",
  },
  {
    label: "Cases Resolved",
    value: "183",
    change: "74% rate",
    color: "text-emerald-700",
    gradient: "from-emerald-50 to-emerald-100",
    icon: "✅",
  },
];

export default function Analytics() {
  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics & Reporting
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Trend analysis, volume metrics, and report generation
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-xl text-xs h-8 gap-1.5 hover:border-blue-300 hover:text-blue-600 transition-colors"
            data-ocid="analytics.export.button"
          >
            <Download size={13} /> Export CSV
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs h-8 gap-1.5 shadow-md hover:shadow-lg transition-all"
            data-ocid="analytics.fiu_report.button"
          >
            <FileText size={13} /> FIU Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {summaryStats.map((s, i) => (
          <div
            key={s.label}
            className={`bg-gradient-to-br ${s.gradient} rounded-2xl p-5 border border-white/80 shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shine-hover`}
            data-ocid={`analytics.stat.card.${i + 1}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{s.icon}</span>
              <TrendingUp size={16} className={s.color} />
            </div>
            <div className={`text-3xl font-black ${s.color} tracking-tight`}>
              {s.value}
            </div>
            <div className="text-xs text-slate-600 mt-1 font-medium">
              {s.label}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow">
          <h3 className="text-sm font-bold text-gray-900 mb-4">
            Risk Score Trend
          </h3>
          <InteractiveLineChart
            data={analyticsData.riskTrend}
            color="#7C3AED"
            label="risk"
          />
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow">
          <h3 className="text-sm font-bold text-gray-900 mb-4">
            Transaction Volume
          </h3>
          <InteractiveBarChart
            data={analyticsData.transactionVolume}
            color="#3B82F6"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow">
          <h3 className="text-sm font-bold text-gray-900 mb-4">
            Fraud Frequency
          </h3>
          <InteractiveLineChart
            data={analyticsData.fraudFrequency}
            color="#EF4444"
            label="fraud"
          />
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow">
          <h3 className="text-sm font-bold text-gray-900 mb-4">
            Alert Distribution by Type
          </h3>
          <div className="space-y-3 mt-1">
            {alertDistribution.map((item) => (
              <div key={item.type} className="group cursor-pointer">
                <div className="flex justify-between text-xs text-slate-600 mb-1.5">
                  <span className="font-medium group-hover:text-gray-900 transition-colors">
                    {item.type}
                  </span>
                  <span className="font-bold" style={{ color: item.color }}>
                    {item.count}
                  </span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 group-hover:opacity-100"
                    style={{
                      width: `${item.pct}%`,
                      background: `linear-gradient(90deg, ${item.color}88, ${item.color})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">Scheduled Reports</h3>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs hover:border-blue-300 hover:text-blue-600 transition-colors"
            data-ocid="analytics.new_report.button"
          >
            + New Report
          </Button>
        </div>
        <div className="space-y-2">
          {scheduledReports.map((r, i) => (
            <div
              key={r.name}
              className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 cursor-pointer group border border-transparent hover:border-blue-100"
              data-ocid={`analytics.report.item.${i + 1}`}
            >
              <FileText
                size={16}
                className="text-blue-400 group-hover:text-blue-600 transition-colors"
              />
              <div className="flex-1">
                <div className="text-xs font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                  {r.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  {r.schedule} · Last: {r.last}
                </div>
              </div>
              <span
                className={`text-[10px] px-2.5 py-1 rounded-full border font-medium ${
                  r.status === "Active"
                    ? "bg-green-50 text-green-600 border-green-200"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                }`}
              >
                {r.status}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[10px] px-3 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors"
                data-ocid={`analytics.report.download_button.${i + 1}`}
              >
                <Download size={10} className="mr-1" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
