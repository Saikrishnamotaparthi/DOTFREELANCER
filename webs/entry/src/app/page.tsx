"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  onSnapshot,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { EventData, Participant } from "@/types";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { Camera, LogOut, Search, CheckCircle, AlertTriangle, XCircle, ShieldCheck, Terminal, HelpCircle } from "lucide-react";
import Link from "next/link";

// Dynamically import html5-qrcode to prevent SSR errors
let Html5Qrcode: any = null;
if (typeof window !== "undefined") {
  import("html5-qrcode").then((module) => {
    Html5Qrcode = module.Html5Qrcode;
  });
}

export default function GateEntryPage() {
  const [passkey, setPasskey] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [event, setEvent] = useState<EventData | null>(null);
  const [error, setError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: "idle" | "success" | "duplicate" | "not_found";
    participant?: Participant;
    message?: string;
  }>({ status: "idle" });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Participant[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [manualCheckInLoading, setManualCheckInLoading] = useState(false);

  const qrScannerRef = useRef<any>(null);
  const scannerId = "qr-reader-container";

  // 1. Passkey Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey.trim()) return;

    setError("");
    setLoginLoading(true);

    try {
      const q = query(
        collection(db, "events"),
        where("accessCode", "==", passkey.trim())
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("ACCESS DENIED: INVALID GATE PASSKEY");
        setLoginLoading(false);
        return;
      }

      const eventDoc = querySnapshot.docs[0];
      const eventData = { id: eventDoc.id, ...eventDoc.data() } as EventData;

      if (eventData.status !== "active") {
        setError("SESSION LOCKED: EVENT IS CURRENTLY PAUSED");
        setLoginLoading(false);
        return;
      }

      // Login success
      setEvent(eventData);
      setIsLoggedIn(true);
      
      // Save passkey in localStorage to keep session on refresh
      localStorage.setItem("dotentry_gate_passkey", passkey.trim());
    } catch (err: any) {
      console.error(err);
      setError("SYSTEM FAULT: DATABASE HANDSHAKE FAILED");
    } finally {
      setLoginLoading(false);
    }
  };

  // Auto-login if session exists
  useEffect(() => {
    const savedPasskey = localStorage.getItem("dotentry_gate_passkey");
    if (savedPasskey) {
      setPasskey(savedPasskey);
      const autoLogin = async () => {
        try {
          const q = query(
            collection(db, "events"),
            where("accessCode", "==", savedPasskey)
          );
          const snap = await getDocs(q);
          if (!snap.empty) {
            const eventDoc = snap.docs[0];
            const eventData = { id: eventDoc.id, ...eventDoc.data() } as EventData;
            if (eventData.status === "active") {
              setEvent(eventData);
              setIsLoggedIn(true);
            }
          }
        } catch (e) {
          console.error("Auto login error", e);
        }
      };
      autoLogin();
    }
  }, []);

  // 2. Real-time Status listener (Kick out if paused)
  useEffect(() => {
    if (!isLoggedIn || !event) return;

    const unsub = onSnapshot(doc(db, "events", event.id), (docSnap) => {
      if (!docSnap.exists()) {
        handleLogout("SYSTEM RESET: EVENT DELETED BY ADMINISTRATOR");
      } else {
        const data = docSnap.data();
        if (data && data.status !== "active") {
          handleLogout("SESSION SUSPENDED: EVENT PAUSED BY ADMINISTRATOR");
        } else if (data) {
          setEvent({ id: docSnap.id, ...data } as EventData);
        }
      }
    });

    return () => unsub();
  }, [isLoggedIn, event?.id]);

  const handleLogout = (message = "") => {
    stopScanner();
    setIsLoggedIn(false);
    setEvent(null);
    localStorage.removeItem("dotentry_gate_passkey");
    setPasskey("");
    if (message) {
      setError(message);
    }
  };

  // 3. QR Scanner Lifecycle
  const startScanner = async () => {
    if (!Html5Qrcode) {
      alert("QR Engine initializing. Wait a moment.");
      return;
    }
    
    setScanResult({ status: "idle" });
    setIsScanning(true);

    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode(scannerId);
        qrScannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 15,
            qrbox: (width: number, height: number) => {
              const size = Math.min(width, height) * 0.75;
              return { width: size, height: size };
            },
          },
          handleScanSuccess,
          (errorMessage: string) => {
            // Silently swallow scanning frame errors to prevent logger floods
          }
        );
      } catch (err) {
        console.error("Scanner start error:", err);
        setError("CAMERA OFFLINE: VERIFY HARDWARE PERMISSIONS");
        setIsScanning(false);
      }
    }, 250);
  };

  const stopScanner = async () => {
    if (qrScannerRef.current) {
      try {
        await qrScannerRef.current.stop();
      } catch (err) {
        console.error("Scanner stop error:", err);
      }
      qrScannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScanSuccess = async (decodedText: string) => {
    await stopScanner();
    if (!event) return;
    
    setScanResult({ status: "idle" });
    try {
      const q = query(
        collection(db, "events", event.id, "participants"),
        where("row_id", "==", decodedText.trim())
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setScanResult({
          status: "not_found",
          message: `UNREGISTERED PASS ID: "${decodedText}"`,
        });
        return;
      }

      const participantDoc = querySnapshot.docs[0];
      const pData = { id: participantDoc.id, ...participantDoc.data() } as Participant;

      if (pData.checkedIn) {
        setScanResult({
          status: "duplicate",
          participant: pData,
          message: `CHECKED-IN AT ${new Date(pData.checkInTime || 0).toLocaleTimeString()}`,
        });
      } else {
        setScanResult({
          status: "success",
          participant: pData,
          message: "VALID CREDENTIALS DETECTED",
        });
      }
    } catch (err: any) {
      console.error(err);
      setScanResult({
        status: "not_found",
        message: "NETWORK TIME-OUT: DATABASE QUERY FAULT",
      });
    }
  };

  // 4. Confirm Check-In action
  const confirmCheckIn = async (participant: Participant) => {
    if (!event || !participant.id) return;
    
    setManualCheckInLoading(true);
    try {
      const participantRef = doc(db, "events", event.id, "participants", participant.id);
      
      await updateDoc(participantRef, {
        checkedIn: true,
        checkInTime: Date.now(),
      });

      const eventRef = doc(db, "events", event.id);
      await updateDoc(eventRef, {
        checkedInCount: increment(1),
      });

      setScanResult({ status: "idle" });
      startScanner(); // Instant loop for fast entry queues
    } catch (err) {
      console.error("Check-in error:", err);
      alert("DB UPDATE FAILED. TRY AGAIN.");
    } finally {
      setManualCheckInLoading(false);
    }
  };

  // 5. Manual Search Handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !event) return;

    setSearchLoading(true);
    try {
      const participantsRef = collection(db, "events", event.id, "participants");
      const q = query(participantsRef);
      const snap = await getDocs(q);
      
      const searchLower = searchQuery.toLowerCase().trim();
      const results: Participant[] = [];

      snap.forEach((doc) => {
        const data = doc.data() as Participant;
        if (
          data.row_id.toString().toLowerCase().includes(searchLower) ||
          data.name.toLowerCase().includes(searchLower)
        ) {
          results.push({ id: doc.id, ...data });
        }
      });

      setSearchResults(results);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
      
      {/* 1. FUTURISTIC TERMINAL LOGIN VIEW */}
      {!isLoggedIn && (
        <div className="w-full max-w-lg flex flex-col gap-6 animate-fade-in">
          <Card className="w-full border-brand-primary/20 bg-navy-950/60 relative overflow-hidden" heavy>
            {/* Cyber accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-brand-accent/50" />
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-brand-accent/50" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-brand-accent/50" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-brand-accent/50" />

            <div className="flex flex-col items-center gap-8 py-4 px-2">
              <Logo size="lg" />
              
              <div className="text-center">
                <h2 className="text-lg font-mono font-black tracking-widest text-brand-accent uppercase glow-text-cyan">
                  VALIDATION GATEWAY
                </h2>
                <p className="text-xs text-text-secondary font-medium tracking-wide mt-1.5 max-w-sm mx-auto">
                  Authorized gate scanner node. Input unique session access passkey.
                </p>
              </div>

              <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
                <div className="relative">
                  <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-accent/40" />
                  <input
                    type="password"
                    placeholder="PASSKEY"
                    id="gate-passkey-field"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    maxLength={12}
                    className="w-full bg-navy-950/80 border border-white/10 rounded-xl py-4.5 pl-12 pr-4 text-center tracking-[0.25em] text-brand-accent font-mono text-xl uppercase font-bold focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/40 focus:outline-none glow-shadow"
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-red-950/40 border border-red-500/25 text-red-400 text-xs font-mono font-bold tracking-wide">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-ping shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" isLoading={loginLoading} className="w-full py-4 text-sm font-mono tracking-widest uppercase">
                  UNLOCK VALIDATOR &rarr;
                </Button>
              </form>
            </div>
          </Card>
          
          <div className="flex flex-col items-center gap-4 text-center">
            {/* Small button to go to Admin UI */}
            <Link href="/admin">
              <span className="inline-flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold text-brand-accent uppercase tracking-widest bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/30 rounded-lg px-3.5 py-1.5 transition-colors cursor-pointer glow-shadow">
                Admin Console
              </span>
            </Link>
            
            {/* Footer with branding only and optimized description */}
            <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-text-muted leading-relaxed">
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
        </div>
      )}

      {/* 2. PREMIUM GATE SCANNER DASHBOARD SCREEN */}
      {isLoggedIn && event && (
        <div className="w-full max-w-5xl flex flex-col gap-6">
          
          {/* Cyber banner header */}
          <Card className="relative border-white/5 bg-navy-950/40 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent" />
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-brand-accent bg-brand-primary/20 border border-brand-primary/30 px-2 py-0.5 rounded-md uppercase tracking-widest">
                  Active Gate node
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h1 className="text-2xl md:text-3xl font-mono font-black text-white mt-2 tracking-tight">
                {event.name}
              </h1>
              <p className="text-xs text-text-secondary mt-1 font-mono">
                PASSKEY:{" "}
                <span 
                  onClick={() => {
                    navigator.clipboard.writeText(event.accessCode);
                    alert(`Passcode "${event.accessCode}" copied to clipboard!`);
                  }}
                  className="text-brand-accent font-bold tracking-wider hover:text-brand-primary cursor-pointer transition-colors"
                  title="Click to copy passcode"
                >
                  {event.accessCode}
                </span>
              </p>
            </div>
            
            <div className="flex items-center gap-5">
              <div className="text-right">
                <span className="text-[10px] font-mono font-bold text-text-secondary uppercase tracking-widest block">
                  Scanned Progress
                </span>
                <div className="text-3xl font-mono font-bold text-brand-accent glow-text-cyan mt-1">
                  {event.checkedInCount} <span className="text-text-muted text-lg">/ {event.participantsCount}</span>
                </div>
                <div className="w-32 bg-navy-800/80 h-2 rounded-full overflow-hidden mt-2 ml-auto border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-brand-primary to-brand-accent h-full transition-all duration-500 ease-out"
                    style={{ width: `${(event.checkedInCount / Math.max(1, event.participantsCount)) * 100}%` }}
                  />
                </div>
              </div>

              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => handleLogout()}
                className="p-3 rounded-xl border-white/10 text-text-secondary hover:text-white"
                aria-label="Logout"
              >
                <LogOut className="h-4.5 w-4.5" />
              </Button>
            </div>
          </Card>

          {/* Core Interactive Scanner Console */}
          {event.checkedInCount >= event.participantsCount && event.participantsCount > 0 ? (
            <Card className="flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden bg-navy-950/60 border-emerald-500/10 glow-shadow-success py-12 px-6 text-center animate-fade-in" heavy>
              <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
              
              <div className="h-20 w-20 bg-emerald-500/10 border border-emerald-500/25 rounded-full flex items-center justify-center text-emerald-400 mb-6 animate-pulse">
                <ShieldCheck className="h-12 w-12" />
              </div>
              
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.25em] font-black bg-emerald-950/80 border border-emerald-500/20 px-4 py-1.5 rounded-full mb-3">
                CHECK-IN COMPLETE
              </span>
              
              <h2 className="text-3xl md:text-4xl font-mono font-black text-white tracking-tight max-w-lg mb-3">
                EVERYONE HAS CHECKED IN!
              </h2>
              
              <p className="text-xs md:text-sm text-text-secondary max-w-md mx-auto leading-relaxed mb-8">
                All <strong className="text-white font-mono">{event.participantsCount}</strong> registered participants have successfully passed validation. The scanner has been paused.
              </p>
              
              <div className="p-4 bg-navy-900/50 border border-white/5 rounded-2xl max-w-sm w-full flex items-center justify-around gap-6">
                <div>
                  <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest block">Scanned</span>
                  <span className="text-2xl font-mono font-bold text-white mt-1 block">{event.checkedInCount}</span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest block">Total Guests</span>
                  <span className="text-2xl font-mono font-bold text-white mt-1 block">{event.participantsCount}</span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest block">Completion</span>
                  <span className="text-2xl font-mono font-bold text-emerald-400 mt-1 block">100%</span>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Box: Cyber Scanning HUD screen */}
              <div className="lg:col-span-7 flex flex-col">
                <Card className="flex-1 flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden bg-navy-950/60 border-white/5 glow-shadow" heavy>
                  
                  {/* 4 Corner targets for camera overlay design */}
                  {isScanning && (
                    <>
                      <div className="absolute top-6 left-6 w-10 h-10 border-l-4 border-t-4 border-brand-accent rounded-tl-lg z-20 pointer-events-none" />
                      <div className="absolute top-6 right-6 w-10 h-10 border-r-4 border-t-4 border-brand-accent rounded-tr-lg z-20 pointer-events-none" />
                      <div className="absolute bottom-6 left-6 w-10 h-10 border-l-4 border-b-4 border-brand-accent rounded-bl-lg z-20 pointer-events-none" />
                      <div className="absolute bottom-6 right-6 w-10 h-10 border-r-4 border-b-4 border-brand-accent rounded-br-lg z-20 pointer-events-none" />
                      
                      {/* Laser line effect */}
                      <div className="absolute left-6 right-6 h-1 bg-brand-accent/70 shadow-[0_0_15px_#00F0FF] animate-scan-line z-20 pointer-events-none" />
                      
                      {/* Floating HUD text */}
                      <div className="absolute bottom-10 left-0 right-0 text-center z-20 pointer-events-none animate-pulse">
                        <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-brand-accent bg-navy-950/80 px-4 py-1.5 rounded-full border border-brand-accent/30">
                          ALIGN TICKET QR IN FRAME
                        </span>
                      </div>
                    </>
                  )}

                  {/* State A: Idle screen */}
                  {!isScanning && scanResult.status === "idle" && (
                    <div className="flex flex-col items-center text-center p-8 gap-5 z-10">
                      <div className="h-20 w-20 bg-brand-primary/10 border border-brand-primary/25 rounded-2xl flex items-center justify-center text-brand-primary glow-glow transition-all duration-300 hover:scale-105">
                        <Camera className="h-10 w-10" />
                      </div>
                      <div>
                        <h3 className="font-mono text-white text-lg font-bold tracking-wider uppercase">QR SCANNER OFFLINE</h3>
                        <p className="text-xs text-text-secondary max-w-[240px] mx-auto mt-2 leading-relaxed">
                          Camera lens is offline. Click button below to mount decoder.
                        </p>
                      </div>
                      <Button onClick={startScanner} className="font-mono text-xs tracking-widest px-6 py-3 uppercase">
                        INITIALIZE SCANNER
                      </Button>
                    </div>
                  )}

                  {/* State B: Scanner running */}
                  {isScanning && (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 z-10 gap-5">
                      <div 
                        id={scannerId} 
                        className="w-full max-w-[340px] aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-inner"
                      />
                      <Button variant="danger" size="sm" onClick={stopScanner} className="font-mono text-xs uppercase tracking-widest px-5 py-2.5">
                        DISABLE CAMERA
                      </Button>
                    </div>
                  )}

                  {/* State C: Validation success card */}
                  {scanResult.status === "success" && scanResult.participant && (
                    <div className="absolute inset-0 bg-navy-950/95 flex flex-col items-center justify-center p-8 text-center z-30 glow-shadow-success animate-fade-in border border-emerald-500/20">
                      <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/35 rounded-full flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
                        <CheckCircle className="h-9 w-9" />
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.25em] font-black bg-emerald-950 border border-emerald-500/30 px-3 py-1 rounded-md mb-2">
                        PASS VERIFIED
                      </span>
                      <h2 className="text-2xl md:text-3xl font-mono font-black text-white tracking-tight mb-1">
                        {scanResult.participant.name}
                      </h2>
                      <p className="text-xs text-text-secondary font-mono tracking-widest uppercase mb-8">
                        TICKET ID: <span className="text-brand-accent">{scanResult.participant.row_id}</span>
                      </p>

                      <div className="flex gap-4 w-full max-w-xs justify-center">
                        <Button variant="secondary" size="sm" onClick={startScanner} className="w-28 font-mono text-xs uppercase">
                          Skip
                        </Button>
                        <Button 
                          variant="success" 
                          size="sm" 
                          isLoading={manualCheckInLoading}
                          onClick={() => confirmCheckIn(scanResult.participant!)}
                          className="w-28 font-mono text-xs uppercase glow-shadow"
                        >
                          Check In
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* State D: Duplicate check-in warnings */}
                  {scanResult.status === "duplicate" && scanResult.participant && (
                    <div className="absolute inset-0 bg-navy-950/95 flex flex-col items-center justify-center p-8 text-center z-30 glow-shadow-warning animate-fade-in border border-yellow-500/20">
                      <div className="h-16 w-16 bg-yellow-500/10 border border-yellow-500/35 rounded-full flex items-center justify-center text-yellow-500 mb-4">
                        <AlertTriangle className="h-9 w-9 text-yellow-500" />
                      </div>
                      <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-[0.2em] font-black bg-yellow-950 border border-yellow-500/30 px-3 py-1 rounded-md mb-2">
                        DUPLICATE CODE
                      </span>
                      <h2 className="text-xl md:text-2xl font-mono font-bold text-white tracking-tight mb-1">
                        {scanResult.participant.name}
                      </h2>
                      <p className="text-xs text-text-secondary font-mono mb-4">
                        ID: <span className="text-brand-accent">{scanResult.participant.row_id}</span>
                      </p>
                      <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-xs font-mono mb-8 max-w-xs leading-relaxed">
                        {scanResult.message}
                      </div>

                      <Button variant="secondary" size="sm" onClick={startScanner} className="w-40 font-mono text-xs uppercase">
                        RESET VALIDATOR
                      </Button>
                    </div>
                  )}

                  {/* State E: Invalid/Not found ticket */}
                  {scanResult.status === "not_found" && (
                    <div className="absolute inset-0 bg-navy-950/95 flex flex-col items-center justify-center p-8 text-center z-30 glow-shadow-danger animate-fade-in border border-red-500/20">
                      <div className="h-16 w-16 bg-red-500/10 border border-red-500/35 rounded-full flex items-center justify-center text-red-500 mb-4">
                        <XCircle className="h-9 w-9" />
                      </div>
                      <span className="text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] font-black bg-red-950 border border-red-500/30 px-3 py-1 rounded-md mb-2">
                        INVALID CREDENTIALS
                      </span>
                      <h2 className="text-lg font-mono font-bold text-white tracking-tight mb-3">
                        TICKET REJECTED
                      </h2>
                      <p className="text-xs text-red-400 max-w-xs mb-8 leading-relaxed font-mono font-bold uppercase tracking-wider">
                        {scanResult.message}
                      </p>

                      <Button variant="secondary" size="sm" onClick={startScanner} className="w-40 font-mono text-xs uppercase">
                        RESET SCANNER
                      </Button>
                    </div>
                  )}
                </Card>
              </div>

              {/* Right Box: Sleek database search console */}
              <div className="lg:col-span-5 flex flex-col">
                <Card className="flex-1 flex flex-col min-h-[420px] bg-navy-950/60 border-white/5" heavy>
                  <h3 className="font-mono text-white text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-5">
                    <Search className="h-4.5 w-4.5 text-brand-accent" />
                    DATABASE CONSOLE
                  </h3>

                  <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        id="scanner-search-field"
                        placeholder="Input Ticket ID or Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-navy-950/80 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white placeholder:text-text-muted focus:ring-1 focus:ring-brand-accent focus:outline-none"
                      />
                    </div>
                    <Button type="submit" size="sm" className="px-4 text-xs font-mono uppercase" isLoading={searchLoading}>
                      QUERY
                    </Button>
                  </form>

                  {/* List of search results or initial placeholder */}
                  <div className="flex-1 overflow-y-auto max-h-[290px] flex flex-col gap-3 pr-1">
                    {searchResults.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-text-muted text-center py-10 gap-2">
                        <Terminal className="h-6 w-6 opacity-30 text-brand-primary" />
                        <p className="text-[10px] font-mono uppercase tracking-wider">Awaiting manual query inputs</p>
                      </div>
                    ) : (
                      searchResults.map((p) => (
                        <div 
                          key={p.id}
                          className="p-3.5 bg-navy-900/40 border border-white/5 rounded-xl flex items-center justify-between text-xs hover:border-brand-primary/30 transition-all duration-200"
                        >
                          <div className="truncate max-w-[170px]">
                            <p className="font-bold text-white truncate">{p.name}</p>
                            <p className="text-[10px] font-mono text-text-secondary mt-1 tracking-wider">
                              TICKET: <span className="text-brand-accent font-bold">{p.row_id}</span>
                            </p>
                          </div>

                          {p.checkedIn ? (
                            <span className="text-[9px] font-mono font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-md uppercase">
                              Checked-In
                            </span>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="success" 
                              className="text-[10px] py-1.5 px-3 font-mono font-bold uppercase tracking-wider glow-shadow"
                              onClick={() => confirmCheckIn(p)}
                            >
                              Verify
                            </Button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
              
            </div>
          )}
          
          {/* Footer for scanner dashboard */}
          <div className="text-center text-[10px] font-mono uppercase tracking-[0.12em] text-text-muted mt-6">
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
      )}
    </div>
  );
}
