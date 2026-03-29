import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { type FundNode, fundEdges, fundNodes } from "../data/mockData";

const riskColor: Record<string, string> = {
  critical: "#EF4444",
  high: "#F97316",
  medium: "#EAB308",
  low: "#22C55E",
};

const riskBadge: Record<string, string> = {
  critical: "bg-red-100 text-red-700 border-red-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200",
};

const accountTxns: Record<
  string,
  { date: string; amount: string; type: string; to: string }[]
> = {
  n1: [
    { date: "2026-03-29", amount: "₹70,000", type: "Debit", to: "HDFC-3341" },
    { date: "2026-03-29", amount: "₹50,000", type: "Debit", to: "ICICI-6612" },
    {
      date: "2026-03-28",
      amount: "₹1,21,000",
      type: "Credit",
      to: "Shell Corp",
    },
  ],
};

type Filter = "all" | "suspicious" | "high-risk";

export default function FundFlow() {
  const [selected, setSelected] = useState<FundNode | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const visibleNodes = fundNodes.filter((n) => {
    if (filter === "suspicious")
      return n.risk === "critical" || n.risk === "high";
    if (filter === "high-risk") return n.risk === "critical";
    return true;
  });

  const visibleEdges = fundEdges.filter((e) => {
    const fromVisible = visibleNodes.find((n) => n.id === e.from);
    const toVisible = visibleNodes.find((n) => n.id === e.to);
    return fromVisible && toVisible;
  });

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    setMousePos({ x: dx * 30, y: dy * 18 });
  }, []);

  const handleMouseLeave = useCallback(() => setMousePos({ x: 0, y: 0 }), []);

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Fund Flow Visualizer
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Interactive transaction graph · click any node for details · move
            cursor to explore
          </p>
        </div>
        <div className="flex gap-2">
          {(["all", "suspicious", "high-risk"] as Filter[]).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className={`rounded-xl capitalize text-xs transition-all duration-200 ${
                filter === f
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "hover:border-blue-300 hover:text-blue-600"
              }`}
              data-ocid={`fund_flow.${f.replace("-", "_")}.toggle`}
            >
              {f === "all"
                ? "All Nodes"
                : f === "suspicious"
                  ? "Suspicious"
                  : "Critical Only"}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100 p-5 overflow-hidden">
          <svg
            ref={svgRef}
            width="100%"
            viewBox="0 0 880 500"
            className="overflow-visible"
            style={{ cursor: "crosshair" }}
            aria-label="Fund flow network visualizer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <title>Fund Flow Network</title>
            <defs>
              <filter id="glow2">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="softglow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <marker
                id="arrowBlue"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L6,3 z" fill="#93C5FD" />
              </marker>
              <marker
                id="arrowRed"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L6,3 z" fill="#F87171" />
              </marker>
            </defs>

            {/* Background edges layer - moves slower for depth */}
            <g
              transform={`translate(${mousePos.x * 0.3}, ${mousePos.y * 0.3})`}
              style={{ transition: "transform 0.12s ease-out" }}
            >
              {visibleEdges.map((edge) => {
                const from = visibleNodes.find((n) => n.id === edge.from)!;
                const to = visibleNodes.find((n) => n.id === edge.to)!;
                if (!from || !to) return null;
                const x1 = from.x + 20;
                const y1 = from.y + 10;
                const x2 = to.x + 20;
                const y2 = to.y + 10;
                const cx = (x1 + x2) / 2;
                const cy = (y1 + y2) / 2 - 30;
                const isHoveredRelated =
                  hoveredNode === edge.from || hoveredNode === edge.to;
                return (
                  <g key={`${edge.from}-${edge.to}`}>
                    <path
                      d={`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`}
                      fill="none"
                      stroke={edge.suspicious ? "#F87171" : "#93C5FD"}
                      strokeWidth={
                        isHoveredRelated ? 3.5 : edge.suspicious ? 2.5 : 1.5
                      }
                      strokeDasharray={edge.suspicious ? "6,3" : undefined}
                      markerEnd={
                        edge.suspicious ? "url(#arrowRed)" : "url(#arrowBlue)"
                      }
                      filter={
                        edge.suspicious || isHoveredRelated
                          ? "url(#glow2)"
                          : undefined
                      }
                      opacity={hoveredNode && !isHoveredRelated ? 0.2 : 0.9}
                      style={{ transition: "all 0.2s ease" }}
                    />
                    <text
                      x={(x1 + x2) / 2}
                      y={cy + 6}
                      textAnchor="middle"
                      fontSize="9"
                      fill={edge.suspicious ? "#EF4444" : "#94A3B8"}
                      fontWeight="700"
                      opacity={hoveredNode && !isHoveredRelated ? 0.2 : 1}
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Nodes layer - moves faster for parallax */}
            <g
              transform={`translate(${mousePos.x}, ${mousePos.y})`}
              style={{ transition: "transform 0.18s ease-out" }}
            >
              {visibleNodes.map((node) => {
                const isSelected = selected?.id === node.id;
                const isHovered = hoveredNode === node.id;
                const isDimmed = hoveredNode && !isHovered;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    style={{
                      cursor: "pointer",
                      transition: "opacity 0.2s ease",
                    }}
                    opacity={isDimmed ? 0.3 : 1}
                    onClick={() =>
                      setSelected(selected?.id === node.id ? null : node)
                    }
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      setSelected(selected?.id === node.id ? null : node)
                    }
                    tabIndex={0}
                    aria-label={`Account node ${node.label}`}
                  >
                    {isSelected && (
                      <circle
                        cx={20}
                        cy={10}
                        r={34}
                        fill={`${riskColor[node.risk]}18`}
                        className="animate-ping"
                      />
                    )}
                    {isHovered && (
                      <circle
                        cx={20}
                        cy={10}
                        r={32}
                        fill={`${riskColor[node.risk]}20`}
                      />
                    )}
                    <circle
                      cx={20}
                      cy={10}
                      r={24}
                      fill={`${riskColor[node.risk]}22`}
                      stroke={riskColor[node.risk]}
                      strokeWidth={isSelected || isHovered ? 3.5 : 2.5}
                      filter={
                        node.risk === "critical" || isHovered
                          ? "url(#glow2)"
                          : "url(#softglow)"
                      }
                      style={{ transition: "all 0.2s ease" }}
                    />
                    <text
                      x={20}
                      y={6}
                      textAnchor="middle"
                      fontSize="8"
                      fill={riskColor[node.risk]}
                      fontWeight="800"
                    >
                      {node.label.slice(-4)}
                    </text>
                    <text
                      x={20}
                      y={16}
                      textAnchor="middle"
                      fontSize="7"
                      fill="#64748B"
                    >
                      {node.type}
                    </text>
                    <text
                      x={20}
                      y={44}
                      textAnchor="middle"
                      fontSize="8"
                      fill="#1e293b"
                      fontWeight="700"
                    >
                      {node.balance}
                    </text>
                    <text
                      x={20}
                      y={-16}
                      textAnchor="middle"
                      fontSize="8"
                      fill={riskColor[node.risk]}
                      fontWeight="700"
                      opacity={isHovered || isSelected ? 1 : 0}
                      style={{ transition: "opacity 0.2s ease" }}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-3 pt-3 border-t border-gray-100">
            {Object.entries(riskColor).map(([level, color]) => (
              <div key={level} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full border-2"
                  style={{ borderColor: color, background: `${color}30` }}
                />
                <span className="text-[11px] text-slate-500 capitalize">
                  {level} Risk
                </span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <div className="w-6 border-t-2 border-dashed border-red-400" />
              <span className="text-[11px] text-slate-500">
                Suspicious Path
              </span>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        {selected && (
          <div
            className="w-72 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 animate-slide-in"
            data-ocid="fund_flow.account.panel"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Account Details
              </h3>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                data-ocid="fund_flow.panel.close_button"
              >
                <X size={14} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-lg font-bold text-gray-900">
                  {selected.label}
                </div>
                <div className="text-xs text-slate-500">
                  {selected.type} Account
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                  <div className="text-[10px] text-blue-400">Balance</div>
                  <div className="text-sm font-bold text-blue-700">
                    {selected.balance}
                  </div>
                </div>
                <div
                  className="p-2.5 rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ background: `${riskColor[selected.risk]}18` }}
                >
                  <div
                    className="text-[10px]"
                    style={{ color: riskColor[selected.risk] }}
                  >
                    Risk Level
                  </div>
                  <Badge
                    className={`text-[10px] mt-0.5 border ${riskBadge[selected.risk]}`}
                  >
                    {selected.risk.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1.5">
                  Risk Score
                </div>
                <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${selected.risk === "critical" ? 95 : selected.risk === "high" ? 75 : selected.risk === "medium" ? 50 : 25}%`,
                      background: `linear-gradient(90deg, ${riskColor[selected.risk]}88, ${riskColor[selected.risk]})`,
                    }}
                  />
                </div>
                <div className="text-right text-[10px] text-slate-400 mt-0.5">
                  {selected.risk === "critical"
                    ? "95"
                    : selected.risk === "high"
                      ? "75"
                      : selected.risk === "medium"
                        ? "50"
                        : "25"}
                  /100
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1.5">
                  Recent Transactions
                </div>
                <div className="space-y-1.5">
                  {(
                    accountTxns[selected.id] || [
                      {
                        date: "2026-03-29",
                        amount: "₹12,000",
                        type: "Debit",
                        to: "Various",
                      },
                      {
                        date: "2026-03-28",
                        amount: "₹8,500",
                        type: "Credit",
                        to: "Counterparty",
                      },
                    ]
                  ).map((tx, i) => (
                    <div
                      key={`${tx.date}-${i}`}
                      className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                    >
                      <span className="text-slate-500">{tx.date}</span>
                      <span
                        className={
                          tx.type === "Debit"
                            ? "text-red-500 font-semibold"
                            : "text-green-500 font-semibold"
                        }
                      >
                        {tx.type}
                      </span>
                      <span className="font-bold text-gray-700">
                        {tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                size="sm"
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs shadow-md hover:shadow-lg transition-all"
                data-ocid="fund_flow.investigate.button"
              >
                Open Investigation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
