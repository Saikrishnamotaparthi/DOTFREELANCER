import type { ReactNode } from 'react';

/* ---------------------------------------------------------------
   Shared UI atoms — small, reusable pieces that make each mockup
   read as a real product surface rather than a wireframe box.
   --------------------------------------------------------------- */

function Chip({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'brass' | 'faint' }) {
  const toneClass =
    tone === 'brass'
      ? 'border-brass/50 text-brass'
      : tone === 'faint'
        ? 'border-line text-ink-faint'
        : 'border-line-strong text-ink-dim';
  return (
    <span className={`rounded-full border px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wide ${toneClass}`}>
      {children}
    </span>
  );
}

function MiniNav({ brand, tabs, active }: { brand: string; tabs: string[]; active?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line pb-3">
      <div className="font-display text-[0.82rem] font-semibold">{brand}</div>
      <div className="hidden gap-3 sm:flex">
        {tabs.map((t) => (
          <span
            key={t}
            className={`font-mono text-[0.6rem] uppercase tracking-wide ${
              t === active ? 'text-brass' : 'text-ink-faint'
            }`}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function FoodItem({
  name,
  desc,
  price,
  available = true,
}: {
  name: string;
  desc: string;
  price: string;
  available?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-line px-3.5 py-3">
      <div className="min-w-0">
        <div className="truncate text-[0.82rem] text-ink">{name}</div>
        <div className="truncate font-mono text-[0.62rem] text-ink-faint">{desc}</div>
      </div>
      <div className="flex flex-none items-center gap-2.5">
        <span className="font-mono text-[0.74rem] text-ink-dim">{price}</span>
        {available ? (
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full border border-line-strong text-[0.8rem] leading-none text-ink transition-colors"
            aria-hidden="true"
          >
            +
          </span>
        ) : (
          <Chip tone="faint">Sold out</Chip>
        )}
      </div>
    </div>
  );
}

function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: (string | ReactNode)[][];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <div
        className="grid gap-2 border-b border-line bg-white/[0.03] px-3.5 py-2.5 font-mono text-[0.6rem] uppercase tracking-wide text-ink-faint"
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0,1fr))` }}
      >
        {columns.map((c) => (
          <span key={c} className="truncate">
            {c}
          </span>
        ))}
      </div>
      {rows.map((row, ri) => (
        <div
          key={ri}
          className="grid items-center gap-2 px-3.5 py-2.5 text-[0.74rem] text-ink-dim"
          style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0,1fr))` }}
        >
          {row.map((cell, ci) => (
            <span key={ci} className="truncate">
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: 'Paid' | 'Preparing' | 'Ready' | 'Pending' | 'Verified' }) {
  const tone = status === 'Pending' ? 'faint' : status === 'Preparing' ? 'default' : 'brass';
  return <Chip tone={tone as 'default' | 'brass' | 'faint'}>{status}</Chip>;
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line px-3.5 py-3">
      <div className="font-display text-[1.1rem] font-semibold">{value}</div>
      <div className="mt-1 font-mono text-[0.58rem] uppercase tracking-wide text-ink-faint">{label}</div>
    </div>
  );
}

function ChartBars({ values }: { values: number[] }) {
  return (
    <div className="flex h-16 items-end gap-1.5">
      {values.map((v, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t ${i === values.length - 1 ? 'bg-brass/50' : 'bg-white/8'}`}
          style={{ height: `${v}%` }}
        />
      ))}
    </div>
  );
}

function QRBlock({ label, status }: { label: string; status?: string }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-line px-4 py-3.5">
      <div className="grid h-14 w-14 flex-none grid-cols-5 grid-rows-5 gap-[2px] rounded bg-white/5 p-1.5" aria-hidden="true">
        {Array.from({ length: 25 }).map((_, i) => (
          <span key={i} className={`rounded-[1px] ${[0, 3, 4, 6, 8, 12, 14, 16, 18, 20, 23].includes(i) ? 'bg-ink' : 'bg-transparent'}`} />
        ))}
      </div>
      <div>
        <div className="font-mono text-[0.68rem] tracking-wide text-ink-dim">{label}</div>
        {status && <div className="mt-1 text-[0.78rem] text-brass">{status}</div>}
      </div>
    </div>
  );
}

function TicketTier({ name, price, seats }: { name: string; price: string; seats: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-line px-3.5 py-3">
      <div>
        <div className="text-[0.82rem] text-ink">{name}</div>
        <div className="font-mono text-[0.6rem] text-ink-faint">{seats}</div>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[0.78rem] text-ink-dim">{price}</span>
        <span className="rounded-full border border-line-strong px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-wide text-ink">
          Select
        </span>
      </div>
    </div>
  );
}

function PaymentState() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg border border-line px-3.5 py-3">
        <span className="font-mono text-[0.7rem] tracking-[0.15em] text-ink-dim">•••• •••• •••• 4821</span>
        <Chip tone="faint">VISA</Chip>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[0.62rem] uppercase tracking-wide text-ink-faint">Total</span>
        <span className="font-display text-[1.05rem] font-semibold">₹2,400.00</span>
      </div>
      <div className="rounded-full bg-ink px-4 py-2.5 text-center font-mono text-[0.68rem] uppercase tracking-wide text-[#0a0a0a]">
        Confirm payment
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Panel sets, keyed by project id — consumed by InterfaceDeck.
   --------------------------------------------------------------- */

const shell = 'flex flex-col gap-4';

export const projectMocks: Record<string, () => ReactNode[]> = {
  'pro-nights': () => [
    <div className={shell} key="tickets">
      <MiniNav brand="Pro Nights" tabs={['Lineup', 'Tickets', 'Venue']} active="Tickets" />
      <div className="space-y-2.5">
        <TicketTier name="Night pass" price="₹1,200" seats="Day 1 · GA" />
        <TicketTier name="Weekend pass" price="₹2,400" seats="Day 1–3 · GA" />
        <TicketTier name="VIP pass" price="₹4,800" seats="Day 1–3 · Front stage" />
      </div>
    </div>,
    <div className={shell} key="payment">
      <div className="eyebrow">Checkout</div>
      <PaymentState />
    </div>,
    <div className={shell} key="qr">
      <div className="eyebrow">Payment success</div>
      <QRBlock label="Ticket #PN-48213" status="Valid · Weekend pass" />
    </div>,
    <div className={shell} key="dashboard">
      <MiniNav brand="Organizer" tabs={['Overview', 'Scans', 'Payouts']} active="Overview" />
      <div className="grid grid-cols-3 gap-2.5">
        <StatTile label="Tickets sold" value="3,214" />
        <StatTile label="Revenue" value="₹41.2L" />
        <StatTile label="Check-ins" value="1,890" />
      </div>
      <ChartBars values={[40, 55, 48, 70, 65, 90, 78]} />
    </div>,
  ],

  restaurant: () => [
    <div className={shell} key="menu">
      <MiniNav brand="Casa Verde" tabs={['Starters', 'Mains', 'Desserts']} active="Mains" />
      <div className="space-y-2.5">
        <FoodItem name="Wood-fired margherita" desc="San marzano · basil · fior di latte" price="₹420" />
        <FoodItem name="Truffle mushroom risotto" desc="Arborio · parmesan · truffle oil" price="₹540" />
        <FoodItem name="Grilled seabass" desc="Lemon butter · charred greens" price="₹690" available={false} />
      </div>
      <QRBlock label="Scan to order at table 12" />
    </div>,
    <div className={shell} key="orders">
      <MiniNav brand="Admin" tabs={['Menu', 'Orders', 'Reports']} active="Orders" />
      <DataTable
        columns={['Order', 'Customer', 'Items', 'Status', 'Amount']}
        rows={[
          ['#4821', 'Table 12', '3 items', <StatusBadge key="s1" status="Preparing" />, '₹1,650'],
          ['#4820', 'Table 07', '2 items', <StatusBadge key="s2" status="Ready" />, '₹960'],
          ['#4819', 'Takeaway', '5 items', <StatusBadge key="s3" status="Paid" />, '₹2,310'],
        ]}
      />
    </div>,
  ],

  school: () => [
    <div className={shell} key="admissions">
      <MiniNav brand="Greenfield School" tabs={['Admissions', 'Academics', 'Gallery']} active="Admissions" />
      <div className="space-y-2.5 rounded-lg border border-line p-3.5">
        <div className="font-mono text-[0.6rem] uppercase tracking-wide text-ink-faint">Application — Grade 6</div>
        <div className="h-2 w-3/4 rounded bg-white/8" />
        <div className="h-2 w-1/2 rounded bg-white/8" />
        <div className="flex items-center justify-between pt-1">
          <Chip tone="brass">Applications open</Chip>
          <span className="font-mono text-[0.62rem] text-ink-faint">Closes 30 Sep</span>
        </div>
      </div>
    </div>,
    <div className={shell} key="parent">
      <MiniNav brand="Parent portal" tabs={['Announcements', 'Gallery', 'Fees']} active="Announcements" />
      <div className="space-y-2">
        {['Sports day rescheduled to Friday', 'Term 2 fee window now open', 'New library wing photos added'].map(
          (n) => (
            <div key={n} className="flex items-center gap-2.5 rounded-lg border border-line px-3.5 py-2.5">
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-brass" />
              <span className="truncate text-[0.76rem] text-ink-dim">{n}</span>
            </div>
          ),
        )}
      </div>
      <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-square rounded bg-white/6" />
        ))}
      </div>
    </div>,
  ],

  'event-management': () => [
    <div className={shell} key="discovery">
      <MiniNav brand="Eventful" tabs={['Discover', 'My tickets', 'Host']} active="Discover" />
      <div className="space-y-2.5">
        <FoodItem name="Indie Music Fest" desc="Sat, 14 Nov · Open air arena" price="From ₹599" />
        <FoodItem name="Startup Founders Meetup" desc="Thu, 19 Nov · Tech park" price="Free" />
      </div>
    </div>,
    <div className={shell} key="registration">
      <div className="eyebrow">Registration</div>
      <PaymentState />
    </div>,
    <div className={shell} key="entry">
      <div className="eyebrow">Entry scan</div>
      <QRBlock label="Attendee #EV-11029" status="Verified · Gate B" />
    </div>,
    <div className={shell} key="dashboard">
      <MiniNav brand="Host dashboard" tabs={['Overview', 'Attendees', 'Analytics']} active="Analytics" />
      <div className="grid grid-cols-3 gap-2.5">
        <StatTile label="Registered" value="1,402" />
        <StatTile label="Checked in" value="980" />
        <StatTile label="Revenue" value="₹8.4L" />
      </div>
      <ChartBars values={[30, 48, 42, 60, 75, 68, 88]} />
    </div>,
  ],
};
