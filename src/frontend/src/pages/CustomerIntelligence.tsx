import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { useState } from "react";
import { customerTransactions, customers } from "../data/mockData";

const riskBadge: Record<string, string> = {
  Critical: "bg-red-100 text-red-700 border-red-200",
  High: "bg-orange-100 text-orange-700 border-orange-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Low: "bg-green-100 text-green-700 border-green-200",
};

const normalActivity = [20, 22, 25, 18, 24, 21, 23, 19];
const currentActivity = [20, 45, 68, 120, 180, 250, 320, 410];
const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Mar"];

function ActivityChart() {
  const max = Math.max(...currentActivity);
  const barW = 28;
  const gap = 10;
  const h = 80;
  return (
    <svg
      width="100%"
      viewBox={`0 0 ${(barW + gap) * 8} ${h + 20}`}
      aria-label="Activity comparison chart"
    >
      <title>Normal vs Current Activity</title>
      {normalActivity.map((val, i) => (
        <rect
          key={`n-${months[i]}`}
          x={i * (barW + gap)}
          y={h - (val / max) * h}
          width={barW * 0.45}
          height={(val / max) * h}
          rx="3"
          fill="#BFDBFE"
        />
      ))}
      {currentActivity.map((val, i) => (
        <rect
          key={`c-${months[i]}`}
          x={i * (barW + gap) + barW * 0.5}
          y={h - (val / max) * h}
          width={barW * 0.45}
          height={(val / max) * h}
          rx="3"
          fill="#EF4444"
          opacity={0.7}
        />
      ))}
      {months.map((m, i) => (
        <text
          key={m}
          x={i * (barW + gap) + barW / 2}
          y={h + 14}
          textAnchor="middle"
          fontSize="7"
          fill="#94A3B8"
        >
          {m}
        </text>
      ))}
    </svg>
  );
}

export default function CustomerIntelligence() {
  const [selectedId, setSelectedId] = useState(customers[0].id);
  const customer = customers.find((c) => c.id === selectedId)!;

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Customer Intelligence
        </h1>
        <p className="text-sm text-slate-500">
          KYC profiles, behavior analytics, and risk classification
        </p>
      </div>

      <div className="flex gap-4 h-[calc(100vh-220px)]">
        {/* Customer List */}
        <div
          className="w-72 bg-white rounded-2xl shadow-sm border border-gray-100 p-3 overflow-y-auto flex-shrink-0"
          data-ocid="customers.list"
        >
          {customers.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              className={`w-full text-left p-3 rounded-xl mb-1.5 transition-all duration-200 ${
                selectedId === c.id
                  ? "bg-blue-50 border border-blue-200"
                  : "hover:bg-slate-50 border border-transparent"
              }`}
              data-ocid={`customers.item.${i + 1}`}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-300 to-purple-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-gray-800 truncate">
                    {c.name}
                  </div>
                  <div className="text-[10px] text-slate-400">{c.account}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Badge
                  className={`text-[9px] px-1.5 py-0 border ${riskBadge[c.risk]}`}
                >
                  {c.risk}
                </Badge>
                <span className="text-[10px] text-slate-400">{c.type}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail Panel */}
        <div
          className="flex-1 space-y-4 overflow-y-auto"
          data-ocid="customers.detail.panel"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {customer.name}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {customer.account} · {customer.type}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className={`border ${riskBadge[customer.risk]}`}>
                  {customer.risk} Risk
                </Badge>
                <Button
                  size="sm"
                  className="h-7 text-xs rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  data-ocid="customers.investigate.button"
                >
                  Investigate
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mt-4">
              {(
                [
                  { label: "Phone", value: customer.phone },
                  { label: "Customer Since", value: customer.since },
                  {
                    label: "Transactions",
                    value: String(customer.transactions),
                  },
                  { label: "KYC Status", value: customer.kyc },
                ] as const
              ).map((item) => (
                <div
                  key={item.label}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="text-[10px] text-slate-400 mb-0.5">
                    {item.label}
                  </div>
                  <div className="flex items-center gap-1">
                    {item.label === "KYC Status" &&
                      (item.value === "Verified" ? (
                        <CheckCircle size={12} className="text-green-500" />
                      ) : item.value === "Expired" ? (
                        <XCircle size={12} className="text-red-500" />
                      ) : (
                        <Clock size={12} className="text-yellow-500" />
                      ))}
                    <span className="text-xs font-semibold text-gray-800">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Behavioral Analysis
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Normal activity (blue) vs. current pattern (red)
            </p>
            <ActivityChart />
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-blue-200" />
                <span className="text-[11px] text-slate-500">
                  Normal Baseline
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-red-400 opacity-70" />
                <span className="text-[11px] text-slate-500">
                  Current Activity
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Transaction History
            </h3>
            <table
              className="w-full text-xs"
              data-ocid="customers.transactions.table"
            >
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="pb-2 text-slate-400 font-medium">Date</th>
                  <th className="pb-2 text-slate-400 font-medium">Type</th>
                  <th className="pb-2 text-slate-400 font-medium">Amount</th>
                  <th className="pb-2 text-slate-400 font-medium">
                    Counterparty
                  </th>
                  <th className="pb-2 text-slate-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {customerTransactions.map((tx, i) => (
                  <tr
                    key={`${tx.date}-${tx.amount}`}
                    className="border-b border-gray-50 hover:bg-slate-50"
                    data-ocid={`customers.tx.row.${i + 1}`}
                  >
                    <td className="py-2 text-slate-600">{tx.date}</td>
                    <td
                      className={`py-2 font-medium ${tx.type === "Credit" ? "text-green-600" : "text-red-500"}`}
                    >
                      {tx.type}
                    </td>
                    <td className="py-2 font-semibold text-gray-800">
                      {tx.amount}
                    </td>
                    <td className="py-2 text-slate-500">{tx.counterparty}</td>
                    <td className="py-2">
                      <Badge
                        className={`text-[10px] px-1.5 py-0 border ${
                          tx.status === "Flagged"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-green-50 text-green-600 border-green-100"
                        }`}
                      >
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
