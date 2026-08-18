"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateAdminInviteHtml, generateAdminRevokeHtml } from "@/lib/email-template";
import { AdminUser } from "@/types";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { ArrowLeft, UserPlus, Trash2, Calendar, User, ShieldCheck } from "lucide-react";

export default function AccessSettingsPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(true);

  // Form inputs
  const [newEmail, setNewEmail] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Restrict access to Super Admin only
  useEffect(() => {
    if (!loading && (!user || role !== "super-admin")) {
      router.replace("/admin");
    }
  }, [user, role, loading, router]);

  // Subscribe to admin list
  useEffect(() => {
    if (role !== "super-admin") return;

    const q = query(collection(db, "admin_access"), orderBy("addedAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const adminList: AdminUser[] = [];
        snapshot.forEach((doc) => {
          adminList.push(doc.data() as AdminUser);
        });
        setAdmins(adminList);
        setAdminsLoading(false);
      },
      (err) => {
        console.error("Error loading admin list:", err);
        setAdminsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [role]);

  // Grant Access Handler
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const emailFormatted = newEmail.toLowerCase().trim();
    if (!emailFormatted) return;

    if (emailFormatted === "hello@dotfreelancer.in") {
      setError("This email is the hardcoded Super Admin and does not need to be added.");
      return;
    }

    setActionLoading(true);
    try {
      // 1. Write user email record to Firestore
      const docRef = doc(db, "admin_access", emailFormatted);
      await setDoc(docRef, {
        email: emailFormatted,
        addedBy: user?.email || "Super Admin",
        addedAt: Timestamp.now(),
      });

      setSuccess(`Access successfully granted to: ${emailFormatted}`);
      setNewEmail("");

      // 2. Dispatch Invitation Email
      try {
        const appUrl = window.location.origin;
        const emailHtml = generateAdminInviteHtml(emailFormatted, user?.email || "Super Admin", appUrl);
        
        await fetch("/api/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: emailFormatted,
            subject: "dotentry: Administration Access Granted",
            html: emailHtml,
          }),
        });
      } catch (emailErr) {
        console.warn("Failed to send welcome email:", emailErr);
      }
    } catch (err: any) {
      console.error(err);
      setError("Database write failed. Check your security rules.");
    } finally {
      setActionLoading(false);
    }
  };

  // Revoke Access Handler
  const handleRevokeAdmin = async (email: string) => {
    if (!confirm(`Are you sure you want to revoke admin access for "${email}"?\nThey will immediately be locked out of the dashboard.`)) {
      return;
    }

    setError("");
    setSuccess("");
    try {
      // 1. Delete user email record from Firestore
      const docRef = doc(db, "admin_access", email);
      await deleteDoc(docRef);

      setSuccess(`Access successfully revoked for: ${email}`);

      // 2. Dispatch Revocation Warning Email
      try {
        const emailHtml = generateAdminRevokeHtml(email, user?.email || "Super Admin");
        await fetch("/api/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: email,
            subject: "dotentry: Administration Access Revoked",
            html: emailHtml,
          }),
        });
      } catch (emailErr) {
        console.warn("Failed to send revocation email:", emailErr);
      }
    } catch (err) {
      console.error("Revoke error:", err);
      setError("Failed to revoke access. Verify database permissions.");
    }
  };

  if (loading || !user || role !== "super-admin") {
    return null; // Redirecting
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      {/* Back to dashboard */}
      <div className="flex items-center gap-2">
        <Link href="/admin" className="text-text-secondary hover:text-white flex items-center gap-1 text-sm font-semibold transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left side: Add New Admin */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="flex flex-col gap-6" heavy>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-brand-primary glow-glow" />
              <div>
                <h1 className="text-xl font-extrabold text-white">Access Manager</h1>
                <p className="text-xs text-text-secondary mt-0.5">
                  Authorize administrator accounts.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddAdmin} className="flex flex-col gap-4">
              <Input
                label="Admin Email Address"
                placeholder="email@example.com"
                id="admin-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                disabled={actionLoading}
              />

              {error && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/25 text-red-400 text-xs">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/25 text-emerald-400 text-xs">
                  {success}
                </div>
              )}

              <Button type="submit" isLoading={actionLoading} className="w-full flex items-center justify-center gap-1.5 text-sm">
                <UserPlus className="h-4 w-4" />
                Grant Admin Access
              </Button>
            </form>
          </Card>
        </div>

        {/* Right side: Current Admins list */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="flex-1 flex flex-col min-h-[350px]">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-brand-primary" />
              Authorized Administrators ({admins.length})
            </h2>

            {adminsLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : admins.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-text-muted text-sm py-12">
                No standard administrators authorized yet.
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[380px] pr-1">
                {/* Special entry for Super Admin (view-only) */}
                <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl flex items-center justify-between text-sm">
                  <div>
                    <p className="font-bold text-white flex items-center gap-1.5">
                      hello@dotfreelancer.in
                      <span className="text-[9px] font-bold text-brand-accent bg-brand-primary/25 border border-brand-primary/30 px-1.5 py-0.5 rounded uppercase">
                        Super Admin
                      </span>
                    </p>
                    <p className="text-[10px] text-text-muted mt-1 font-mono">
                      System bypass account (hardcoded)
                    </p>
                  </div>
                </div>

                {admins.map((adm) => {
                  const addedDate = adm.addedAt instanceof Timestamp 
                    ? adm.addedAt.toDate().toLocaleDateString()
                    : new Date(adm.addedAt).toLocaleDateString();

                  return (
                    <div 
                      key={adm.email} 
                      className="p-4 bg-navy-900/60 border border-white/5 rounded-xl flex items-center justify-between text-sm hover:border-white/10"
                    >
                      <div className="truncate max-w-[70%]">
                        <p className="font-bold text-white truncate">{adm.email}</p>
                        <div className="flex items-center gap-3 text-[10px] text-text-secondary mt-1 font-mono">
                          <span className="flex items-center gap-0.5">
                            <Calendar className="h-3 w-3" />
                            Added: {addedDate}
                          </span>
                          <span className="truncate">
                            By: {adm.addedBy}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="danger"
                        size="sm"
                        className="py-1.5 px-2 rounded-lg"
                        onClick={() => handleRevokeAdmin(adm.email)}
                        aria-label="Revoke Access"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

      </div>

      {/* Footer for admin settings */}
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
