import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, Eye, Flag } from "lucide-react";
import { useState } from "react";
import { fraudAlerts } from "../data/mockData";

const severityColor: Record<string, string> = {
  Critical: "bg-red-100 text-red-700 border-red-200",
  High: "bg-orange-100 text-orange-700 border-orange-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Low: "bg-green-100 text-green-700 border-green-200",
};

function RiskGauge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "#EF4444"
      : score >= 60
        ? "#F97316"
        : score >= 40
          ? "#EAB308"
          : "#22C55E";
  const circumference = 94.2;
  return (
    <div className="relative w-16 h-16 flex-shrink-0 group cursor-pointer">
      <svg
        viewBox="0 0 36 36"
        className="w-full h-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke="#F1F5F9"
          strokeWidth="3"
        />
        <circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-black" style={{ color }}>
          {score}
        </span>
        <span className="text-[8px] text-slate-400 font-semibold">RISK</span>
      </div>
    </div>
  );
}

export default function FraudAlerts() {
  const [dismissed, setDismissed] = useState<number[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Fraud Alert Center
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            AI-detected suspicious activity requiring review
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600 flex items-center gap-1.5 animate-pulse-ring">
            <AlertTriangle size={13} />
            {fraudAlerts.filter((a) => a.severity === "Critical").length}{" "}
            Critical
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" data-ocid="fraud_alerts.tabs">
        <TabsList className="bg-white border border-gray-100 rounded-xl h-9 shadow-sm">
          <TabsTrigger
            value="all"
            className="rounded-lg text-xs"
            data-ocid="fraud_alerts.all.tab"
          >
            All ({fraudAlerts.length})
          </TabsTrigger>
          <TabsTrigger
            value="open"
            className="rounded-lg text-xs"
            data-ocid="fraud_alerts.open.tab"
          >
            Open ({fraudAlerts.filter((a) => a.status === "Open").length})
          </TabsTrigger>
          <TabsTrigger
            value="investigating"
            className="rounded-lg text-xs"
            data-ocid="fraud_alerts.investigating.tab"
          >
            Investigating (
            {fraudAlerts.filter((a) => a.status === "Investigating").length})
          </TabsTrigger>
          <TabsTrigger
            value="closed"
            className="rounded-lg text-xs"
            data-ocid="fraud_alerts.closed.tab"
          >
            Closed ({fraudAlerts.filter((a) => a.status === "Closed").length})
          </TabsTrigger>
        </TabsList>

        {(["all", "open", "investigating", "closed"] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <div
              className="grid grid-cols-1 gap-3"
              data-ocid={`fraud_alerts.${tab}.list`}
            >
              {fraudAlerts
                .filter((a) => tab === "all" || a.status.toLowerCase() === tab)
                .filter((a) => !dismissed.includes(a.id))
                .map((alert, i) => (
                  <div
                    key={alert.id}
                    className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 p-4 cursor-pointer ${
                      hoveredId === alert.id
                        ? "shadow-xl border-blue-200 -translate-y-0.5"
                        : "border-gray-100 hover:shadow-md"
                    }`}
                    onMouseEnter={() => setHoveredId(alert.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    data-ocid={`fraud_alerts.item.${i + 1}`}
                  >
                    <div className="flex gap-4">
                      <RiskGauge score={alert.riskScore} />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-gray-900">
                              {alert.type}
                            </span>
                            <Badge
                              className={`text-[10px] px-2 py-0.5 border ${severityColor[alert.severity]}`}
                            >
                              {alert.severity}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-[10px] px-2 py-0.5"
                            >
                              {alert.status}
                            </Badge>
                          </div>
                          <span className="text-[10px] text-slate-400 flex-shrink-0">
                            {alert.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mb-3">
                          {alert.reasoning}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          <span className="text-[10px] text-slate-400">
                            Linked Accounts:
                          </span>
                          {alert.accounts.map((acc) => (
                            <span
                              key={acc}
                              className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-semibold border border-blue-100 hover:bg-blue-100 cursor-pointer transition-colors"
                            >
                              {acc}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="h-7 text-[11px] px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all"
                            data-ocid={`fraud_alerts.investigate_button.${i + 1}`}
                          >
                            <Eye size={11} className="mr-1" /> Investigate
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[11px] px-3 rounded-lg border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors"
                            data-ocid={`fraud_alerts.flag_button.${i + 1}`}
                          >
                            <Flag size={11} className="mr-1" /> Flag
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-[11px] px-3 rounded-lg text-slate-500 hover:text-slate-700 transition-colors"
                            onClick={() =>
                              setDismissed((prev) => [...prev, alert.id])
                            }
                            data-ocid={`fraud_alerts.dismiss_button.${i + 1}`}
                          >
                            <CheckCircle size={11} className="mr-1" /> Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
