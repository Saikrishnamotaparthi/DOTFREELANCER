import { Timestamp } from "firebase/firestore";

export interface AdminUser {
  email: string;      // User email address
  addedBy: string;    // Email of Super Admin who added them
  addedAt: Timestamp | number; // Server timestamp when added
}

export interface EventData {
  id: string;
  name: string;              // Name of the event
  date: string;              // ISO Date (YYYY-MM-DD)
  createdAt: number;         // Unix timestamp
  createdBy: string;         // Firebase UID of creator
  passKeySeries: string;     // First 4 characters of passKey (e.g. "P26F")
  accessCode: string;        // Full key to login at the gate (e.g. "P26F1234")
  participantsCount: number; // Total uploaded participants
  checkedInCount: number;    // Number of successfully scanned participants
  status: 'active' | 'paused';
}

export interface Participant {
  id?: string;               // Firestore doc ID
  row_id: string;            // Ticket ID / Excel Row ID (e.g. "101")
  name: string;              // Full name of participant
  checkedIn: boolean;        // Checked-in status
  checkInTime: number | null;// Check-in unix timestamp
  manualEntry: boolean;      // True if added via dashboard, false if Excel
}

export interface ExcelRow {
  row_id: string | number;
  name: string;
}
