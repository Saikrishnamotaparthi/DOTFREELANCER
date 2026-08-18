"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, getDocs, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { EventData } from "@/types";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { PlusCircle, Settings, Play, Pause, Trash2, Calendar, Users, LogOut, ShieldAlert, Key, Globe, Terminal } from "lucide-react";

export default function AdminLandingPage() {
  const { user, role, loading, loginWithGoogle, logout } = useAuth();
  const [events, setEvents] = useState<EventData[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Subscribe to events
  useEffect(() => {
    if (role === "none") return;

    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const eventsList: EventData[] = [];
        snapshot.forEach((doc) => {
          eventsList.push({ id: doc.id, ...doc.data() } as EventData);
        });
        setEvents(eventsList);
        setEventsLoading(false);
      },
      (error) => {
        console.error("Error loading events:", error);
        setEventsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [role]);

  // Pause / Resume Event Status Toggler
  const toggleEventStatus = async (eventId: string, currentStatus: "active" | "paused") => {
    setActionLoading(eventId);
    try {
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        status: currentStatus === "active" ? "paused" : "active",
      });
    } catch (err) {
      console.error("Error updating event status:", err);
      alert("Failed to update status.");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Event Handler (Cascading delete of event doc and participants)
  const handleDeleteEvent = async (eventId: string, eventName: string) => {
    if (!confirm(`Are you absolutely sure you want to delete the event "${eventName}"?\nThis will permanently delete all registered participants and scan records!`)) {
      return;
    }

    setActionLoading(eventId);
    try {
      const participantsRef = collection(db, "events", eventId, "participants");
      const participantsSnap = await getDocs(participantsRef);
      
      const batch = writeBatch(db);
      participantsSnap.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      await deleteDoc(doc(db, "events", eventId));
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono font-bold tracking-wider text-brand-accent uppercase glow-text-cyan">HANDSHAKING PRIVILEGES...</p>
        </div>
      </div>
    );
  }

  // Denied Access View
  if (role === "none" && user) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg border-red-500/20 bg-navy-950/60 relative overflow-hidden" heavy>
          {/* Cyber accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-red-500/50" />
          <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-red-500/50" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-red-500/50" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-red-500/50" />

          <div className="flex flex-col items-center text-center gap-6 p-4">
            <div className="h-16 w-16 bg-red-500/10 border border-red-500/25 text-red-500 rounded-full flex items-center justify-center animate-pulse">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-xl font-mono font-bold text-red-400 uppercase tracking-widest">ACCESS DENIED</h1>
              <p className="text-xs text-text-secondary mt-3 leading-relaxed max-w-sm mx-auto">
                User <span className="text-white font-mono font-semibold">{user.email}</span> is not registered in the authorized admin database. Contact a Super Admin to request credentials.
              </p>
            </div>
            <Button variant="secondary" onClick={() => logout()} className="w-full flex items-center justify-center gap-2 font-mono text-xs uppercase py-3">
              <LogOut className="h-4 w-4" />
              Sign Out & Swap Account
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Google Login view (not logged in)
  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg border-brand-primary/20 bg-navy-950/60 relative overflow-hidden" heavy>
          {/* Cyber accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-brand-primary/50" />
          <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-brand-primary/50" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-brand-primary/50" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-brand-primary/50" />

          <div className="flex flex-col items-center text-center gap-8 py-4 px-2">
            <Logo size="lg" />
            <div>
              <h1 className="text-lg font-mono font-bold text-brand-accent uppercase tracking-widest glow-text-cyan">
                ADMIN CONSOLE LOGIN
              </h1>
              <p className="text-xs text-text-secondary mt-1.5 max-w-xs mx-auto">
                Enter dashboard using your authorized administrator Google Account.
              </p>
            </div>
            
            <Button onClick={loginWithGoogle} className="w-full py-4 font-mono text-xs tracking-widest uppercase">
              Authenticate via Google
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Dashboard Panel
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-8">
      
      {/* Top Banner Control Panel */}
      <Card className="relative border-white/5 bg-navy-950/40 backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden" heavy>
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent" />
        
        <div className="flex items-center gap-4">
          <Logo size="md" />
          <div className="h-10 w-px bg-white/10 hidden lg:block" />
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white font-mono uppercase">ADMINISTRATION PANEL</h1>
            <p className="text-xs text-text-secondary mt-1 font-mono">
              NODE ID: <span className="text-brand-accent font-semibold">{user.email}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {role === "super-admin" && (
            <Link href="/admin/settings">
              <Button variant="secondary" size="sm" className="flex items-center gap-2 font-mono text-xs uppercase py-2">
                <Settings className="h-4 w-4 text-brand-accent" />
                Access settings
              </Button>
            </Link>
          )}
          
          <Link href="/admin/create">
            <Button size="sm" className="flex items-center gap-2 font-mono text-xs uppercase py-2">
              <PlusCircle className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" size="sm" className="flex items-center gap-2 font-mono text-xs uppercase py-2">
              <Globe className="h-4 w-4" />
              Scanner Portal
            </Button>
          </Link>

          <Button variant="secondary" size="sm" onClick={() => logout()} className="p-2.5 rounded-lg border-white/10 text-text-secondary hover:text-white" aria-label="Sign Out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Events Listing */}
      <div className="flex flex-col gap-5">
        <h2 className="text-base font-mono font-bold tracking-widest text-white uppercase flex items-center gap-2">
          <Terminal className="h-4.5 w-4.5 text-brand-primary" />
          MANAGED EVENT ARCHIVES ({events.length})
        </h2>

        {eventsLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <Card className="text-center py-20 border-white/5 bg-navy-950/40 flex flex-col items-center gap-5">
            <p className="text-sm font-mono text-text-secondary">NO ACTIVE EVENT NODES FOUND IN DATABASE.</p>
            <Link href="/admin/create">
              <Button className="font-mono text-xs uppercase tracking-widest">Publish New Node</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((e) => {
              const percentCheckedIn = Math.round(
                (e.checkedInCount / Math.max(1, e.participantsCount)) * 100
              );
              
              return (
                <Card key={e.id} className="relative flex flex-col justify-between min-h-[240px] border-white/5 bg-navy-950/40 hover:bg-navy-950/65 group overflow-hidden">
                  
                  {/* Glowing background card element */}
                  <div className="absolute top-[-50%] left-[-50%] w-full h-full rounded-full bg-brand-primary/5 blur-[80px] pointer-events-none group-hover:bg-brand-primary/10 transition-all duration-300" />
                  
                  {/* Status Indicator Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase border border-white/10 bg-navy-950/90 shadow-sm">
                    <span 
                      className={`h-2 w-2 rounded-full ${
                        e.status === "active" ? "bg-emerald-500 animate-pulse glow-shadow-success" : "bg-yellow-500"
                      }`}
                    />
                    <span className={e.status === "active" ? "text-emerald-400" : "text-yellow-400"}>
                      {e.status}
                    </span>
                  </div>

                  {/* Header info */}
                  <div className="mb-6 relative z-10">
                    <Link href={`/admin/${e.id}`} className="group-hover:text-brand-accent transition-colors">
                      <h3 className="text-lg font-mono font-black text-white leading-snug tracking-tight max-w-[70%] truncate">
                        {e.name}
                      </h3>
                    </Link>
                    
                    <div className="flex flex-col gap-1.5 text-[11px] text-text-secondary mt-3 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-text-muted" />
                        DATE: <span className="text-white font-semibold">{e.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Key className="h-3.5 w-3.5 text-text-muted" />
                        GATE ACCESS:{" "}
                        <span 
                          onClick={() => {
                            navigator.clipboard.writeText(e.accessCode);
                            alert(`Passcode "${e.accessCode}" copied to clipboard!`);
                          }}
                          className="text-brand-accent font-semibold tracking-wider hover:text-brand-primary cursor-pointer transition-colors"
                          title="Click to copy passcode"
                        >
                          {e.accessCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Analytics Stats */}
                  <div className="mb-6 relative z-10">
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold text-text-secondary mb-2">
                      <span className="flex items-center gap-1 uppercase tracking-widest">
                        <Users className="h-3.5 w-3.5 text-text-muted" />
                        Check-ins
                      </span>
                      <span className="text-brand-accent font-black">{percentCheckedIn}%</span>
                    </div>

                    <div className="w-full bg-navy-900/80 h-2 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className={`h-full transition-all duration-500 ease-out ${
                          e.status === "active" ? "bg-gradient-to-r from-brand-primary to-brand-accent" : "bg-yellow-500"
                        }`}
                        style={{ width: `${percentCheckedIn}%` }}
                      />
                    </div>
                    
                    <p className="text-[10px] text-text-muted mt-2 font-mono uppercase tracking-wider">
                      Validated: {e.checkedInCount} / {e.participantsCount} registers
                    </p>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto relative z-10">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="py-1.5 px-3 text-[10px] font-mono uppercase flex items-center gap-1.5"
                        disabled={actionLoading === e.id}
                        onClick={() => toggleEventStatus(e.id, e.status)}
                      >
                        {e.status === "active" ? (
                          <>
                            <Pause className="h-3 w-3 text-yellow-400" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 text-emerald-400" />
                            Resume
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="danger"
                        size="sm"
                        className="py-2 px-2.5 rounded-lg border-white/5"
                        disabled={actionLoading === e.id}
                        onClick={() => handleDeleteEvent(e.id, e.name)}
                        aria-label="Delete Event"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <Link href={`/admin/${e.id}`}>
                      <span className="text-[10px] font-mono font-bold text-brand-accent tracking-widest uppercase hover:underline cursor-pointer">
                        ANALYTICS &rarr;
                      </span>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer for admin landing */}
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
