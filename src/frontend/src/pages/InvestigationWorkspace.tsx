import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { caseTimeline, cases } from "../data/mockData";

const statusColor: Record<string, string> = {
  Open: "bg-blue-100 text-blue-700 border-blue-200",
  Investigating: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Closed: "bg-green-100 text-green-700 border-green-200",
};

const priorityColor: Record<string, string> = {
  Critical: "text-red-600",
  High: "text-orange-600",
  Medium: "text-yellow-600",
  Low: "text-green-600",
};

const timelineTypeColor: Record<string, string> = {
  alert: "bg-red-100",
  info: "bg-blue-100",
  action: "bg-green-100",
  note: "bg-purple-100",
};

const timelineIconColor: Record<string, string> = {
  alert: "text-red-600",
  info: "text-blue-600",
  action: "text-green-600",
  note: "text-purple-600",
};

function TimelineIcon({ type }: { type: string }) {
  if (type === "alert")
    return <AlertTriangle size={13} className="text-red-600" />;
  if (type === "action")
    return <CheckCircle size={13} className="text-green-600" />;
  if (type === "note")
    return <MessageSquare size={13} className="text-purple-600" />;
  return <Clock size={13} className="text-blue-600" />;
}

export default function InvestigationWorkspace() {
  const [selectedId, setSelectedId] = useState(cases[0].id);
  const [notes, setNotes] = useState<string[]>([]);
  const [noteInput, setNoteInput] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState("");

  const selectedCase = cases.find((c) => c.id === selectedId)!;

  const addNote = () => {
    if (noteInput.trim()) {
      setNotes((prev) => [...prev, noteInput.trim()]);
      setNoteInput("");
    }
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Investigation Workspace
          </h1>
          <p className="text-sm text-slate-500">
            Manage fraud cases, add notes, and track progress
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm"
              data-ocid="investigation.create.open_modal_button"
            >
              <Plus size={15} className="mr-1.5" /> New Case
            </Button>
          </DialogTrigger>
          <DialogContent
            className="rounded-2xl"
            data-ocid="investigation.create.dialog"
          >
            <DialogHeader>
              <DialogTitle>Create New Investigation Case</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label className="text-sm">Case Title</Label>
                <Input
                  value={newCaseTitle}
                  onChange={(e) => setNewCaseTitle(e.target.value)}
                  placeholder="Brief description of investigation"
                  className="mt-1.5 rounded-xl"
                  data-ocid="investigation.new_case.input"
                />
              </div>
              <div>
                <Label className="text-sm">Priority</Label>
                <Input
                  placeholder="Critical / High / Medium"
                  className="mt-1.5 rounded-xl"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                  className="rounded-xl"
                  data-ocid="investigation.create.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  onClick={() => setCreateOpen(false)}
                  data-ocid="investigation.create.confirm_button"
                >
                  Create Case
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        {/* Case List */}
        <div
          className="w-80 flex-shrink-0 space-y-2"
          data-ocid="investigation.cases.list"
        >
          {cases.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                selectedId === c.id
                  ? "bg-white border-blue-200 shadow-sm"
                  : "bg-white/60 border-gray-100 hover:bg-white hover:shadow-sm"
              }`}
              data-ocid={`investigation.case.item.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-mono text-slate-400">
                  {c.id}
                </span>
                <Badge
                  className={`text-[9px] px-1.5 py-0 border ${statusColor[c.status]}`}
                >
                  {c.status}
                </Badge>
              </div>
              <div className="text-xs font-semibold text-gray-800 leading-tight mb-1.5">
                {c.title}
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-400">
                <span className={priorityColor[c.priority]}>{c.priority}</span>
                <span>Assignee: {c.assignee}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div
          className="flex-1 space-y-4"
          data-ocid="investigation.detail.panel"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400">
                  {selectedCase.id}
                </span>
                <h2 className="text-base font-bold text-gray-900 mt-0.5">
                  {selectedCase.title}
                </h2>
              </div>
              <div className="flex gap-2">
                <Badge className={`border ${statusColor[selectedCase.status]}`}>
                  {selectedCase.status}
                </Badge>
                <Badge
                  variant="outline"
                  className={`border ${priorityColor[selectedCase.priority]}`}
                >
                  {selectedCase.priority}
                </Badge>
              </div>
            </div>
            <div className="flex gap-6 text-xs text-slate-500">
              <span>
                Assignee:{" "}
                <strong className="text-gray-700">
                  {selectedCase.assignee}
                </strong>
              </span>
              <span>
                Created:{" "}
                <strong className="text-gray-700">
                  {selectedCase.created}
                </strong>
              </span>
              <span>
                Accounts:{" "}
                <strong className="text-gray-700">
                  {selectedCase.accounts.join(", ")}
                </strong>
              </span>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🤖</span>
              <h3 className="text-sm font-semibold text-gray-900">
                AI Case Summary
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              This investigation involves suspected multi-layered fund transfers
              designed to obscure the origin of illicit funds. Pattern analysis
              indicates a 94% probability of organized financial crime. Key
              accounts involved show classic layering signatures: rapid fund
              movement through multiple intermediaries, circular transactions,
              and shell company involvement. Recommend immediate account freeze
              and FIU notification under PMLA Section 12.
            </p>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Investigation Timeline
            </h3>
            <div className="space-y-3">
              {caseTimeline.map((event, i) => (
                <div
                  key={event.time}
                  className="flex gap-3"
                  data-ocid={`investigation.timeline.item.${i + 1}`}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${timelineTypeColor[event.type] || "bg-blue-100"}`}
                    >
                      <TimelineIcon type={event.type} />
                    </div>
                    {i < caseTimeline.length - 1 && (
                      <div className="w-px flex-1 bg-gray-100 mt-1" />
                    )}
                  </div>
                  <div className="pb-3">
                    <div className="text-xs text-gray-800 font-medium">
                      {event.event}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {event.time}
                    </div>
                  </div>
                </div>
              ))}
              {notes.map((note, i) => (
                <div
                  key={`user-note-${note.slice(0, 10)}-${i}`}
                  className="flex gap-3"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${timelineTypeColor.note}`}
                  >
                    <MessageSquare
                      size={13}
                      className={timelineIconColor.note}
                    />
                  </div>
                  <div>
                    <div className="text-xs text-gray-800 font-medium">
                      {note}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Just now · You
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Note */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Add Note
            </h3>
            <div className="flex gap-2">
              <Textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Add investigation note or evidence..."
                className="flex-1 min-h-0 h-10 resize-none rounded-xl text-xs py-2"
                data-ocid="investigation.note.textarea"
              />
              <Button
                onClick={addNote}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 text-xs"
                data-ocid="investigation.note.submit_button"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
