"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import {
  doc,
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  setDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { EventData, Participant } from "@/types";
import * as XLSX from "xlsx";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import {
  ArrowLeft,
  Users,
  CheckCircle,
  Clock,
  Percent,
  Download,
  Plus,
  Play,
  Pause,
  Search,
  Trash2,
  UserCheck,
  Globe,
  Terminal,
  Upload,
} from "lucide-react";

export default function EventDetailPage() {
  const { user, role, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Manual register inputs
  const [manualId, setManualId] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualLoading, setManualLoading] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "checked" | "pending">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Append spreadsheet states
  const [appendFile, setAppendFile] = useState<File | null>(null);
  const [appendData, setAppendData] = useState<any[]>([]);
  const [isAppending, setIsAppending] = useState(false);
  const [appendProgress, setAppendProgress] = useState("");
  const [appendError, setAppendError] = useState("");
  const [appendSuccess, setAppendSuccess] = useState("");

  // Redirect unauthorized
  useEffect(() => {
    if (!loading && (!user || role === "none")) {
      router.replace("/admin");
    }
  }, [user, role, loading, router]);

  // Subscribe to Event and Participants
  useEffect(() => {
    if (role === "none" || !eventId) return;

    const unsubEvent = onSnapshot(doc(db, "events", eventId), (docSnap) => {
      if (!docSnap.exists()) {
        router.push("/admin");
      } else {
        setEvent({ id: docSnap.id, ...docSnap.data() } as EventData);
      }
    });

    const unsubParticipants = onSnapshot(
      collection(db, "events", eventId, "participants"),
      (snapshot) => {
        const list: Participant[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Participant);
        });
        list.sort((a, b) => {
          if (a.checkedIn && !b.checkedIn) return -1;
          if (!a.checkedIn && b.checkedIn) return 1;
          return a.name.localeCompare(b.name);
        });
        setParticipants(list);
        setDataLoading(false);
      },
      (error) => {
        console.error("Error loading participants:", error);
      }
    );

    return () => {
      unsubEvent();
      unsubParticipants();
    };
  }, [eventId, role, router]);

  // Toggle Event Status
  const handleToggleStatus = async () => {
    if (!event) return;
    try {
      const eventRef = doc(db, "events", event.id);
      await updateDoc(eventRef, {
        status: event.status === "active" ? "paused" : "active",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Add Manual Guest
  const handleAddManualGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualId.trim() || !manualName.trim() || !event) return;

    const exists = participants.some(
      (p) => p.row_id.toLowerCase() === manualId.trim().toLowerCase()
    );
    if (exists) {
      alert(`Ticket ID "${manualId}" is already registered.`);
      return;
    }

    setManualLoading(true);
    try {
      const participantsRef = collection(db, "events", event.id, "participants");
      const newPartDoc = doc(participantsRef);
      
      await setDoc(newPartDoc, {
        row_id: manualId.trim(),
        name: manualName.trim(),
        checkedIn: false,
        checkInTime: null,
        manualEntry: true,
      });

      const eventRef = doc(db, "events", event.id);
      await updateDoc(eventRef, {
        participantsCount: increment(1),
      });

      setManualId("");
      setManualName("");
    } catch (err) {
      console.error(err);
      alert("Failed to register guest.");
    } finally {
      setManualLoading(false);
    }
  };

  // Manual Check-in toggle
  const handleVerifyParticipant = async (p: Participant) => {
    if (!event || !p.id) return;
    setActionLoading(p.id);

    try {
      const pRef = doc(db, "events", event.id, "participants", p.id);
      const eventRef = doc(db, "events", event.id);

      if (!p.checkedIn) {
        await updateDoc(pRef, {
          checkedIn: true,
          checkInTime: Date.now(),
        });
        await updateDoc(eventRef, {
          checkedInCount: increment(1),
        });
      } else {
        await updateDoc(pRef, {
          checkedIn: false,
          checkInTime: null,
        });
        await updateDoc(eventRef, {
          checkedInCount: increment(-1),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Participant
  const handleDeleteParticipant = async (p: Participant) => {
    if (!event || !p.id) return;
    if (!confirm(`Remove "${p.name}" from guest list?`)) return;

    setActionLoading(p.id);
    try {
      const pRef = doc(db, "events", event.id, "participants", p.id);
      await deleteDoc(pRef);

      const eventRef = doc(db, "events", event.id);
      const updates: any = {
        participantsCount: increment(-1),
      };
      if (p.checkedIn) {
        updates.checkedInCount = increment(-1);
      }
      await updateDoc(eventRef, updates);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle spreadsheet import to append participants
  const handleAppendFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setAppendError("");
    setAppendSuccess("");
    setAppendFile(null);
    setAppendData([]);

    if (!selectedFile) return;

    setAppendFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rows = XLSX.utils.sheet_to_json(ws) as any[];

        if (rows.length === 0) {
          setAppendError("The uploaded spreadsheet is empty.");
          return;
        }

        const sampleRow = rows[0];
        const rowIdKey = Object.keys(sampleRow).find(
          (k) => k.toLowerCase() === "row_id" || k.toLowerCase() === "row id" || k.toLowerCase() === "ticket_id"
        );
        const nameKey = Object.keys(sampleRow).find(
          (k) => k.toLowerCase() === "name" || k.toLowerCase() === "full name"
        );

        if (!rowIdKey || !nameKey) {
          setAppendError("Spreadsheet must contain a 'row_id' (or 'ticket_id') and a 'name' column.");
          return;
        }

        const formatted = rows
          .map((row) => ({
            row_id: row[rowIdKey]?.toString().trim() || "",
            name: row[nameKey]?.toString().trim() || "",
          }))
          .filter((row) => row.row_id && row.name);

        if (formatted.length === 0) {
          setAppendError("Could not parse any valid rows with both ID and Name.");
          return;
        }

        // Check for duplicates within the uploaded file itself
        const uniqueUploaded: any[] = [];
        const seen = new Set<string>();
        for (const item of formatted) {
          const lowerId = item.row_id.toLowerCase();
          if (!seen.has(lowerId)) {
            seen.add(lowerId);
            uniqueUploaded.push(item);
          }
        }

        // Filter out participants that are already in the existing list
        const existingIds = new Set(participants.map((p) => p.row_id.toLowerCase()));
        const toAppend = uniqueUploaded.filter((item) => !existingIds.has(item.row_id.toLowerCase()));

        if (toAppend.length === 0) {
          setAppendError("All participants in the uploaded file are already registered.");
          return;
        }

        setAppendData(toAppend);
        setAppendSuccess(`Found ${toAppend.length} new participant(s) to add.`);
      } catch (err) {
        console.error(err);
        setAppendError("Failed to parse sheet. Verify file format.");
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  const handleUploadAppendData = async () => {
    if (appendData.length === 0 || !event) return;

    setIsAppending(true);
    setAppendProgress(`Writing 0 / ${appendData.length}...`);

    try {
      const participantsRef = collection(db, "events", event.id, "participants");
      const writeBatch = (await import("firebase/firestore")).writeBatch;
      
      const chunkSize = 500;
      let writtenCount = 0;

      for (let i = 0; i < appendData.length; i += chunkSize) {
        const chunk = appendData.slice(i, i + chunkSize);
        const batch = writeBatch(db);

        chunk.forEach((item) => {
          const newDoc = doc(participantsRef);
          batch.set(newDoc, {
            row_id: item.row_id,
            name: item.name,
            checkedIn: false,
            checkInTime: null,
          });
        });

        await batch.commit();
        writtenCount += chunk.length;
        setAppendProgress(`Writing ${writtenCount} / ${appendData.length}...`);
      }

      // Update event metadata count
      const eventRef = doc(db, "events", event.id);
      await updateDoc(eventRef, {
        participantsCount: increment(writtenCount),
      });

      setAppendSuccess(`Successfully added ${writtenCount} new guests!`);
      setAppendFile(null);
      setAppendData([]);
    } catch (err) {
      console.error(err);
      setAppendError("Failed to import guests.");
    } finally {
      setIsAppending(false);
      setAppendProgress("");
    }
  };

  // Export Excel Report
  const handleExportReport = () => {
    if (!event || participants.length === 0) return;

    const formatted = participants.map((p) => ({
      "Ticket ID": p.row_id,
      "Full Name": p.name,
      "Checked In": p.checkedIn ? "Yes" : "No",
      "Check-in Timestamp": p.checkInTime ? new Date(p.checkInTime).toLocaleString() : "N/A",
      "Entry Source": p.manualEntry ? "Manual Dashboard" : "Excel Import",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formatted);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Validation Sheet");
    
    const maxNameLen = Math.max(...participants.map(p => p.name.length), 15);
    worksheet["!cols"] = [
      { wch: 15 }, 
      { wch: maxNameLen + 2 }, 
      { wch: 12 }, 
      { wch: 22 }, 
      { wch: 18 }
    ];

    XLSX.writeFile(workbook, `${event.name.replace(/\s+/g, "_")}_CheckIn_Report.xlsx`);
  };

  // Client Filter
  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      p.row_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "checked" && p.checkedIn) ||
      (statusFilter === "pending" && !p.checkedIn);

    return matchesSearch && matchesStatus;
  });

  if (loading || !user || role === "none" || !event) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const remainingCount = Math.max(0, event.participantsCount - event.checkedInCount);
  const checkInRate = event.participantsCount > 0 
    ? Math.round((event.checkedInCount / event.participantsCount) * 100)
    : 0;

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-6 relative">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/admin" className="text-text-secondary hover:text-white flex items-center gap-1 text-sm font-semibold transition-colors font-mono uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleToggleStatus}
            className="flex items-center gap-1.5 text-[10px] font-mono uppercase py-2 px-3 border-white/10"
          >
            {event.status === "active" ? (
              <>
                <Pause className="h-3.5 w-3.5 text-yellow-400" />
                Pause Gates
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-emerald-400" />
                Resume Gates
              </>
            )}
          </Button>

          <Button 
            onClick={handleExportReport} 
            disabled={participants.length === 0} 
            size="sm"
            className="flex items-center gap-1.5 text-[10px] font-mono uppercase py-2 px-3 glow-shadow"
          >
            <Download className="h-3.5 w-3.5" />
            Export (.xlsx)
          </Button>
        </div>
      </div>

      {/* Main Card header */}
      <Card className="relative border-white/5 bg-navy-950/40 overflow-hidden" heavy>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-primary/45 to-transparent" />
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-brand-accent uppercase tracking-widest">
          Event Control Console
          <span className={`h-2 w-2 rounded-full ${event.status === "active" ? "bg-emerald-500 animate-pulse glow-shadow-success" : "bg-yellow-500"}`} />
        </div>
        <h1 className="text-2xl md:text-3xl font-mono font-black text-white leading-tight mt-2 uppercase tracking-tight">{event.name}</h1>
        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-text-secondary mt-3 font-mono">
          <span>SCHEDULED: <strong className="text-white">{event.date}</strong></span>
          <span className="hidden md:inline text-text-muted">&bull;</span>
          <span>ACCESS PASSKEY: <strong className="text-brand-accent tracking-wider font-bold">{event.accessCode}</strong></span>
        </div>
      </Card>

      {/* Live Analytics Dashboard Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Registered */}
        <Card className="flex items-center gap-4 py-4 px-5 border-white/5 bg-navy-950/40 relative overflow-hidden group">
          <div className="absolute top-[-50%] left-[-50%] w-full h-full rounded-full bg-brand-primary/5 blur-[50px] pointer-events-none" />
          <div className="h-10 w-10 bg-navy-900 border border-white/5 text-text-secondary rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono font-bold text-text-secondary tracking-widest">Registered</p>
            <p className="text-2xl font-mono font-black text-white mt-0.5">{event.participantsCount}</p>
          </div>
        </Card>

        {/* Card 2: Checked In */}
        <Card className="flex items-center gap-4 py-4 px-5 border-white/5 bg-navy-950/40 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-50%] w-full h-full rounded-full bg-emerald-500/5 blur-[50px] pointer-events-none" />
          <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-lg flex items-center justify-center glow-shadow-success">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono font-bold text-emerald-400 tracking-widest">Validated</p>
            <p className="text-2xl font-mono font-black text-white mt-0.5">{event.checkedInCount}</p>
          </div>
        </Card>

        {/* Card 3: Remaining */}
        <Card className="flex items-center gap-4 py-4 px-5 border-white/5 bg-navy-950/40 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-50%] w-full h-full rounded-full bg-yellow-500/5 blur-[50px] pointer-events-none" />
          <div className="h-10 w-10 bg-yellow-500/10 border border-yellow-500/25 text-yellow-400 rounded-lg flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono font-bold text-yellow-400 tracking-widest">Queue Left</p>
            <p className="text-2xl font-mono font-black text-white mt-0.5">{remainingCount}</p>
          </div>
        </Card>

        {/* Card 4: Rate */}
        <Card className="flex items-center gap-4 py-4 px-5 border-white/5 bg-navy-950/40 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-50%] w-full h-full rounded-full bg-brand-accent/5 blur-[50px] pointer-events-none" />
          <div className="h-10 w-10 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-lg flex items-center justify-center">
            <Percent className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono font-bold text-brand-primary tracking-widest">Check-in Rate</p>
            <p className="text-2xl font-mono font-black text-white mt-0.5">{checkInRate}%</p>
          </div>
        </Card>
      </div>

      {/* Main Grid Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Guest Table Registry */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <Card className="flex-1 flex flex-col min-h-[440px] bg-navy-950/60 border-white/5">
            
            {/* Table Controls Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
              <h2 className="font-mono text-white text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Terminal className="h-4.5 w-4.5 text-brand-accent" />
                GUEST REGISTRY DATA ({filteredParticipants.length})
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search field */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
                  <input
                    type="text"
                    id="search-registry-field"
                    placeholder="Filter by ID / Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-44 pl-9 pr-4 py-1.5 rounded-lg bg-navy-950 border border-white/10 text-[11px] font-mono text-white placeholder:text-text-muted focus:ring-1 focus:ring-brand-accent focus:outline-none"
                  />
                </div>

                {/* Filter badges */}
                <div className="flex items-center border border-white/10 rounded-lg bg-navy-950 p-1 gap-1">
                  {(["all", "checked", "pending"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setStatusFilter(mode)}
                      className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-md uppercase transition-colors cursor-pointer ${
                        statusFilter === mode
                          ? "bg-brand-primary text-white"
                          : "text-text-secondary hover:text-white"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Guest list table */}
            {dataLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredParticipants.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-text-muted text-xs font-mono py-12 uppercase tracking-wide">
                No matching database logs found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-text-secondary uppercase tracking-widest font-mono text-[10px]">
                      <th className="py-3.5 px-4">TICKET ID</th>
                      <th className="py-3.5 px-4">NAME</th>
                      <th className="py-3.5 px-4">SOURCE</th>
                      <th className="py-3.5 px-4">STATUS</th>
                      <th className="py-3.5 px-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParticipants.map((p) => {
                      const checkInTimeText = p.checkInTime 
                        ? new Date(p.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : "";

                      return (
                        <tr 
                          key={p.id} 
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-3 px-4 font-mono font-bold text-brand-accent tracking-wider">{p.row_id}</td>
                          <td className="py-3 px-4 font-semibold text-white">{p.name}</td>
                          <td className="py-3 px-4 text-text-secondary font-mono text-[10px] uppercase">
                            {p.manualEntry ? (
                              <span className="flex items-center gap-1 text-brand-primary">
                                <Plus className="h-3 w-3" />
                                MANUAL
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-text-muted">
                                <Globe className="h-3 w-3" />
                                IMPORT
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {p.checkedIn ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold uppercase text-[9px] tracking-wide">
                                VERIFIED {checkInTimeText}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-mono font-bold uppercase text-[9px] tracking-wide">
                                PENDING
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant={p.checkedIn ? "secondary" : "success"}
                                size="sm"
                                className="py-1 px-3 text-[10px] font-mono uppercase font-bold"
                                disabled={actionLoading === p.id}
                                onClick={() => handleVerifyParticipant(p)}
                              >
                                {p.checkedIn ? <>Un-verify</> : <>Verify</>}
                              </Button>

                              <Button
                                variant="danger"
                                size="sm"
                                className="py-1 px-2 border-white/5"
                                disabled={actionLoading === p.id}
                                onClick={() => handleDeleteParticipant(p)}
                                aria-label="Delete Guest"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Manual Add Card */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="flex flex-col gap-4 border-white/5 bg-navy-950/60 relative overflow-hidden" heavy>
            <div className="absolute top-0 left-0 w-6 h-6 border-l border-t border-brand-accent/40" />
            <div className="absolute top-0 right-0 w-6 h-6 border-r border-t border-brand-accent/40" />
            
            <h3 className="font-mono text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-3">
              <Plus className="h-4 w-4 text-brand-accent animate-pulse" />
              ADD GUEST NODE
            </h3>
            
            <form onSubmit={handleAddManualGuest} className="flex flex-col gap-5">
              <Input
                label="Ticket / Row ID"
                placeholder="e.g. 1042"
                id="manual-id-input"
                type="text"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                required
                disabled={manualLoading}
              />

              <Input
                label="Participant Name"
                placeholder="e.g. Jane Doe"
                id="manual-name-input"
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                required
                disabled={manualLoading}
              />

              <Button type="submit" isLoading={manualLoading} className="w-full mt-2 text-xs font-mono uppercase tracking-widest py-3">
                <UserCheck className="h-4 w-4 mr-1" />
                Register guest
              </Button>
            </form>
          </Card>

          {/* Bulk Append spreadsheet Card */}
          <Card className="flex flex-col gap-4 border-white/5 bg-navy-950/60 relative overflow-hidden" heavy>
            {/* Cyber accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-brand-accent/30" />
            <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-brand-accent/30" />
            
            <h2 className="font-mono text-white text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Upload className="h-4.5 w-4.5 text-brand-primary" />
              BULK APPEND GUESTS
            </h2>
            
            <p className="text-xs text-text-secondary font-mono leading-relaxed">
              Add more participants by uploading a spreadsheet. Existing ticket IDs will be skipped.
            </p>

            <div className="relative border border-dashed border-white/10 hover:border-brand-primary/30 rounded-lg p-4 text-center cursor-pointer transition-colors bg-navy-950/50">
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleAppendFileChange}
                disabled={isAppending}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <Upload className="h-6 w-6 text-brand-primary mx-auto mb-2" />
              <p className="text-xs font-semibold text-white truncate max-w-[200px] mx-auto">
                {appendFile ? appendFile.name : "Select spreadsheet"}
              </p>
            </div>

            {appendError && (
              <p className="text-[10px] font-mono text-red-400 bg-red-950/30 border border-red-500/25 p-2 rounded">
                {appendError}
              </p>
            )}
            
            {appendSuccess && (
              <p className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 p-2 rounded">
                {appendSuccess}
              </p>
            )}

            {appendData.length > 0 && (
              <Button
                onClick={handleUploadAppendData}
                isLoading={isAppending}
                className="w-full text-xs font-mono uppercase tracking-widest py-3 mt-1"
              >
                {isAppending ? appendProgress : `Upload ${appendData.length} new guests`}
              </Button>
            )}
          </Card>
        </div>
      </div>

      {/* Footer for event details and analytics */}
      <div className="text-center text-[10px] font-mono uppercase tracking-[0.12em] text-text-muted mt-8">
        Developed by{" "}
        <a 
          href="https://www.dotfreelancer.in/" 
          target="_blank" 
          className="text-brand-primary font-bold hover:underline"
        >
          dotfreelancer.in
        </a>
      </div>
    </div>
  );
}
