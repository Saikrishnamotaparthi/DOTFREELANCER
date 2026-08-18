import type { ReactNode } from 'react';

/* ---------------------------------------------------------------
   Shared UI atoms — futuristic micro-components for real product surfaces
   --------------------------------------------------------------- */

function Chip({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'cyan' | 'brass' | 'emerald' | 'faint' }) {
  const toneClass =
    tone === 'cyan'
      ? 'border-cyan/40 bg-cyan/10 text-cyan shadow-[0_0_10px_rgba(0,242,254,0.15)]'
      : tone === 'brass'
      ? 'border-brass/40 bg-brass/10 text-brass'
      : tone === 'emerald'
      ? 'border-emerald/40 bg-emerald/10 text-emerald-400'
      : tone === 'faint'
      ? 'border-line bg-white/5 text-ink-faint'
      : 'border-line-strong bg-surface/60 text-ink-dim';

  return (
    <span className={`rounded-full border px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-wider ${toneClass}`}>
      {children}
    </span>
  );
}

function MiniNav({ brand, tabs, active }: { brand: string; tabs: string[]; active?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line pb-3.5">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_6px_#00f2fe]" />
        <span className="font-display text-[0.88rem] font-bold text-ink">{brand}</span>
      </div>
      <div className="flex gap-2 sm:gap-3">
        {tabs.map((t) => (
          <span
            key={t}
            className={`font-mono text-[0.62rem] uppercase tracking-wider transition-colors px-2 py-0.5 rounded ${
              t === active ? 'bg-cyan/15 text-cyan font-semibold' : 'text-ink-faint'
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
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface/40 px-4 py-3 hover:border-cyan/30 transition-colors">
      <div className="min-w-0">
        <div className="truncate text-[0.85rem] font-medium text-ink">{name}</div>
        <div className="truncate font-mono text-[0.64rem] text-ink-faint">{desc}</div>
      </div>
      <div className="flex flex-none items-center gap-2.5">
        <span className="font-mono text-[0.78rem] text-cyan font-semibold">{price}</span>
        {available ? (
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full border border-cyan/40 bg-cyan/10 text-cyan text-[0.82rem] leading-none hover:bg-cyan hover:text-bg-0 transition-colors"
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
    <div className="overflow-hidden rounded-xl border border-line bg-bg-0/60">
      <div
        className="grid gap-2 border-b border-line bg-white/[0.04] px-4 py-3 font-mono text-[0.62rem] uppercase tracking-wider text-ink-faint"
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
          className="grid items-center gap-2 px-4 py-3 text-[0.78rem] text-ink-dim border-b border-line/40 last:border-b-0 hover:bg-white/[0.02]"
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
  const tone = status === 'Pending' ? 'faint' : status === 'Preparing' ? 'cyan' : status === 'Ready' ? 'brass' : 'emerald';
  return <Chip tone={tone as 'default' | 'cyan' | 'brass' | 'emerald' | 'faint'}>{status}</Chip>;
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-cyan/15 bg-surface/50 p-3.5 text-left">
      <div className="font-mono text-[0.6rem] uppercase tracking-wider text-ink-faint">{label}</div>
      <div className="font-display text-[1.2rem] font-bold text-cyan mt-1">{value}</div>
    </div>
  );
}

function ChartBars({ values }: { values: number[] }) {
  return (
    <div className="flex h-16 items-end gap-2 pt-2">
      {values.map((v, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t transition-all ${
            i === values.length - 1
              ? 'bg-gradient-to-t from-cyan to-signal shadow-[0_0_10px_rgba(0,242,254,0.4)]'
              : 'bg-white/10 hover:bg-white/20'
          }`}
          style={{ height: `${v}%` }}
        />
      ))}
    </div>
  );
}

function QRBlock({ label, status }: { label: string; status?: string }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-cyan/30 bg-surface/50 p-4">
      <div className="grid h-16 w-16 flex-none grid-cols-5 grid-rows-5 gap-[2px] rounded-lg bg-white/10 p-2 shadow-[0_0_15px_rgba(0,242,254,0.15)]" aria-hidden="true">
        {Array.from({ length: 25 }).map((_, i) => (
          <span
            key={i}
            className={`rounded-[1px] ${
              [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24].includes(i)
                ? 'bg-cyan shadow-[0_0_4px_#00f2fe]'
                : 'bg-transparent'
            }`}
          />
        ))}
      </div>
      <div>
        <div className="font-mono text-[0.72rem] tracking-wide text-ink font-semibold">{label}</div>
        {status && <div className="mt-1 text-[0.76rem] font-mono text-emerald-400">● {status}</div>}
      </div>
    </div>
  );
}

function TicketTier({ name, price, seats }: { name: string; price: string; seats: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-line bg-surface/40 px-4 py-3 hover:border-cyan/30 transition-colors">
      <div>
        <div className="text-[0.85rem] font-medium text-ink">{name}</div>
        <div className="font-mono text-[0.62rem] text-ink-faint">{seats}</div>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[0.82rem] font-semibold text-cyan">{price}</span>
        <span className="rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-cyan hover:bg-cyan hover:text-bg-0 transition-colors">
          Select
        </span>
      </div>
    </div>
  );
}

function PaymentState() {
  return (
    <div className="space-y-3.5 rounded-xl border border-line bg-surface/40 p-4">
      <div className="flex items-center justify-between rounded-lg border border-line bg-bg-0/60 px-4 py-3">
        <span className="font-mono text-[0.72rem] tracking-[0.2em] text-cyan">•••• •••• •••• 9012</span>
        <Chip tone="emerald">SECURE UPI / CARD</Chip>
      </div>
      <div className="flex items-center justify-between px-1">
        <span className="font-mono text-[0.66rem] uppercase tracking-wider text-ink-faint">TOTAL AUTHORIZED</span>
        <span className="font-display text-[1.15rem] font-bold text-ink">₹2,400.00</span>
      </div>
      <div className="rounded-xl bg-gradient-to-r from-cyan to-signal px-4 py-3 text-center font-mono text-[0.72rem] font-semibold uppercase tracking-wider text-bg-0 shadow-[0_0_20px_rgba(0,242,254,0.3)]">
        Confirm &amp; Generate Instant QR
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Panel sets, keyed by project id — consumed by InterfaceDeck.
   --------------------------------------------------------------- */

const shell = 'flex flex-col gap-4';

export const projectMocks: Record<string, () => ReactNode[]> = {
  solevault: () => [
    <div className={shell} key="catalog">
      <MiniNav brand="SoleVault Storefront" tabs={['Sneakers', 'Streetwear', 'Cart (2)']} active="Sneakers" />
      <div className="space-y-2.5">
        <FoodItem name="Air Jordan 1 Retro High OG" desc="Chicago Lost &amp; Found · Size UK 9 · Verified Authentic" price="₹16,499" />
        <FoodItem name="Yeezy Boost 350 V2 Carbon" desc="Primeknit Upper · Boost Midsole · In Stock" price="₹22,999" />
      </div>
    </div>,
    <div className={shell} key="logistics">
      <div className="flex items-center justify-between">
        <div className="eyebrow">Delhivery Automated Dispatch</div>
        <Chip tone="emerald">AWB #DEL-984210</Chip>
      </div>
      <div className="rounded-xl border border-cyan/20 bg-surface/50 p-4 space-y-3">
        <div className="flex items-center justify-between text-[0.84rem] text-ink font-mono">
          <span>STATUS: OUT FOR DELIVERY</span>
          <span className="text-cyan font-bold">ETA: TODAY 4:00 PM</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="h-1 flex-1 bg-gradient-to-r from-emerald-400 to-cyan rounded" />
          <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
          <span className="h-1 flex-1 bg-white/10 rounded" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
        </div>
        <div className="flex justify-between font-mono text-[0.6rem] text-ink-faint">
          <span>WAREHOUSE PACKED</span>
          <span>AIR HUB IN-TRANSIT</span>
          <span>DELIVERED</span>
        </div>
      </div>
    </div>,
    <div className={shell} key="inventory">
      <MiniNav brand="Warehouse &amp; Inventory Desk" tabs={['Live Stock', 'Low Alert', 'Suppliers']} active="Live Stock" />
      <DataTable
        columns={['SKU', 'Product', 'Stock', 'Logistics']}
        rows={[
          ['#AJ1-892', 'Air Jordan 1 Retro', '42 Pairs', <StatusBadge key="s1" status="Verified" />],
          ['#YZY-350', 'Yeezy 350 V2', '12 Pairs', <StatusBadge key="s2" status="Ready" />],
          ['#DNK-104', 'Nike Dunk Low Retro', '85 Pairs', <StatusBadge key="s3" status="Paid" />],
        ]}
      />
    </div>,
    <div className={shell} key="admin">
      <MiniNav brand="SoleVault Revenue &amp; Analytics" tabs={['Overview', 'Fulfillment', 'Delhivery']} active="Overview" />
      <div className="grid grid-cols-3 gap-2.5">
        <StatTile label="Today Sales" value="₹3.84L" />
        <StatTile label="Orders" value="184" />
        <StatTile label="Dispatch SLA" value="99.4%" />
      </div>
      <ChartBars values={[40, 60, 55, 75, 90, 88, 98]} />
    </div>,
  ],

  'pro-nights': () => [
    <div className={shell} key="tickets">
      <MiniNav brand="PRAMANA'26 PLATFORM" tabs={['Lineup', 'Passes', 'Scanner']} active="Passes" />
      <div className="space-y-2.5">
        <TicketTier name="Festival Access Pass" price="₹1,200" seats="Day 1–3 · All Stages" />
        <TicketTier name="VIP Front Stage" price="₹2,800" seats="Priority Entry · Lounge Access" />
      </div>
    </div>,
    <div className={shell} key="payment">
      <div className="eyebrow">Instant Gateway Checkout</div>
      <PaymentState />
    </div>,
    <div className={shell} key="qr">
      <div className="eyebrow">Ticket Generated &amp; WhatsApp Synced</div>
      <QRBlock label="Ticket #PRM-8921" status="Verified · Gate Access Granted" />
    </div>,
    <div className={shell} key="dashboard">
      <MiniNav brand="Organizer HUD" tabs={['Overview', 'Live Scans', 'Revenue']} active="Overview" />
      <div className="grid grid-cols-3 gap-2.5">
        <StatTile label="Passes Issued" value="4,820" />
        <StatTile label="Revenue" value="₹58.4L" />
        <StatTile label="Gate Scans" value="3,940" />
      </div>
      <ChartBars values={[35, 50, 45, 70, 85, 92, 98]} />
    </div>,
  ],

  restaurant: () => [
    <div className={shell} key="menu">
      <MiniNav brand="Casa Verde Live System" tabs={['Starters', 'Mains', 'QR Pay']} active="Mains" />
      <div className="space-y-2.5">
        <FoodItem name="Artisanal Truffle Pizza" desc="Fior di latte · fresh truffles · wild mushrooms" price="₹540" />
        <FoodItem name="Handcrafted Gnocchi" desc="Sage butter · aged parmesan crisp" price="₹480" />
      </div>
      <QRBlock label="Scan QR at Table 08 to Order &amp; Pay" />
    </div>,
    <div className={shell} key="orders">
      <MiniNav brand="Kitchen &amp; Admin Desk" tabs={['Active Orders', 'Analytics', 'Menu']} active="Active Orders" />
      <DataTable
        columns={['Order', 'Table', 'Status', 'Total']}
        rows={[
          ['#5021', 'Table 08', <StatusBadge key="s1" status="Preparing" />, '₹1,840'],
          ['#5020', 'Table 14', <StatusBadge key="s2" status="Ready" />, '₹960'],
          ['#5019', 'Delivery', <StatusBadge key="s3" status="Paid" />, '₹2,350'],
        ]}
      />
    </div>,
  ],

  school: () => [
    <div className={shell} key="admissions">
      <MiniNav brand="Greenfield Academy Portal" tabs={['Admissions', 'Academics', 'Fee Desk']} active="Admissions" />
      <div className="space-y-2.5 rounded-xl border border-line bg-surface/40 p-4">
        <div className="font-mono text-[0.62rem] uppercase tracking-wider text-cyan">Admissions 2026–27 Open</div>
        <div className="h-2 w-3/4 rounded bg-white/10" />
        <div className="h-2 w-1/2 rounded bg-white/10" />
        <div className="flex items-center justify-between pt-2">
          <Chip tone="emerald">Application Submitted</Chip>
          <span className="font-mono text-[0.64rem] text-ink-faint">Status: Verified</span>
        </div>
      </div>
    </div>,
    <div className={shell} key="parent">
      <MiniNav brand="Parent &amp; Student Desk" tabs={['Announcements', 'Fees', 'Attendance']} active="Announcements" />
      <div className="space-y-2">
        {['Annual Sports Meet schedule released', 'Q3 Term fee receipt generated automatically', 'Digital report cards published to parent app'].map(
          (n) => (
            <div key={n} className="flex items-center gap-3 rounded-xl border border-line bg-surface/30 px-3.5 py-2.5">
              <span className="h-2 w-2 flex-none rounded-full bg-cyan" />
              <span className="truncate text-[0.82rem] text-ink">{n}</span>
            </div>
          ),
        )}
      </div>
    </div>,
  ],

  'event-management': () => [
    <div className={shell} key="discovery">
      <MiniNav brand="Nexus Legacy Events" tabs={['Concerts', 'Festivals', 'Corporate']} active="Concerts" />
      <div className="space-y-2.5">
        <FoodItem name="Global Tech Conclave 2026" desc="Hitex Arena" price="Passes Live" />
        <FoodItem name="Sunburn Arena Live" desc="Stadium Live Acts" price="From ₹999" />
      </div>
    </div>,
    <div className={shell} key="registration">
      <div className="eyebrow">Enterprise Registration Gateway</div>
      <PaymentState />
    </div>,
    <div className={shell} key="dashboard">
      <MiniNav brand="Organizer Command Center" tabs={['Scans', 'Delegates', 'Analytics']} active="Analytics" />
      <div className="grid grid-cols-3 gap-2.5">
        <StatTile label="Delegates" value="3,400" />
        <StatTile label="Gate Scans" value="2,980" />
        <StatTile label="Revenue" value="₹34.2L" />
      </div>
      <ChartBars values={[30, 48, 52, 68, 75, 82, 94]} />
    </div>,
  ],

  'anvayaa-productions': () => [
    <div className={shell} key="portfolio">
      <MiniNav brand="Anvayaa Productions" tabs={['Weddings', 'Production', 'Celebrity Acts']} active="Weddings" />
      <div className="space-y-2.5">
        <FoodItem name="Heritage Palace Wedding" desc="Jaipur · 1,500 Guests · Royal Floral Decor" price="Completed" />
        <FoodItem name="Lakeside Luxury Ceremony" desc="Udaipur · Drone Light Show · Custom Stage" price="In Production" />
      </div>
    </div>,
    <div className={shell} key="services">
      <div className="eyebrow">Luxury Production Services</div>
      <div className="space-y-2.5">
        <TicketTier name="Architectural Decor &amp; Stage Design" price="Custom" seats="End-to-end venue transformation" />
        <TicketTier name="Artist &amp; Symphony Curation" price="Live Acts" seats="Exclusive talent management" />
      </div>
    </div>,
    <div className={shell} key="dashboard">
      <MiniNav brand="Production Coordinator HUD" tabs={['Vendors', 'Timeline', 'Budget']} active="Timeline" />
      <div className="grid grid-cols-3 gap-2.5">
        <StatTile label="RSVP Count" value="1,450" />
        <StatTile label="Active Crews" value="42" />
        <StatTile label="Milestone" value="95%" />
      </div>
      <ChartBars values={[25, 40, 55, 70, 80, 90, 95]} />
    </div>,
  ],
};
