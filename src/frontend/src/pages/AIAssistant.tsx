import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Mic, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { chatMessages } from "../data/mockData";

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
  time: string;
}

const botResponses: Record<string, string> = {
  default:
    "I'm analyzing your request... Based on current transaction data, I've identified several patterns worth reviewing. Would you like me to generate a detailed report?",
  summarize:
    "📋 **Case Summary (CASE-2024-001):**\n\nSuspect: Rajesh Kumar Sharma (ACC-8821)\nPattern: Multi-layer fund obfuscation\nRisk Score: 94/100\nLinked Accounts: 6\nRecommendation: Immediate FIU filing under PMLA Section 12AA.",
  freeze:
    "⚠️ To freeze an account, navigate to Customer Intelligence → Select account → Actions → Freeze. This requires Admin or Investigator role. Shall I guide you through the process?",
  report:
    "📊 Generating FIU-ready report for the last 30 days...\n\n• 43 suspicious alerts detected\n• 12 active investigations\n• Risk exposure: $35.7K\n• 3 accounts recommend immediate freeze\n\nReport ready for download in PDF format.",
};

function formatMessage(text: string) {
  return text.split("\n").map((line) => (
    <span key={line.slice(0, 20) || "empty"}>
      {line}
      <br />
    </span>
  ));
}

const quickActions = [
  "Show high-risk accounts",
  "Summarize latest case",
  "Generate FIU report",
  "Freeze account ACC-8821",
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(
    chatMessages as Message[],
  );
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll when message count changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const lower = text.toLowerCase();
      const responseKey =
        Object.keys(botResponses).find(
          (k) => k !== "default" && lower.includes(k),
        ) || "default";
      const botMsg: Message = {
        id: Date.now() + 1,
        role: "bot",
        text: botResponses[responseKey],
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-112px)] animate-fade-in-up">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">AI Assistant</h1>
        <p className="text-sm text-slate-500">
          Ask anything about fraud patterns, accounts, and investigations
        </p>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Chat */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4"
            data-ocid="ai_assistant.chat.panel"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {msg.role === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot size={14} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-slate-50 text-gray-800 border border-slate-100 rounded-bl-sm"
                  }`}
                >
                  {formatMessage(msg.text)}
                  <div
                    className={`text-[9px] mt-1.5 ${msg.role === "user" ? "text-blue-200" : "text-slate-400"}`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
            {typing && (
              <div
                className="flex gap-2"
                data-ocid="ai_assistant.typing.loading_state"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask me about fraud patterns, accounts, cases..."
                className="flex-1 rounded-xl text-xs h-9"
                data-ocid="ai_assistant.chat.input"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl text-slate-500"
                data-ocid="ai_assistant.voice.button"
              >
                <Mic size={15} />
              </Button>
              <Button
                onClick={() => sendMessage(input)}
                className="h-9 w-9 rounded-xl bg-blue-600 hover:bg-blue-700 p-0"
                data-ocid="ai_assistant.send.button"
              >
                <Send size={14} className="text-white" />
              </Button>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="w-60 space-y-4 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-xs font-semibold text-gray-900 mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {quickActions.map((action, i) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => sendMessage(action)}
                  className="w-full text-left text-xs px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-transparent hover:border-blue-100 transition-all"
                  data-ocid={`ai_assistant.quick_action.button.${i + 1}`}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-4">
            <div className="text-xs font-semibold text-gray-900 mb-2">
              🧠 AI Capabilities
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li>✓ Pattern detection & explanation</li>
              <li>✓ Case summarization</li>
              <li>✓ FIU report generation</li>
              <li>✓ Risk score analysis</li>
              <li>✓ Account behavior analysis</li>
              <li>✓ Regulatory compliance check</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
