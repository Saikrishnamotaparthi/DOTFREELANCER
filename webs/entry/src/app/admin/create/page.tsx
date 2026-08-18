"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { doc, collection, setDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateEventPasskey } from "@/utils/passkey";
import { generateEventNotificationHtml } from "@/lib/email-template";
import { ExcelRow } from "@/types";
import * as XLSX from "xlsx";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { ArrowLeft, Upload, FileText, CheckCircle2, AlertCircle, Download } from "lucide-react";

export default function CreateEventPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ExcelRow[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Progress states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  // Redirect unauthorized users
  React.useEffect(() => {
    if (!loading && (role === "none" || !user)) {
      router.replace("/admin");
    }
  }, [user, role, loading, router]);

  // Excel File Parsing Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("");
    setParsedData([]);
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rows = XLSX.utils.sheet_to_json(ws) as any[];

        if (rows.length === 0) {
          setErrorMessage("The uploaded spreadsheet is empty.");
          return;
        }

        // Validate headers (MUST contain row_id/Row ID/ticket_id and name/Name/Full Name)
        const sampleRow = rows[0];
        const keys = Object.keys(sampleRow).map((k) => k.toLowerCase());
        
        const rowIdKey = Object.keys(sampleRow).find(
          (k) => k.toLowerCase() === "row_id" || k.toLowerCase() === "row id" || k.toLowerCase() === "ticket_id"
        );
        const nameKey = Object.keys(sampleRow).find(
          (k) => k.toLowerCase() === "name" || k.toLowerCase() === "full name"
        );

        if (!rowIdKey || !nameKey) {
          setErrorMessage(
            "Spreadsheet must contain a 'row_id' (or 'ticket_id') column and a 'name' column."
          );
          return;
        }

        // Format data
        const formattedData: ExcelRow[] = rows
          .map((row) => ({
            row_id: row[rowIdKey]?.toString().trim() || "",
            name: row[nameKey]?.toString().trim() || "",
          }))
          .filter((row) => row.row_id && row.name);

        if (formattedData.length === 0) {
          setErrorMessage("Could not parse any valid rows with both ID and Name.");
          return;
        }

        setParsedData(formattedData);
      } catch (err) {
        console.error(err);
        setErrorMessage("Failed to read the Excel file. Verify file format.");
      }
    };

    reader.readAsBinaryString(selectedFile);
  };

  const downloadSampleExcel = () => {
    const sampleData = [
      { row_id: "1001", name: "John Doe" },
      { row_id: "1002", name: "Jane Smith" },
      { row_id: "1003", name: "Alex Johnson" },
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sample Guest List");
    XLSX.writeFile(wb, "dotentry_sample_guest_list.xlsx");
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date || parsedData.length === 0 || !user) {
      setErrorMessage("Please fill in all details and upload a valid participant sheet.");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress("Generating credentials...");
    setErrorMessage("");

    try {
      // 1. Generate passkey mapping
      const { passKeySeries, accessCode } = generateEventPasskey(name);
      
      const eventsRef = collection(db, "events");
      const newEventDocRef = doc(eventsRef); // Auto-generate ID
      const eventId = newEventDocRef.id;

      // 2. Upload participants in concurrent chunks of 500
      const chunkSize = 500;
      const totalParticipants = parsedData.length;
      const totalChunks = Math.ceil(totalParticipants / chunkSize);

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, totalParticipants);
        const chunk = parsedData.slice(start, end);

        setUploadProgress(`Uploading participants: Chunk ${i + 1} of ${totalChunks}...`);

        const batch = writeBatch(db);
        chunk.forEach((participant) => {
          const participantDocRef = doc(collection(db, "events", eventId, "participants"));
          batch.set(participantDocRef, {
            row_id: participant.row_id.toString(),
            name: participant.name,
            checkedIn: false,
            checkInTime: null,
            manualEntry: false,
          });
        });

        await batch.commit();
      }

      // 3. Set parent event meta doc in Firestore
      setUploadProgress("Finalizing event creation...");
      const eventMeta = {
        id: eventId,
        name: name.trim(),
        date,
        createdAt: Date.now(),
        createdBy: user.uid,
        passKeySeries,
        accessCode,
        participantsCount: totalParticipants,
        checkedInCount: 0,
        status: "active",
      };
      await setDoc(newEventDocRef, eventMeta);

      // 4. Send admin logs notification email asynchronously
      try {
        const contactEmail = process.env.CONTACT_TO_EMAIL || "hello@dotfreelancer.in";
        const appUrl = window.location.origin;
        const emailHtml = generateEventNotificationHtml(
          name,
          `Event created successfully.<br/>Access Code: ${accessCode}<br/>Total Registered Participants: ${totalParticipants}`,
          appUrl
        );

        await fetch("/api/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: contactEmail,
            subject: `dotentry Alert: Event Created - ${name}`,
            html: emailHtml,
          }),
        });
      } catch (emailErr) {
        console.warn("Failed to dispatch log email:", emailErr);
      }

      // Redirect back to admin dashboard
      router.push("/admin");
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Database write transaction failed: " + (err.message || "Unknown error"));
      setIsSubmitting(false);
    }
  };

  if (loading || !user || role === "none") {
    return null; // Handled by auto redirect
  }

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      {/* Back to dashboard */}
      <div className="flex items-center gap-2">
        <Link href="/admin" className="text-text-secondary hover:text-white flex items-center gap-1 text-sm font-semibold transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
      </div>

      <Card className="flex flex-col gap-6" heavy>
        <div className="flex items-center gap-4">
          <Logo size="sm" showText={false} />
          <div>
            <h1 className="text-2xl font-black text-white">Create New Event</h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Add details and import your guest list in one step.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Event Name"
              placeholder="e.g. Annual Tech Summit"
              type="text"
              id="event-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
            />

            <Input
              label="Event Date"
              type="date"
              id="event-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Excel Uploader Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Participant guest list (.xlsx / .xls / .csv)
              </label>
              <button
                type="button"
                onClick={downloadSampleExcel}
                className="text-[10px] font-mono tracking-wider text-brand-accent hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none py-1"
              >
                <Download className="h-3 w-3" />
                Download Sample Excel
              </button>
            </div>
            
            <div className="relative group border-2 border-dashed border-white/10 hover:border-brand-primary/30 rounded-xl transition-all duration-300 bg-navy-950/40 hover:bg-navy-950/60 overflow-hidden min-h-[160px] flex flex-col items-center justify-center p-6 text-center cursor-pointer">
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                disabled={isSubmitting}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              
              <Upload className="h-8 w-8 text-brand-primary mb-3 group-hover:scale-110 transition-transform" />
              
              {file ? (
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-white text-sm flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-brand-accent" />
                    {file.name}
                  </span>
                  <span className="text-xs text-brand-accent mt-1 font-mono">
                    Parsed {parsedData.length} valid participant records
                  </span>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-white">Click or drag Excel sheet to upload</p>
                  <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                    Guest list sheets must contain columns labeled <code className="text-brand-accent font-mono">row_id</code> (or ticket_id) and <code className="text-brand-accent font-mono">name</code>.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Validation Alerts */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/40 border border-red-500/25 text-red-400 text-sm">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {parsedData.length > 0 && !errorMessage && (
            <div className="flex items-center gap-2 p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 animate-bounce" />
              <span>
                Success! Found <strong className="text-white font-mono">{parsedData.length}</strong> guests in the uploaded file. Ready to publish event.
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 justify-end border-t border-white/5 pt-6">
            <Link href="/admin">
              <Button type="button" variant="secondary" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              isLoading={isSubmitting} 
              disabled={isSubmitting || parsedData.length === 0}
            >
              {isSubmitting ? uploadProgress : "Publish & Upload Event"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Footer for admin event creation */}
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
