import React, { useState, useEffect, useRef } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import {
  AppHeader,
  AppName,
  AppMenu,
  CXoneLogo,
  AiPanel,
  NotificationsBell,
  AgentNotifications,
  AgentProfile,
  Container,
  Panel,
  PageHeader,
  Button,
  Input,
  LeftNav,
  AddChannel,
  Tag,
  Accordion,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  SortableTableHead,
  Icon,
  Divider,
  Popover,
  RadioGroup,
  RadioGroupItem,
  DateRangePicker,
  filterChipVariants,
  type NavItem,
  type SortDirection,
  type DateRange,
  type AddChannelItem,
  type AgentStatus,
  type AppMenuGroup,
  type AgentNotification,
  type DraggableVariant,
} from "@nicecxone/lyra-ui";
import appIcon from "@/assets/app-icon.svg";
import {
  Home,
  Users,
  BookUser,
  CalendarDays,
  Settings,
  Plus,
  Phone,
  Mail,
  MessageSquare,
  MessageCircle,
  Clock,
  ArrowDown,
  ArrowUp,
  MoreVertical,
  TrendingUp,
  CheckCircle2,
  CircleDot,
  MinusCircle,
  Gauge,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

/* ── App menu builder (needs onNavigate so built inside the component) ── */

function buildAppMenuGroups(onNavigate?: (page: Page) => void): AppMenuGroup[] {
  return [
    {
      items: [
        { label: "Agent Next Gen", active: true },
        { label: "Agent Workspace Premium", onClick: () => onNavigate?.("agent-workspace") },
        { label: "Outbound Engagement", onClick: () => onNavigate?.("outbound") },
        { label: "Login", onClick: () => onNavigate?.("login") },
      ],
    },
  ];
}

/* ── Add channel items ── */

const ADD_CHANNEL_ITEMS: AddChannelItem[] = [
  { label: "Call",     icon: <Phone          className="h-5 w-5" strokeWidth={1.5} /> },
  { label: "Email",    icon: <Mail           className="h-5 w-5" strokeWidth={1.5} /> },
  { label: "SMS",      icon: <MessageSquare  className="h-5 w-5" strokeWidth={1.5} /> },
  { label: "WhatsApp", icon: <MessageCircle  className="h-5 w-5" strokeWidth={1.5} /> },
];

/* ── Left nav items ── */

const NAV_ITEMS: NavItem[] = [
  {
    icon: <Home className="h-4 w-4" strokeWidth={1.5} />,
    label: "Home",
    active: true,
  },
  {
    icon: <Users className="h-4 w-4" strokeWidth={1.5} />,
    label: "Contacts",
  },
  {
    icon: <BookUser className="h-4 w-4" strokeWidth={1.5} />,
    label: "Directory",
  },
  {
    icon: <CalendarDays className="h-4 w-4" strokeWidth={1.5} />,
    label: "Schedule",
  },
  {
    icon: <Settings className="h-4 w-4" strokeWidth={1.5} />,
    label: "Settings",
  },
];

/* ── Sample notifications ── */

const INITIAL_NOTIFICATIONS: AgentNotification[] = [
  { id: "1", type: "new-case",    title: "New Case",    subtitle: "Noah Patel",    timestamp: "13m ago", read: false },
  { id: "2", type: "new-chat",    title: "New Chat",    subtitle: "Sarah Miller",  timestamp: "18m ago", read: false },
  { id: "3", type: "escalation",  title: "Escalation",  subtitle: "Lauren Kim",    timestamp: "24m ago", read: false },
  { id: "4", type: "new-case",    title: "New Case",    subtitle: "Ethan Zhang",   timestamp: "37m ago", read: true  },
  { id: "5", type: "new-chat",    title: "New Chat",    subtitle: "Olivia Reed",   timestamp: "51m ago", read: true  },
  { id: "6", type: "missed-call", title: "Missed Call", subtitle: "David Brown",   timestamp: "1h ago",  read: true  },
];

/* ── Sample latest contacts ── */

interface ContactInteraction {
  id: string;
  direction: "inbound" | "outbound";
  channel: "email" | "chat";
  timestamp: string;
  agent: string;
  status: "Closed";
  queue: string;
  skill: string;
}

interface LatestContact {
  id: string;
  name: string;
  status: "open" | "pending" | "closed";
  description: string;
  channel: string;
  wait: string;
  caseId: string;
  interactions: ContactInteraction[];
}

/* Sample interaction-history rows, cycled per contact so each accordion's
   interior table has a few realistic-looking prior interactions */
const INTERACTION_AGENTS = ["Kevin Jensen", "Andres Arenas", "KrishnaCharan Mohanrao", "Srinivas Swargam", "Erwin de Vera", "Tim O'Connor", "Josh Robertson"];
const INTERACTION_SOURCES: { channel: ContactInteraction["channel"]; queue: string; skill: string }[] = [
  { channel: "email", queue: "CXi SME Email", skill: "Email_General" },
  { channel: "chat",  queue: "Chat_General",  skill: "Chat_General" },
];

function buildInteractions(seed: number): ContactInteraction[] {
  return Array.from({ length: 3 }, (_, i) => {
    const source = INTERACTION_SOURCES[(seed + i) % INTERACTION_SOURCES.length];
    const day = 5 + ((seed + i) % 4);
    const hour24 = 11 + ((seed * 2 + i * 3) % 8);
    const minute = (seed * 7 + i * 13) % 60;
    const isPM = hour24 >= 12;
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    return {
      id: `${seed}-${i}`,
      direction: i % 2 === 0 ? "inbound" : "outbound",
      channel: source.channel,
      timestamp: `09/0${day}/25 ${hour12}:${String(minute).padStart(2, "0")} ${isPM ? "PM" : "AM"}`,
      agent: INTERACTION_AGENTS[(seed + i) % INTERACTION_AGENTS.length],
      status: "Closed",
      queue: source.queue,
      skill: source.skill,
    };
  });
}

const LATEST_CONTACTS: LatestContact[] = [
  { id: "1", name: "Lily Chen",          status: "open", description: "Unaccompanied minor (age 11) stuck at ORD — connecting flight canceled",              channel: "Atlas",        wait: "1m",  caseId: "CST-21009", interactions: buildInteractions(1) },
  { id: "2", name: "Amara Okafor",       status: "open", description: "Pregnant traveler (32 weeks) — needs medical clearance and accommodation",             channel: "Atlas",        wait: "3m",  caseId: "CST-21016", interactions: buildInteractions(2) },
  { id: "3", name: "Priya Sharma-Patel", status: "open", description: "Pediatric nurse — must reach children's hospital for emergency shift coverage",        channel: "Atlas",        wait: "2m",  caseId: "CST-21028", interactions: buildInteractions(3) },
  { id: "4", name: "Alex Sanderson",     status: "open", description: "Mechanical delay on VY-4450 — LHR→FCO connection at risk, partner upgrade exceeds auth threshold", channel: "Emily", wait: "3m",  caseId: "CST-15001", interactions: buildInteractions(4) },
  { id: "5", name: "Rachel Nguyen",      status: "open", description: "Family of 4 with infant — connecting flight MSP→ORD canceled",                         channel: "Atlas",        wait: "12m", caseId: "CST-21001", interactions: buildInteractions(5) },
  { id: "6", name: "Richard Takahashi",  status: "open", description: "Executive missing board meeting in NYC — needs earliest possible rebooking",           channel: "Rebooking Bot", wait: "6m",  caseId: "CST-21004", interactions: buildInteractions(6) },
  { id: "7", name: "Fatima Al-Rashidi",  status: "open", description: "Business traveler — critical client presentation in Dallas tomorrow",                  channel: "Rebooking Bot", wait: "15m", caseId: "CST-21012", interactions: buildInteractions(7) },
];

/* ── Home screen summary cards ── */

interface SummaryCard {
  id: string;
  title: string;
  icon: LucideIcon;
  iconBackground: "active" | "success" | "info";
  showDateFilter?: boolean;
  rows: { label: string; value: string; valueClassName?: string }[];
  footerLabel: string;
  footerPrimary: string;
  footerSecondary?: string;
  footerSecondaryClassName?: string;
}

const SUMMARY_CARDS: SummaryCard[] = [
  {
    id: "schedule",
    title: "Schedule",
    icon: CalendarDays,
    iconBackground: "active",
    rows: [
      { label: "Total Events", value: "6" },
      { label: "Callbacks", value: "3", valueClassName: "text-lyra-status-warning-strong" },
    ],
    footerLabel: "Next up:",
    footerPrimary: "Customer Callback",
    footerSecondary: "09:00 AM",
  },
  {
    id: "performance",
    title: "Performance",
    icon: TrendingUp,
    iconBackground: "success",
    showDateFilter: true,
    rows: [
      { label: "Cases Resolved", value: "12" },
      { label: "CSAT Score", value: "4.8", valueClassName: "text-lyra-status-success-strong" },
    ],
    footerLabel: "Handle Time:",
    footerPrimary: "8m 32s",
    footerSecondary: "15% improvement",
    footerSecondaryClassName: "text-lyra-status-success-strong",
  },
];

/* ── Productivity breakdown card (agent state duration bars + date filter chip) ──
   Replaces the third summary card slot — same Container/header styling as the
   Schedule/Performance stat cards (no Table), with a FilterChip (search + Select
   All + checkbox options) for the date filter in the header. Each agent state
   (Available/Working/Unavailable) shows the agent's own duration bar + time,
   plus a lighter "Team" comparison bar + time beneath it. */

interface ProductivityStatusRow {
  id: string;
  label: string;
  icon: LucideIcon;
  iconColorClassName: string;
  percent: number;
  teamPercent: number;
  time: string;
  teamTime: string;
}

const PRODUCTIVITY_STATUS_ROWS: ProductivityStatusRow[] = [
  {
    id: "available",
    label: "Available",
    icon: CheckCircle2,
    iconColorClassName: "text-lyra-status-success-strong",
    percent: 0,
    teamPercent: 0,
    time: "00:00:00",
    teamTime: "00:00:00",
  },
  {
    id: "working",
    label: "Working",
    icon: CircleDot,
    iconColorClassName: "text-lyra-status-warning-strong",
    percent: 0,
    teamPercent: 0,
    time: "00:00:00",
    teamTime: "00:00:00",
  },
  {
    id: "unavailable",
    label: "Unavailable",
    icon: MinusCircle,
    iconColorClassName: "text-lyra-status-critical-strong",
    percent: 100,
    teamPercent: 100,
    time: "08:00:00",
    teamTime: "08:00:00",
  },
];

type DateFilterValue = "today" | "yesterday" | "last7" | "custom";

const DATE_FILTER_OPTIONS: { value: DateFilterValue; label: string }[] = [
  { value: "today",     label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7",     label: "Last 7 days" },
  { value: "custom",    label: "Custom" },
];

/* Single-select date filter chip — same trigger styling as FilterChip's
   "active" variant (via the exported filterChipVariants), but a RadioGroup
   (not checkboxes) in the popover since only one range can be selected at a
   time. Selecting "Custom" reveals a DateRangePicker beneath the radio list. */
function DateFilterChip() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<DateFilterValue>("today");
  const [customRange, setCustomRange] = useState<DateRange | undefined>(undefined);

  const selectedLabel = DATE_FILTER_OPTIONS.find((o) => o.value === value)?.label ?? "";

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      placement="bottom"
      content={
        <div className="flex flex-col gap-3 p-3 w-[260px]">
          <RadioGroup value={value} onValueChange={(v) => setValue(v as DateFilterValue)}>
            {DATE_FILTER_OPTIONS.map((option) => (
              <RadioGroupItem key={option.value} value={option.value} label={option.label} />
            ))}
          </RadioGroup>
          {value === "custom" && (
            <DateRangePicker
              value={customRange}
              onChange={setCustomRange}
              placeholder="Select date range"
            />
          )}
        </div>
      }
    >
      <button type="button" className={cn(filterChipVariants({ variant: "active" }), "rounded-lyra-md")}>
        <span className="inline-flex items-baseline gap-1">
          <span className="lyra-body-md-emphasis whitespace-nowrap">Date:</span>
          <span className="lyra-body-md truncate">{selectedLabel}</span>
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 flex-shrink-0 transition-transform", open && "rotate-180")} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </Popover>
  );
}

function PerformanceBreakdownCard() {
  return (
    <Container
      variant="neutral-subtle"
      headerTitle="Productivity"
      headerIcon={<Icon icon={Gauge} size="md" background="info" shape="rounded" decorative />}
      headerActions={<DateFilterChip />}
    >
      <div className="flex flex-col gap-4 px-4 pb-4">
        {PRODUCTIVITY_STATUS_ROWS.map((row) => (
          <div key={row.id} className="flex flex-col gap-1.5">
            {/* Self row */}
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 lyra-body-md-emphasis text-lyra-fg-default">
                <row.icon className={cn("h-4 w-4", row.iconColorClassName)} strokeWidth={1.5} />
                {row.label}
                <span className="lyra-body-sm text-lyra-fg-secondary font-normal">({row.percent}%)</span>
              </span>
              <span className="lyra-body-md-emphasis tabular-nums text-lyra-fg-default">{row.time}</span>
            </div>
            {/* Team comparison row */}
            <div className="flex items-center justify-between gap-3 pl-6">
              <span className="lyra-body-sm text-lyra-fg-secondary">Team ({row.teamPercent}%)</span>
              <span className="lyra-body-sm tabular-nums text-lyra-fg-secondary">{row.teamTime}</span>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

/* ── Interaction history table (sortable) — content of each Latest Interactions accordion item ── */

type InteractionSortKey = "timestamp" | "agent" | "status" | "queue" | "skill";

function nextInteractionSortDirection(current: SortDirection): SortDirection {
  if (current === null) return "asc";
  if (current === "asc") return "desc";
  return null;
}

function InteractionsTable({ interactions }: { interactions: ContactInteraction[] }) {
  const [sortKey, setSortKey] = useState<InteractionSortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  const handleSort = (key: InteractionSortKey) => {
    if (sortKey === key) {
      const next = nextInteractionSortDirection(sortDir);
      setSortDir(next);
      if (next === null) setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const dirFor = (key: InteractionSortKey): SortDirection => (sortKey === key ? sortDir : null);

  const sorted = [...interactions].sort((a, b) => {
    if (!sortKey || !sortDir) return 0;
    const aVal = a[sortKey].toLowerCase();
    const bVal = b[sortKey].toLowerCase();
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[40px] shrink-0"><span className="sr-only">Type</span></TableHead>
          <SortableTableHead className="flex-1" sortDirection={dirFor("timestamp")} onSort={() => handleSort("timestamp")}>Date/Time</SortableTableHead>
          <SortableTableHead className="flex-[1.3]" sortDirection={dirFor("agent")} onSort={() => handleSort("agent")}>Name</SortableTableHead>
          <SortableTableHead className="flex-1" sortDirection={dirFor("status")} onSort={() => handleSort("status")}>Status</SortableTableHead>
          <SortableTableHead className="flex-[1.3]" sortDirection={dirFor("queue")} onSort={() => handleSort("queue")}>Queue</SortableTableHead>
          <SortableTableHead className="flex-[1.3]" sortDirection={dirFor("skill")} onSort={() => handleSort("skill")}>Skill</SortableTableHead>
          <TableHead className="w-[48px] shrink-0"><span className="sr-only">Actions</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((interaction) => (
          <TableRow key={interaction.id}>
            <TableCell className="w-[40px] shrink-0">
              <span className="relative inline-flex h-4 w-4 items-center justify-center text-lyra-fg-secondary">
                {interaction.channel === "email" ? (
                  <Mail className="h-4 w-4" strokeWidth={1.5} />
                ) : (
                  <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                )}
                {interaction.direction === "inbound" ? (
                  <ArrowDown className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full bg-lyra-bg-surface-base p-[1px]" strokeWidth={2} />
                ) : (
                  <ArrowUp className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full bg-lyra-bg-surface-base p-[1px]" strokeWidth={2} />
                )}
              </span>
            </TableCell>
            <TableCell className="flex-1">{interaction.timestamp}</TableCell>
            <TableCell className="flex-[1.3]">{interaction.agent}</TableCell>
            <TableCell className="flex-1">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-lyra-status-critical-strong shrink-0" aria-hidden="true" />
                {interaction.status}
              </span>
            </TableCell>
            <TableCell className="flex-[1.3]">{interaction.queue}</TableCell>
            <TableCell className="flex-[1.3]">{interaction.skill}</TableCell>
            <TableCell className="w-[48px] shrink-0">
              <button
                aria-label="More options"
                className="flex h-7 w-7 items-center justify-center rounded-lyra-sm text-lyra-fg-secondary hover:bg-lyra-bg-surface-shell transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lyra-border-focus focus-visible:ring-offset-2"
              >
                <MoreVertical className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/* ── Sparkle icon (Ask AI) ── */

function AiSparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 10C17 9.94181 16.9795 9.88562 16.9424 9.84082C16.9051 9.79597 16.8532 9.76559 16.7959 9.75488L16.7949 9.75391L12.6279 8.96582C12.2329 8.89119 11.8693 8.69934 11.585 8.41504C11.3007 8.13074 11.1088 7.76715 11.0342 7.37207L10.2461 3.20508L10.2451 3.2041C10.2344 3.14679 10.204 3.09487 10.1592 3.05762C10.1144 3.02051 10.0582 3 10 3C9.94182 3 9.88563 3.02051 9.84082 3.05762C9.79597 3.09486 9.76559 3.14679 9.75488 3.2041L9.75391 3.20508L8.96582 7.37207C8.89119 7.76715 8.69934 8.13074 8.41504 8.41504C8.13074 8.69934 7.76715 8.89119 7.37207 8.96582L3.20508 9.75391L3.2041 9.75488C3.14679 9.76559 3.09486 9.79597 3.05762 9.84082C3.02051 9.88563 3 9.94182 3 10C3 10.0582 3.02051 10.1144 3.05762 10.1592C3.07625 10.1816 3.09828 10.2013 3.12305 10.2158L3.2041 10.2451L3.20508 10.2461L7.37207 11.0342C7.76715 11.1088 8.13074 11.3007 8.41504 11.585C8.69934 11.8693 8.89119 12.2329 8.96582 12.6279L9.75391 16.7949L9.75488 16.7959C9.76559 16.8532 9.79597 16.9051 9.84082 16.9424C9.88562 16.9795 9.94181 17 10 17C10.0582 17 10.1144 16.9795 10.1592 16.9424C10.204 16.9051 10.2344 16.8532 10.2451 16.7959L10.2461 16.7949L11.0342 12.6279C11.1088 12.2329 11.3007 11.8693 11.585 11.585C11.8693 11.3007 12.2329 11.1088 12.6279 11.0342L16.7949 10.2461L16.7959 10.2451C16.8532 10.2344 16.9051 10.204 16.9424 10.1592C16.9795 10.1144 17 10.0582 17 10ZM5.00098 15.999C5.00098 15.4469 4.55306 14.999 4.00098 14.999C3.4491 14.9993 3.00195 15.4471 3.00195 15.999C3.0022 16.5507 3.44925 16.9978 4.00098 16.998C4.55291 16.998 5.00073 16.5509 5.00098 15.999ZM6.00098 15.999C6.00073 17.1032 5.1052 17.998 4.00098 17.998C2.89697 17.9978 2.0022 17.103 2.00195 15.999C2.00195 14.8948 2.89682 13.9993 4.00098 13.999C5.10535 13.999 6.00098 14.8947 6.00098 15.999ZM18 10C18 10.2917 17.8983 10.5745 17.7119 10.7988C17.5256 11.0232 17.2662 11.174 16.9795 11.2275L16.9805 11.2285L12.8135 12.0166C12.616 12.0539 12.4341 12.1499 12.292 12.292C12.1499 12.4341 12.0539 12.616 12.0166 12.8135L11.2285 16.9805C11.1748 17.2668 11.023 17.5257 10.7988 17.7119C10.5745 17.8983 10.2917 18 10 18C9.70834 18 9.42555 17.8983 9.20117 17.7119C8.97704 17.5257 8.82516 17.2668 8.77148 16.9805L7.9834 12.8135C7.94609 12.616 7.85013 12.4341 7.70801 12.292C7.56588 12.1499 7.38403 12.0539 7.18652 12.0166L3.01953 11.2285V11.2275C2.73324 11.1738 2.47421 11.0229 2.28809 10.7988C2.10174 10.5745 2 10.2917 2 10C2 9.70834 2.10174 9.42554 2.28809 9.20117C2.47425 8.97704 2.73317 8.82516 3.01953 8.77148L7.18652 7.9834C7.38403 7.94609 7.56588 7.85013 7.70801 7.70801C7.85013 7.56588 7.94609 7.38403 7.9834 7.18652L8.77148 3.01953C8.82516 2.73317 8.97704 2.47425 9.20117 2.28809C9.42554 2.10174 9.70834 2 10 2C10.2917 2 10.5745 2.10174 10.7988 2.28809C11.023 2.47425 11.1748 2.73317 11.2285 3.01953L12.0166 7.18652C12.0539 7.38403 12.1499 7.56588 12.292 7.70801C12.4341 7.85013 12.616 7.94609 12.8135 7.9834L16.9805 8.77148H16.9795C17.2662 8.82503 17.5256 8.97683 17.7119 9.20117C17.8983 9.42555 18 9.70834 18 10ZM17.8271 4.0791C17.8271 4.22843 17.775 4.37334 17.6797 4.48828C17.5842 4.60329 17.4507 4.68056 17.3037 4.70801L17.3047 4.70898L16.6699 4.82812L16.5498 5.46191C16.5224 5.60887 16.4451 5.74238 16.3301 5.83789C16.2151 5.93334 16.0703 5.98532 15.9209 5.98535C15.7715 5.98535 15.6267 5.93328 15.5117 5.83789C15.3971 5.74266 15.3187 5.6103 15.291 5.46387L15.1709 4.82812L14.5361 4.70898V4.70801C14.3898 4.68032 14.2573 4.6029 14.1621 4.48828C14.0907 4.40218 14.0436 4.29937 14.0244 4.19043L14.0146 4.0791L14.0244 3.96875C14.0436 3.85949 14.0904 3.75624 14.1621 3.66992C14.2576 3.55499 14.3903 3.47672 14.5371 3.44922L15.1709 3.3291L15.291 2.69531C15.3186 2.54862 15.3969 2.41569 15.5117 2.32031L15.6025 2.25781C15.6989 2.20264 15.8086 2.17285 15.9209 2.17285L16.0312 2.18262C16.1041 2.19538 16.174 2.22111 16.2383 2.25781L16.3301 2.32031L16.4092 2.39941C16.4808 2.48388 16.5302 2.58618 16.5508 2.69629H16.5498L16.6699 3.3291L17.3027 3.44922H17.3037C17.4138 3.46978 17.5161 3.5192 17.6006 3.59082L17.6797 3.66992L17.7422 3.76172C17.7971 3.85791 17.8271 3.96706 17.8271 4.0791Z" fill="currentColor"/>
    </svg>
  );
}

/* ── AgentNextGenPage ── */

type Page = "agent-workspace" | "agent" | "outbound" | "login";

const AI_PANEL_DEFAULT_WIDTH = 360;

export function AgentNextGenPage({
  showPageHeader = false,
  showPanelToggle = false,
  showInteriorPanel = true,
  onNavigate,
}: {
  showPageHeader?: boolean;
  showPanelToggle?: boolean;
  showInteriorPanel?: boolean;
  onNavigate?: (page: Page) => void;
}) {
  const [navOpen, setNavOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("available");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [appMenuOpen, setAppMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => document.documentElement.getAttribute("data-theme") === "dark"
  );

  const handleDarkModeToggle = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      return next;
    });
  };

  const appMenuGroups = buildAppMenuGroups((page) => {
    setAppMenuOpen(false);
    onNavigate?.(page);
  });

  /* Panel animation state machine — see AgentNextGenTemplate.stories.tsx for full comment */
  type PanelState = "closed" | "open" | "closing";

  /* AI panel state */
  const [aiPanelOpen,  setAiPanelOpen]  = useState(false);
  const [aiMounted,    setAiMounted]    = useState(false);
  const [aiState,      setAiState]      = useState<PanelState>("closed");
  const [aiVariant,    setAiVariant]    = useState<DraggableVariant>("float");
  const [aiWidth,      setAiWidth]      = useState(AI_PANEL_DEFAULT_WIDTH);
  const [aiHeight,     setAiHeight]     = useState(860);
  const [aiIsResizing, setAiIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const aiFloatLeft  = useRef<number | null>(null);
  const aiFloatTop   = useRef<number | null>(null);
  const aiPanelRef   = useRef<HTMLDivElement>(null);
  const aiAnimTimer  = useRef<ReturnType<typeof setTimeout>>();

  /* Notifications panel state */
  const [notifOpen,       setNotifOpen]       = useState(false);
  const [notifMounted,    setNotifMounted]    = useState(false);
  const [notifState,      setNotifState]      = useState<PanelState>("closed");
  const [notifVariant,    setNotifVariant]    = useState<DraggableVariant>("float");
  const [notifWidth,      setNotifWidth]      = useState(360);
  const [notifHeight,     setNotifHeight]     = useState(860);
  const [notifIsResizing, setNotifIsResizing] = useState(false);
  const [topPanel,        setTopPanel]        = useState<"ai" | "notif" | null>(null);
  const notifFloatLeft = useRef<number | null>(null);
  const notifFloatTop  = useRef<number | null>(null);
  const notifPanelRef  = useRef<HTMLDivElement>(null);
  const notifAnimTimer = useRef<ReturnType<typeof setTimeout>>();

  /* Interior panel (right) */
  const [interiorPanelOpen, setInteriorPanelOpen] = useState(false);

  /* Side panel */
  const [sidePanelOpen,      setSidePanelOpen]      = useState(false);
  const [sidePanelPinned,    setSidePanelPinned]    = useState(false);
  const [sidePanelResizing,  setSidePanelResizing]  = useState(false);
  const [sidePanelWidth,     setSidePanelWidth]     = useState(256);
  const [containerWidth,     setContainerWidth]     = useState(9999);
  const sidePanelTimer = useRef<ReturnType<typeof setTimeout>>();

  // Track container width to force unpinned below 768px
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isNarrowContainer = containerWidth < 768;
  // When narrow: force overlay mode and hide pin button
  const effectivePinned = isNarrowContainer ? false : sidePanelPinned;

  // Track window width for nav overlay breakpoint
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isNavNarrow = windowWidth < 1280;
  const isCompactHeader = windowWidth < 760;

  // Auto-collapse the expanded nav when viewport drops below 1280px
  useEffect(() => {
    if (isNavNarrow && navOpen) setNavOpen(false);
  }, [isNavNarrow]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close and undock any docked panels when viewport drops below 1280px
  useEffect(() => {
    if (isNavNarrow) {
      if (aiVariant === "docked") {
        setAiVariant("float");
        setAiPanelOpen(false);
      }
      if (notifVariant === "docked") {
        setNotifVariant("float");
        setNotifOpen(false);
      }
    }
  }, [isNavNarrow]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSidePanelHoverStart = () => {
    clearTimeout(sidePanelTimer.current);
    setSidePanelOpen(true);
  };
  const onSidePanelHoverEnd = () => {
    sidePanelTimer.current = setTimeout(() => setSidePanelOpen(false), 300);
  };
  const handleSidePanelPinToggle = () => {
    setSidePanelPinned((v) => !v);
    setSidePanelOpen(true);
  };

  const MAX_PANEL_HEIGHT = 860;
  const BOTTOM_PADDING   = 8;

  const computePanelHeight = () => {
    if (!containerRef.current) return MAX_PANEL_HEIGHT;
    const top = containerRef.current.getBoundingClientRect().top;
    return Math.min(window.innerHeight - top - BOTTOM_PADDING, MAX_PANEL_HEIGHT);
  };

  /* Timer */
  useEffect(() => {
    const id = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(elapsedSeconds / 3600);
  const m = Math.floor((elapsedSeconds % 3600) / 60);
  const s = elapsedSeconds % 60;
  const formattedTimer = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  const handleStatusChange = (status: AgentStatus) => {
    setAgentStatus(status);
    setElapsedSeconds(0);
  };

  /* AI panel show/hide */
  useEffect(() => {
    clearTimeout(aiAnimTimer.current);
    if (aiPanelOpen) {
      if (containerRef.current && aiFloatLeft.current === null) {
        const r = containerRef.current.getBoundingClientRect();
        aiFloatLeft.current = r.left + containerRef.current.offsetWidth - aiWidth - 16;
      }
      setAiHeight(computePanelHeight());
      setAiMounted(true);
      setAiState("open");
      setTopPanel("ai");
    } else {
      setAiState("closing");
      aiAnimTimer.current = setTimeout(() => setAiState("closed"), 150);
    }
    return () => clearTimeout(aiAnimTimer.current);
  }, [aiPanelOpen]);

  /* Shrink panel height with viewport when open */
  useEffect(() => {
    if (!aiPanelOpen) return;
    const onResize = () => setAiHeight(computePanelHeight());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [aiPanelOpen]);

  /* Notifications panel show/hide — same state machine as AI panel */
  useEffect(() => {
    clearTimeout(notifAnimTimer.current);
    if (notifOpen) {
      if (containerRef.current && notifFloatLeft.current === null) {
        const r = containerRef.current.getBoundingClientRect();
        notifFloatLeft.current = r.left + containerRef.current.offsetWidth - notifWidth - 16;
      }
      setNotifHeight(computePanelHeight());
      setNotifMounted(true);
      setNotifState("open");
      setTopPanel("notif");
    } else {
      setNotifState("closing");
      notifAnimTimer.current = setTimeout(() => setNotifState("closed"), 150);
    }
    return () => clearTimeout(notifAnimTimer.current);
  }, [notifOpen]);

  useEffect(() => {
    if (!notifOpen) return;
    const onResize = () => setNotifHeight(computePanelHeight());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [notifOpen]);

  const handleNotifVariantChange = (v: DraggableVariant) => {
    // When docking: capture actual rendered position (includes CSS transform drag offset)
    // before the float wrapper unmounts. This is restored when undocking.
    if (v === "docked" && notifPanelRef.current) {
      const r = notifPanelRef.current.getBoundingClientRect();
      notifFloatLeft.current = r.left;
      notifFloatTop.current  = r.top;
    }
    // Single-dock rule: if docking and AI panel is already docked, force AI to float.
    // AI has no float wrapper right now so fall back to a computed default position.
    if (v === "docked" && aiVariant === "docked" && containerRef.current) {
      const r = containerRef.current.getBoundingClientRect();
      aiFloatLeft.current = r.left + containerRef.current.offsetWidth - aiWidth - 16;
      aiFloatTop.current  = null; // use computed default top
      setAiVariant("float");
    }
    setNotifVariant(v);
  };

  const getNotifFloatStyle = (): React.CSSProperties => {
    const rect = containerRef.current?.getBoundingClientRect();
    const left = notifFloatLeft.current !== null
      ? notifFloatLeft.current
      : containerRef.current
        ? (rect?.left ?? 0) + containerRef.current.offsetWidth - notifWidth - 16
        : 0;
    const top = notifFloatTop.current !== null
      ? notifFloatTop.current
      : (rect?.top ?? 0);
    return {
      position: "fixed",
      top,
      left,
      zIndex: topPanel === "notif" ? 10000 : 9999,
    };
  };

  const notifPanel = notifMounted ? (
    <AgentNotifications
      ref={notifPanelRef}
      notifications={notifications}
      draggableVariant={notifVariant}
      onVariantChange={handleNotifVariantChange}
      onWidthChange={setNotifWidth}
      onResizeStateChange={setNotifIsResizing}
      onInteract={() => setTopPanel("notif")}
      onMarkAllRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
      onClearAll={() => setNotifications([])}
      onDismiss={(id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
      onNotificationClick={(n: AgentNotification) =>
        setNotifications((prev) => prev.map((i) => i.id === n.id ? { ...i, read: true } : i))
      }
      onClose={() => setNotifOpen(false)}
      defaultWidth={notifWidth}
      maxWidth={600}
      height={notifHeight}
    />
  ) : null;

  const handleAiVariantChange = (v: DraggableVariant) => {
    // When docking: capture actual rendered position (includes CSS transform drag offset)
    // before the float wrapper unmounts. This is restored when undocking.
    if (v === "docked" && aiPanelRef.current) {
      const r = aiPanelRef.current.getBoundingClientRect();
      aiFloatLeft.current = r.left;
      aiFloatTop.current  = r.top;
    }
    // Single-dock rule: if docking and notif panel is already docked, force notif to float.
    // Notif has no float wrapper right now so fall back to a computed default position.
    if (v === "docked" && notifVariant === "docked" && containerRef.current) {
      const r = containerRef.current.getBoundingClientRect();
      notifFloatLeft.current = r.left + containerRef.current.offsetWidth - notifWidth - 16;
      notifFloatTop.current  = null; // use computed default top
      setNotifVariant("float");
    }
    setAiVariant(v);
  };

  const getAiFloatStyle = (): React.CSSProperties => {
    const rect = containerRef.current?.getBoundingClientRect();
    const left = aiFloatLeft.current !== null
      ? aiFloatLeft.current
      : containerRef.current
        ? (rect?.left ?? 0) + containerRef.current.offsetWidth - aiWidth - 16
        : 0;
    const top = aiFloatTop.current !== null
      ? aiFloatTop.current
      : (rect?.top ?? 0);
    return {
      position: "fixed",
      top,
      left,
      zIndex: topPanel === "ai" ? 10000 : 9999,
    };
  };

  const aiPanel = aiMounted ? (
    <AiPanel
      ref={aiPanelRef}
      draggable
      draggableVariant={aiVariant}
      defaultDraggableWidth={aiWidth}
      maxDraggableWidth={600}
      defaultDraggableHeight={aiHeight}
      onVariantChange={handleAiVariantChange}
      onWidthChange={setAiWidth}
      onResizeStateChange={setAiIsResizing}
      onInteract={() => setTopPanel("ai")}
      userName="John"
      suggestions={[
        { id: "1", label: "Summarise this contact's history" },
        { id: "2", label: "Suggest a response to the customer" },
        { id: "3", label: "What changed since yesterday?" },
      ]}
      onClose={() => setAiPanelOpen(false)}
      className={aiVariant === "docked" ? "h-full" : undefined}
    />
  ) : null;

  return (
    <div className="flex flex-col h-screen bg-lyra-bg-surface-shell overflow-hidden">

      {/* ── App Header ── */}
      <AppHeader
        appName={
          <PopoverPrimitive.Root open={appMenuOpen} onOpenChange={setAppMenuOpen}>
            <PopoverPrimitive.Trigger asChild>
              <AppName
                icon={<img src={appIcon} alt="Agent Next Gen" className="h-6 w-6" />}
                name="Agent Next Gen"
                compact={isCompactHeader}
                aria-expanded={appMenuOpen}
              />
            </PopoverPrimitive.Trigger>
            <PopoverPrimitive.Portal>
              <PopoverPrimitive.Content
                side="bottom"
                align="start"
                sideOffset={6}
                onOpenAutoFocus={(e: Event) => e.preventDefault()}
                className="z-[9999] animate-in fade-in-0 slide-in-from-top-2 duration-150 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-1 data-[state=closed]:duration-100"
              >
                <AppMenu
                  groups={appMenuGroups}
                  footer={<CXoneLogo />}
                  header={isCompactHeader ? "Agent Next Gen" : undefined}
                />
              </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
          </PopoverPrimitive.Root>
        }
        actions={
          <>
            <NotificationsBell
              notifications={notifications}
              open={notifOpen}
              onOpenChange={setNotifOpen}
              renderPanel={false}
            />
            <button
              type="button"
              aria-label="Ask AI"
              aria-expanded={aiPanelOpen}
              onClick={() => setAiPanelOpen((v) => !v)}
              className={`relative flex h-10 w-10 items-center justify-center rounded-lyra-lg text-lyra-fg-default transition-colors hover:bg-lyra-state-hover active:bg-lyra-state-pressed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lyra-border-focus ${aiPanelOpen ? "bg-lyra-state-hover" : ""}`}
            >
              <AiSparkleIcon />
            </button>
            <AgentProfile
              name="John Smith"
              initials="JS"
              status={agentStatus}
              onStatusChange={handleStatusChange}
              onDarkModeToggle={handleDarkModeToggle}
              isDarkMode={darkMode}
              timer={formattedTimer}
              onLogOut={() => onNavigate?.("login")}
              className="ml-1"
            />
          </>
        }
      />

      {/* ── Body: LeftNav + Content ── */}
      {/* overflow-hidden ensures docked panels never push layout past the viewport */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        <LeftNav
          items={NAV_ITEMS}
          open={navOpen}
          onToggle={() => setNavOpen((v) => !v)}
          overlay={isNavNarrow}
          footer={<AddChannel items={ADD_CHANNEL_ITEMS} expanded={navOpen} />}
        />

        {/* Content area — flex-1 shrinks to give space to docked panels.
            ref used to position float panels. */}
        <div ref={containerRef} className="relative flex flex-1 min-w-0 overflow-hidden pr-3 pb-3">

          {/* Main Container — flex row so pinned Panel sits left of PageHeader + content.
              relative so unpinned Panel can overlay the full surface. */}
          <Container className="flex flex-1 overflow-hidden relative">

            {/* Pinned Panel — flex sibling, pushes everything (incl. PageHeader) to the right */}
            {showPanelToggle && effectivePinned && (
              <Panel
                variant="side"
                side="left"
                open={sidePanelOpen}
                pinned
                headerTitle="Designer"
                onPinToggle={handleSidePanelPinToggle}
                width={sidePanelWidth}
                onWidthChange={setSidePanelWidth}
              />
            )}

            {/* Content column: PageHeader + page body */}
            <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
              {showPageHeader && (
                <PageHeader
                  title="Home"
                  panelToggle={
                    showPanelToggle && showInteriorPanel ? "both"
                    : showPanelToggle ? "left"
                    : showInteriorPanel ? "right"
                    : undefined
                  }
                  panelPinned={effectivePinned}
                  onPanelToggle={effectivePinned ? () => setSidePanelOpen((v) => !v) : undefined}
                  onPanelHoverStart={!effectivePinned ? onSidePanelHoverStart : undefined}
                  onPanelHoverEnd={!effectivePinned ? onSidePanelHoverEnd : undefined}
                  onInnerPanelToggle={showInteriorPanel ? () => setInteriorPanelOpen((v) => !v) : undefined}
                  actions={
                    <>
                      <Button variant="outline">Export</Button>
                      <Button>
                        <Plus className="h-4 w-4" strokeWidth={1.5} />
                        New Case
                      </Button>
                    </>
                  }
                />
              )}
              {/* Body row: main content + interior panel */}
              <div className="relative flex flex-1 overflow-hidden">
                <div className="flex flex-1 flex-col min-w-0 overflow-y-auto px-6 py-6">
                  <div className="w-full max-w-[1200px] mx-auto">
                    {/* ── Greeting ── */}
                    <h1 className="lyra-heading-xl text-lyra-fg-default">Good morning, Sarah</h1>
                    <p className="lyra-body-sm text-lyra-fg-secondary mt-1">Last login: Today at 8:42 AM</p>
                    <p className="lyra-body-md text-lyra-fg-default mt-4">
                      You have 6 pending cases that need immediate attention. No cases resolved yet today.
                      With 25 open and 5 pending, prioritise clearing blockers before your 09:00 callback.
                      Keep an eye on handle time and aim to wrap responses within SLA windows.
                    </p>

                    {/* ── Summary cards ── */}
                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                      {SUMMARY_CARDS.map((card) => (
                        <Container
                          key={card.id}
                          variant="neutral-subtle"
                          headerTitle={card.title}
                          headerIcon={
                            <Icon icon={card.icon} size="md" background={card.iconBackground} shape="rounded" decorative />
                          }
                          headerActions={card.showDateFilter ? <DateFilterChip /> : undefined}
                        >
                          <div className="flex flex-col gap-3 px-4 pb-4">
                            {card.rows.map((row) => (
                              <div key={row.label} className="flex items-center justify-between">
                                <span className="lyra-body-md text-lyra-fg-secondary">{row.label}</span>
                                <span className={cn("lyra-heading-sm text-lyra-fg-default", row.valueClassName)}>{row.value}</span>
                              </div>
                            ))}
                            <Divider />
                            <div className="flex flex-col gap-0.5">
                              <span className="lyra-body-sm text-lyra-fg-secondary">{card.footerLabel}</span>
                              <span className="lyra-body-md-emphasis text-lyra-fg-default">{card.footerPrimary}</span>
                              {card.footerSecondary && (
                                <span className={cn("lyra-body-sm text-lyra-fg-disabled truncate", card.footerSecondaryClassName)}>
                                  {card.footerSecondary}
                                </span>
                              )}
                            </div>
                          </div>
                        </Container>
                      ))}
                      <PerformanceBreakdownCard />
                    </div>

                    {/* ── Latest Interactions ── */}
                    <div className="mt-8 flex items-center gap-2">
                      <h2 className="lyra-heading-md text-lyra-fg-default">Latest Interactions</h2>
                      <button
                        type="button"
                        className="lyra-body-sm text-lyra-fg-secondary hover:text-lyra-fg-action transition-colors"
                      >
                        (view Contact History)
                      </button>
                    </div>

                    <Accordion
                      type="multiple"
                      className="mt-3 rounded-lyra-lg border border-lyra-border-subtle bg-lyra-bg-surface-base overflow-hidden"
                      items={LATEST_CONTACTS.map((contact) => ({
                        id: contact.id,
                        title: (
                          <span className="inline-flex items-center gap-2">
                            {contact.name}
                            <Tag label={contact.status} variant="success" shape="pill" />
                          </span>
                        ),
                        subhead: (
                          <span className="flex flex-col gap-0.5">
                            <span className="lyra-body-md text-lyra-fg-default">{contact.description}</span>
                            <span className="inline-flex items-center gap-1">
                              {contact.channel}
                              <span aria-hidden="true">•</span>
                              <Clock className="h-3 w-3" strokeWidth={1.5} />
                              Wait: {contact.wait}
                              <span aria-hidden="true">•</span>
                              {contact.caseId}
                            </span>
                          </span>
                        ),
                        content: <InteractionsTable interactions={contact.interactions} />,
                      }))}
                    />
                  </div>
                </div>
                {showInteriorPanel && (
                  <Panel
                    variant="interior"
                    side="right"
                    open={interiorPanelOpen}
                    headerTitle="Case Details"
                    onClose={() => setInteriorPanelOpen(false)}
                  >
                    <div className="flex flex-col gap-4 px-4 py-4">
                      <Input label="Subject" placeholder="Enter subject" />
                      <Input label="Priority" placeholder="Select priority" />
                      <Input label="Assignee" placeholder="Search agents" />
                      <Input label="Tags" placeholder="Add tags" />
                    </div>
                  </Panel>
                )}
              </div>
            </div>

            {/* Unpinned Panel — absolute overlay covering full Container incl. PageHeader */}
            {showPanelToggle && !effectivePinned && (
              <Panel
                variant="side"
                side="left"
                open={sidePanelOpen}
                pinned={false}
                headerTitle="Designer"
                onPinToggle={isNarrowContainer ? undefined : handleSidePanelPinToggle}
                width={sidePanelWidth}
                onWidthChange={setSidePanelWidth}
                onResizeStateChange={setSidePanelResizing}
                onMouseEnter={onSidePanelHoverStart}
                onMouseLeave={sidePanelResizing ? undefined : onSidePanelHoverEnd}
              />
            )}
          </Container>

          {/* Notifications — float (CSS transitions, not keyframe animations — avoids compositor fill-mode flash) */}
          {notifVariant === "float" && notifMounted && (
            <div
              style={{
                ...getNotifFloatStyle(),
                pointerEvents: "none",
                visibility: notifState === "closed" ? "hidden" : "visible",
                opacity: notifState === "open" ? 1 : 0,
                transform: notifState === "open" ? "translateY(0)" : "translateY(-8px)",
                transition: notifState === "open"
                  ? "opacity 150ms ease, transform 150ms ease"
                  : "opacity 100ms ease, transform 100ms ease",
              }}
            >
              {notifPanel}
            </div>
          )}

          {/* AI Panel — float (same CSS transition pattern as Notifications) */}
          {aiVariant === "float" && aiMounted && (
            <div
              style={{
                ...getAiFloatStyle(),
                pointerEvents: "none",
                visibility: aiState === "closed" ? "hidden" : "visible",
                opacity: aiState === "open" ? 1 : 0,
                transform: aiState === "open" ? "translateY(0)" : "translateY(-8px)",
                transition: aiState === "open"
                  ? "opacity 150ms ease, transform 150ms ease"
                  : "opacity 100ms ease, transform 100ms ease",
              }}
            >
              {aiPanel}
            </div>
          )}

        </div>

        {/* Notifications — docked (sibling of containerRef so flex layout keeps it in-bounds) */}
        {notifVariant === "docked" && (
          <div className="pb-3" style={{
            width: notifState === "open" ? notifWidth : 0,
            marginRight: notifState === "open" ? 12 : 0,
            overflow: "hidden",
            flexShrink: 0,
            transition: notifIsResizing ? "none" : "width 250ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}>
            <div
              className="h-full animate-in fade-in-0 duration-150"
              style={{
                width: notifWidth,
                display: notifState === "open" ? "block" : "none",
              }}
            >
              {notifPanel}
            </div>
          </div>
        )}

        {/* AI Panel — docked (sibling of containerRef so flex layout keeps it in-bounds) */}
        {aiVariant === "docked" && (
          <div className="pb-3" style={{
            width: aiState === "open" ? aiWidth : 0,
            marginRight: aiState === "open" ? 12 : 0,
            overflow: "hidden",
            flexShrink: 0,
            transition: aiIsResizing ? "none" : "width 250ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}>
            <div
              className="h-full animate-in fade-in-0 duration-150"
              style={{
                width: aiWidth,
                display: aiState === "open" ? "block" : "none",
              }}
            >
              {aiPanel}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
