# dotentry — Premium Event Entry System

**dotentry** is a high-speed, serverless event validation dashboard and real-time gate scanner portal built with **Next.js 16** (App Router) and **Firebase**. It is designed to provide responsive check-in management and instant ticket verification for large-scale events, optimized for both desktop organizers and mobile gate volunteers.

---

## 1. High-Level Architecture Overview

The system operates as a serverless client-first application that synchronization events and participant records directly with Google Cloud Firestore in real-time. Administrative invitations and notifications are routed through a serverless Next.js API handler backed by secure SMTP servers.

```mermaid
graph TD
    Client[Next.js App / Client Device] -->|Google Sign-In| FirebaseAuth[Firebase Auth]
    Client -->|Real-time Sync & Updates| Firestore[Cloud Firestore]
    Client -->|Uploads Excel Template| NextAPI[Next.js API Route /api/email]
    NextAPI -->|SMTP / Nodemailer| Gmail[hello@dotfreelancer.in]
```

---

## 2. Core Feature Set

### 📱 Gate Scanner Portal (`/`)
* **Passkey Login:** Volunteers enter the designated event passcode (formatted as `DXXXX` e.g., `D8421`) to bind their device to a specific event node.
* **Real-time QR Decoder:** Decodes participant barcodes using the camera stream via `html5-qrcode` overlay with target sweeps.
* **Scan Validation Checks:**
  * **Success:** Triggers success indicators and updates the check-in count in the database.
  * **Duplicate Warning:** Alerts volunteers if a ticket has already been checked in.
  * **Not Found Warning:** Flags unregistered or invalid ticket IDs.
* **Backup Search Panel:** Allows checking in guests manually by filtering the guest registry in real-time.

### 💼 Administration Panel (`/admin`)
* **Event Grid Dashboard:** Lists active event nodes, displaying real-time check-in counts, registration ratios, progress bars, and status triggers (Active/Paused).
* **Excel Guest List Import:** Automatically parses spreadsheets (`.xlsx` / `.xls` / `.csv`) in the browser. Employs chunked writes (500 rows per transaction) to write guest records. Exposes a **Download Sample Excel** template generator dynamically.
* **Bulk Append Guests:** Allows administrators to upload subsequent Excel sheets to append new guests into an existing event, automatically skipping already registered ticket IDs.
* **Access Access Control:** Exposes an admin user database panel to add or revoke standard admin email logins (only accessible by the Super Admin).
* **Excel Report Exporter:** Download real-time logs containing check-in states, validation timestamps, and participant names.

---

## 3. Technology Stack

* **Frontend:** Next.js 16 (App Router), React, TypeScript.
* **Styling:** Tailwind CSS v4.0.0 (utilizing `@theme` configurations in `src/app/globals.css`).
* **Database & Auth:** Firebase Auth (Google Sign-In) and Google Cloud Firestore.
* **Parsing Utilities:** SheetJS (`xlsx`) for client-side workbook generation and reads.
* **Icons:** `lucide-react`.

---

## 4. Setup & Installation

### Prerequisite Environment Configuration
Create a `.env.local` configuration file inside `.webs/entry/`:

```env
# Firebase Client SDK Credentials
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# System SMTP Dispatch (Parents environment copy)
GMAIL_USER=hello@dotfreelancer.in
GMAIL_APP_PASSWORD=your-gmail-app-password
CONTACT_TO_EMAIL=hello@dotfreelancer.in
```

### Installation Commands
Run the following commands to initialize and run the local development server:

```bash
# Install dependencies
npm install

# Start local server
npm run dev

# Compile production bundle
npm run build

# Start production server
npm start
```

---

## 5. Security Policies (`firestore.rules`)

To secure database nodes, configure the following Firestore Security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function getUserEmail() { return request.auth.token.email.lower(); }
    
    function isSuperAdmin() {
      return isAuthenticated() && getUserEmail() == "hello@dotfreelancer.in";
    }
    
    function isAdmin() {
      return isAuthenticated() && (
        isSuperAdmin() || 
        exists(/databases/$(database)/documents/admin_access/$(getUserEmail()))
      );
    }

    match /admin_access/{email} {
      allow read: if isAuthenticated() && (getUserEmail() == email.lower() || isAdmin());
      allow write: if isSuperAdmin();
    }

    match /events/{eventId} {
      allow read, write: if isAdmin();
      allow read: if true; 

      match /participants/{participantId} {
        allow read, write: if isAdmin();
        allow get, update: if true; 
      }
    }
  }
}
```

---
*Developed by **[dotfreelancer.in](https://www.dotfreelancer.in/)***
