import React, { useState, useEffect, useMemo, useRef } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";
import {
  AppHeader,
  AppName,
  AppMenu,
  CXoneLogo,
  Modal,
  useAiPanelContent,
  useAgentNotificationsContent,
  Draggable,
  ContainerHeader,
  NotificationsBell,
  AgentProfile,
  Container,
  InteriorPanel,
  PageHeader,
  PanelHeader,
  Button,
  Textarea,
  Label,
  Accordion,
  ActionIconButton,
  AiSparkleIcon,
  Tag,
  Input,
  LeftNav,
  CreateNew,
  useOutboundAddButton,
  InteractionNavItem,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  SortableTableHead,
  Icon,
  Badge,
  type BadgeColor,
  SearchInput,
  Separator,
  DonutChart,
  DashboardCard,
  DashboardQueue,
  AgentWelcomeMessage,
  TabList,
  Tab,
  ChannelToggle,
  ChannelToggleGroup,
  Popover,
  RadioGroup,
  RadioGroupItem,
  DateRangePicker,
  filterChipVariants,
  Menu,
  Select,
  Checkbox,
  DatePicker,
  EmailInput,
  PhoneInput,
  type PhoneValue,
  Tooltip,
  type SelectOption,
  type NavItem,
  type SortDirection,
  type DateRange,
  type TagVariant,
  type CreateNewOutboundConfig,
  type CreateNewOutboundContact,
  type InteractionChannel,
  type ChannelType,
  type AgentStatus,
  type AppMenuGroup,
  type AgentNotification,
  type DraggableVariant,
  type EmbeddablePanelContent,
  type MenuEntry,
} from "@nicecxone/lyra-ui";
import { CREATE_NEW_AGENTS } from "@nicecxone/lyra-ui/agents-data";
import { CREATE_NEW_CUSTOMERS } from "@nicecxone/lyra-ui/customers-data";
import appIcon from "@/assets/app-icon.svg";
import {
  Home,
  Settings,
  Phone,
  PhoneOutgoing,
  PhoneIncoming,
  Voicemail,
  ClipboardList,
  Mail,
  MessageSquare,
  MessageCircle,
  Share2,
  Clock,
  ArrowDown,
  ArrowUp,
  TrendingUp,
  CheckCircle2,
  CircleDot,
  MinusCircle,
  Gauge,
  ChevronDown,
  MoreVertical,
  RotateCcw,
  UserPlus,
  UserRound,
  User,
  Info,
  Inbox,
  CalendarDays,
  MonitorUp,
  GripVertical,
  History,
  ChevronRight,
  Copy,
  Tags,
  Paperclip,
  Bold,
  Italic,
  Smile,
  Zap,
  FileText,
  Send,
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

/* ── Create New → Outbound config ──
   Mirrors lyra-ui's CreateNew "Create New → Outbound" story (see
   lyra-ui/src/components/__stories__/create-new-outbound-mock.tsx) — only
   "Outbound" is wired up, the rest render as coming-soon placeholders. Teams
   and skills below are small, app-specific lists kept local, but the agent
   and customer "database" records themselves come from lyra-ui's shared
   fixture files (via the /agents-data and /customers-data aliases in
   vite.config.ts) so this app's Outbound picker can't quietly drift out of
   sync with lyra-ui's own story — same records, mapped into the shape
   `CreateNew` expects exactly like lyra-ui's own mock file does. */

function initialsFor(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const OUTBOUND_AGENTS: NonNullable<CreateNewOutboundConfig["groups"][number]["contacts"]> = CREATE_NEW_AGENTS.map((a) => ({
  id: a.id,
  name: a.name,
  initials: initialsFor(a.name),
  subtitle: a.agentId,
  avatarClassName: a.avatarClassName,
  channels: a.channels,
  status: a.status,
}));

const OUTBOUND_CUSTOMERS: NonNullable<CreateNewOutboundConfig["groups"][number]["contacts"]> = CREATE_NEW_CUSTOMERS.map((c) => ({
  id: c.id,
  name: c.name,
  initials: initialsFor(c.name),
  subtitle: c.customerId,
  avatarClassName: c.avatarClassName,
  channels: c.channels,
}));

const OUTBOUND_TEAMS: NonNullable<CreateNewOutboundConfig["groups"][number]["contacts"]> = [
  { id: "t1", name: "Billing Support",    initials: "BS", subtitle: "TEAM-04", avatarClassName: "bg-lyra-accent-purple-soft text-lyra-accent-purple-strong", channels: ["voice", "email"] },
  { id: "t2", name: "Tier 2 Escalations", initials: "T2", subtitle: "TEAM-07", avatarClassName: "bg-lyra-accent-red-soft text-lyra-accent-red-strong",       channels: ["voice", "email"] },
];

const OUTBOUND_SKILLS: NonNullable<CreateNewOutboundConfig["groups"][number]["contacts"]> = [
  { id: "s1", name: "Spanish Language",  initials: "ES", subtitle: "SKL-12", avatarClassName: "bg-lyra-accent-green-soft text-lyra-accent-green-strong", channels: ["voice", "email"], status: "available", queueCount: 4, waitTimeSeconds: 200 },
  { id: "s2", name: "Technical Support", initials: "TS", subtitle: "SKL-03", avatarClassName: "bg-lyra-accent-blue-soft text-lyra-accent-blue-strong",   channels: ["voice", "email"], status: "busy",      queueCount: 7, waitTimeSeconds: 95 },
];

const OUTBOUND_CONFIG: CreateNewOutboundConfig = {
  outboundTitle: "New Outbound",
  groups: [
    { id: "favorites", label: "Favorites", kind: "favorites", emptyMessage: "No favorites yet" },
    { id: "agents", label: "Agents", searchPlaceholder: "Search Agents", contacts: OUTBOUND_AGENTS },
    { id: "teams", label: "Teams", searchPlaceholder: "Search teams", contacts: OUTBOUND_TEAMS },
    { id: "skills", label: "Skills", searchPlaceholder: "Search skills", contacts: OUTBOUND_SKILLS },
    { id: "customers", label: "Customers", searchPlaceholder: "Search customers", contacts: OUTBOUND_CUSTOMERS },
    { id: "dialpad", label: "Dial Pad", kind: "dialpad" },
  ],
  defaultGroupId: "agents",
  channelOptions: [
    { id: "voice",    label: "Call",     selectLabel: "Voice", icon: <Phone         className="h-5 w-5" strokeWidth={1.5} /> },
    { id: "email",    label: "Email",                          icon: <Mail          className="h-5 w-5" strokeWidth={1.5} /> },
    { id: "sms",      label: "SMS",                            icon: <MessageSquare className="h-5 w-5" strokeWidth={1.5} /> },
    { id: "whatsapp", label: "WhatsApp",                       icon: <MessageCircle className="h-5 w-5" strokeWidth={1.5} /> },
  ],
  phoneOptions: [
    { value: "+14563833329", label: "(456) 383-3329" },
    { value: "+14565559981", label: "(456) 555-9981" },
    { value: "+14565550147", label: "(456) 555-0147" },
  ],
  skillOptions: [
    { value: "general", label: "General Support" },
    { value: "technical", label: "Technical Support" },
    { value: "billing", label: "Billing" },
    { value: "sales", label: "Sales" },
    { value: "escalations", label: "Escalations" },
    { value: "vip", label: "VIP Support" },
  ],
  onQuickDial: (phoneNumber) => {
    // eslint-disable-next-line no-console
    console.log("Quick dial:", phoneNumber);
  },
  onStartCall: (selection) => {
    // eslint-disable-next-line no-console
    console.log(
      "Start call:",
      selection.channel,
      "→",
      selection.contact.name,
      `(phone: ${selection.phone}, skill: ${selection.skillId})`
    );
  },
  pageSize: 10,
};

/* ── Left nav interactions ──
   Live InteractionNavItem cards launched from CreateNew above — see
   lyra-ui's AgentNextGenTemplate.stories.tsx for the reference
   implementation this mirrors. No cards exist until the agent actually
   starts one; starting a second channel with a contact who already has a
   card folds it into that same card *only* when it's the same channel type
   on the same address (restarting its timer) — a different address on the
   same type (e.g. a second SMS thread on a different number) opens as its
   own additional row instead of replacing the first, since it's a genuinely
   separate conversation. "Unassign & Dismiss" (any channel's kebab menu)
   removes just that channel via InteractionNavItem's `onDismissChannel`
   when others are still open, or the whole card via `onDismiss` when it was
   the last one — see `handleDismissChannel`/`handleDismissInteraction`. */

/** A channel open within one live interaction — tracks when it started
 *  (in ticks of the shared clock below) rather than a fixed elapsed string,
 *  so the rendered `InteractionChannel.elapsed` keeps counting up live. */
interface TrackedChannel {
  /** Unique identity for this specific channel, so two channels of the same
   *  `type` (e.g. two SMS threads on different numbers) are tracked as
   *  separate rows instead of one overwriting the other — see
   *  `InteractionChannel.id`'s own doc comment in lyra-ui. Built from
   *  `type` + `value` (`"sms:+14565559981"`) so restarting the *same*
   *  address correctly reuses/refreshes the existing row (see
   *  `handleStartCall`) while a different address never collides with it.
   *  Quick-dialed/redialed channels (no CreateNew contact/address) just use
   *  their `type`, since those flows already fully replace `channels`
   *  rather than merging into it. */
  id: string;
  type: ChannelType;
  startTick: number;
  /** Routing skill label for this channel, shown as its body copy — looked
   *  up from OUTBOUND_CONFIG.skillOptions at start-call time. */
  preview?: string;
  /** The phone number/email address/WhatsApp handle this channel was
   *  started on (from `handleStartCall`'s `selection.phone`) — surfaced
   *  back into CreateNew's `openChannelAddresses` so reopening the outbound
   *  picker for this contact disables only that exact address in "Select
   *  Phone"/"Select Email Address"/"Select WhatsApp Handle", not the whole
   *  field. Undefined for quick-dialed/redialed channels, which don't go
   *  through CreateNew's contact flow. */
  value?: string;
  /** Human-readable version of `value` for display (e.g. "(456) 383-3329"
   *  vs. `value`'s raw "+14563833329") — looked up from
   *  `OUTBOUND_CONFIG.phoneOptions` at start-call time, same pattern as
   *  `preview`/`skillLabel` above. Kept separate from `value` since `value`
   *  has to stay the raw address for the `openChannelAddresses` dedup match
   *  in "Select Phone"/etc. to keep working. Shown on this channel's
   *  `ChannelToggle` (see the `activeInteraction` block below) as "SMS |
   *  (456) 383-3329" — undefined just means the toggle shows icon + type
   *  label with no address (e.g. a redialed voice call, which has no
   *  stored number at all). */
  addressLabel?: string;
  /** Whether the customer has sent a message on this channel that the agent
   *  hasn't replied to yet — drives the row's red/critical chip+clock
   *  styling (green/success otherwise). Always omitted (falsy) at
   *  start-call/quick-dial/redial time: an agent-initiated outbound channel
   *  has nothing pending from the customer the moment it opens, so it
   *  should never render red immediately just because its `type` isn't
   *  voice. There's no live customer-reply event in this demo to flip it
   *  true later — this field exists so that mechanism has somewhere to
   *  plug in without re-introducing the "every non-voice channel is
   *  permanently red" bug this replaced. */
  awaitingResponse?: boolean;
  /** Total message count for this channel's conversation, shown only on this
   *  channel's `ChannelToggle` tooltip (see the `activeInteraction` block
   *  below), never on the toggle face itself. There's no real message store in
   *  this demo, so `handleStartCall`/`handleQuickDial`/`handleRedial` just
   *  set this directly at channel-creation time: `0` for a freshly started
   *  outbound conversation on any digital channel (the tooltip reads "0
   *  Messages", which is correct — nothing's been exchanged yet), left
   *  `undefined` entirely for voice (no message concept at all, so the
   *  tooltip's message segment is omitted rather than showing "0 Messages"
   *  for a channel type that doesn't have messages). */
  messageCount?: number;
  /** This channel's own conversation/session id — distinct from
   *  `ActiveInteraction.recordId` below (the *customer/case* record shown in
   *  the page header): one record can have several channels open, each its
   *  own conversation with its own id. Synthesized via
   *  `generateInteractionId()` at channel-creation time (for every channel
   *  type, including voice); shown on this channel's `ChannelToggle` tooltip as
   *  "#{interactionId}". */
  interactionId?: string;
}

/** One live interaction in the left nav — an agent/customer/team/skill
 *  contact (or, for a quick-dialed number with no contact record, the
 *  number itself) plus every channel currently open with them. Keyed by
 *  contact id (or `quickdial:<number>`) so starting a second channel with
 *  the same contact adds to this interaction's `channels` instead of
 *  creating a second card. */
interface ActiveInteraction {
  id: string;
  customerName?: string;
  /** Customer/agent/team/skill record id shown under the name on this
   *  interaction's detail page header — the contact's real id
   *  (`CreateNewOutboundContact.subtitle`, e.g. a customerId/agentId) when
   *  the interaction was started from a known record, `entry.caseId` when
   *  redialed from Contact History, or a freshly generated case number
   *  (`generateCaseId`) for quick-dialed numbers with no matching record. */
  recordId: string;
  channels: TrackedChannel[];
  /** Which open channel is "current" — shared source of truth between this
   *  interaction's `InteractionNavItem` card (its `currentChannelKey` prop)
   *  and its `ChannelToggle` bar (each toggle's `active`), so clicking either one
   *  updates the other. A `TrackedChannel.id` (falls back to the last
   *  channel's own id when unset — see the `?? mostRecentId` reads below —
   *  same default a fresh interaction already had before this field
   *  existed). Kept in sync by `handleStartCall`/`handleQuickDial`/
   *  `handleRedial` (a new/refreshed channel always takes over as current,
   *  mirroring `InteractionNavItem`'s own auto-select-newest rule) and by
   *  `handleChannelSelect` (a row or tab click). */
  currentChannelId?: string;
}

/** Fallback case id for interactions with no real customer/agent/team/skill
 *  record behind them (quick-dialed numbers) — same "CS-" + digits shape as
 *  every other generated case id in this file, just namespaced separately
 *  since those already-real ids come with their own prefix per record type
 *  (customerId/agentId/TEAM-.../SKL-.../ASN-...). */
function generateCaseId(): string {
  return `CS-${Math.floor(1000000 + Math.random() * 9000000)}`;
}

/** Synthesized per-channel conversation/session id — same plain-numeric
 *  shape as the reference screenshot ("#707535188548", 12 digits, no
 *  prefix) — distinct from `generateCaseId`'s "CS-" shape, which is a
 *  customer/case-level id, not a per-channel one. See
 *  `TrackedChannel.interactionId`'s own doc comment for why these are two
 *  different things. */
function generateInteractionId(): string {
  return String(Math.floor(100000000000 + Math.random() * 900000000000));
}

/** Renders a tick count (seconds since the channel/interaction started) as
 *  the "MM:SS" format InteractionNavItem's `elapsed` prop expects. */
function formatElapsedTime(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const mm = Math.floor(clamped / 60);
  const ss = clamped % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

/** Same idea as `formatElapsedTime` above but "HH:MM:SS", for the home tab's
 *  queue widgets — their wait time can run past an hour (e.g. voicemail),
 *  unlike a just-started interaction's MM:SS elapsed display. */
function formatWaitTime(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const hh = Math.floor(clamped / 3600);
  const mm = Math.floor((clamped % 3600) / 60);
  const ss = clamped % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

/* ── Left nav items ──
   Built from whether an interaction is currently active (see
   `activeInteraction` below) rather than a static array, so "Home" (the
   rail item — still routes to the Desk dashboard) stops showing as active —
   and becomes clickable to navigate back — the moment an assignment takes
   over the main content area. "Settings" sits below Home as a plain rail
   item (same convention as lyra-ux-templates' and the
   lyra-ui template story's own `buildNavItems`/`NAV_ITEMS`, both of which
   already end their rail with a Settings item) rather than a standalone
   AppHeader icon — see the `actions` block below, which no longer has one.
   Settings is now a real third view (see `showSettings` state) — clicking
   it opens a blank "Settings" page in the content column and highlights
   this rail item, same on/off-exclusivity as Home vs. an active
   interaction. */

function buildNavItems(
  hasActiveInteraction: boolean,
  onDeskClick: () => void,
  showSettings: boolean,
  onSettingsClick: () => void
): NavItem[] {
  return [
    {
      icon: <Home className="h-4 w-4" strokeWidth={1.5} />,
      label: "Home",
      active: !hasActiveInteraction && !showSettings,
      onClick: onDeskClick,
    },
    {
      icon: <Settings className="h-4 w-4" strokeWidth={1.5} />,
      label: "Settings",
      active: showSettings,
      onClick: onSettingsClick,
    },
  ];
}

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
  caseId: string;
  priority: number;
  type: "email" | "chat" | "voice";
  direction: "inbound" | "outbound";
  createDate: string;
  status: "open" | "closed";
  channel: string;
  resolutionTime: string;
  skill: string;
  owner: string;
}

interface LatestContact {
  id: string;
  name: string;
  status: "open" | "closed";
  /** Rendered left of the name in the accordion trigger row — matches the queue's channel type (chat/voice/voicemail/task). */
  icon: LucideIcon;
  /** Drives both the body copy ("{N} contacts in queue") and the "Contacts" metric at the end of the row, so the two numbers can't drift apart. */
  contactsCount: number;
  /** Drives the "Skills" metric at the end of the row. */
  skillsCount: number;
  /** "Agents" metric on the home tab's queue widget — a static per-queue headcount (not derived from `QueueSubItem`, which has no single "assigned agents" total of its own to stay in sync with). */
  agentsCount: number;
  channel: string;
  wait: string;
  caseId: string;
  interactions: ContactInteraction[];
}

/* Sample interaction-history rows, cycled per contact so each accordion's
   interior table has a few realistic-looking prior interactions. Each source
   pairs a Type icon (email/chat/voice) with a real-looking channel + skill label. */
const INTERACTION_CHANNELS: { type: ContactInteraction["type"]; channel: string; skill: string }[] = [
  { type: "chat",  channel: "mojo_finance_async", skill: "" },
  { type: "email", channel: "CXi SME Email",      skill: "Chat_General" },
  { type: "chat",  channel: "Chat_General",       skill: "Chat_General" },
  { type: "chat",  channel: "Rebooking_Chat",     skill: "Rebooking" },
  { type: "voice", channel: "Voice_General",      skill: "" },
  { type: "email", channel: "Email_Support",      skill: "Billing_Support" },
  { type: "chat",  channel: "SMS_General",        skill: "Technical_Support" },
];

const RESOLUTION_TIMES = ["0 sec", "12 sec", "45 sec", "1 min", "2 min", "3 min", "5 min", "8 min"];

/* Logged-in agent — matches the "Good morning, John" home screen greeting.
   Used both to populate the Owner Assignee column and to decide whether an
   interaction's kebab menu should offer "Assign To Me" (only when it isn't
   already his). */
const CURRENT_AGENT_NAME = "John Smith";
const [CURRENT_AGENT_FIRST_NAME, CURRENT_AGENT_LAST_NAME] = CURRENT_AGENT_NAME.split(" ");

/* Home tab greeting — "Good morning/afternoon/evening" based on the
   visitor's actual local time (not the static "Good morning" the welcome
   modal below always shows), read fresh on every render. */
function getGreetingPeriod(): "morning" | "afternoon" | "evening" {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

/* Welcome modal — last login timestamp, assigned-skills count, and live
   online/available teammate counts shown under the greeting. */
const WELCOME_MODAL_LAST_LOGIN = "Today at 8:42 AM";
const AGENT_SKILLS_COUNT = 3;
const TEAMMATES_ONLINE_COUNT = 8;
const TEAMMATES_AVAILABLE_COUNT = 5;

const INTERACTION_OWNERS = [
  "John Smith",
  "Kevin Jensen",
  "Andres Arenas",
  "Priya Anand",
  "Erwin de Vera",
  "Tim O'Connor",
  "Josh Robertson",
];

/* Deterministic 12-digit case-ID generator (no Math.random, so the dashboard
   renders the same sample data on every load) */
function makeCaseId(seed: number, i: number): string {
  return String(470000000000 + seed * 111111 + i * 7777);
}

function formatCreateDate(seed: number, i: number): string {
  const month = 1 + ((seed * 5 + i) % 12);
  const day = 1 + ((seed * 3 + i * 5) % 28);
  const year = 24 + ((seed + i) % 3);
  const hour24 = (seed * 2 + i * 3) % 24;
  const minute = (seed * 7 + i * 13) % 60;
  const isPM = hour24 >= 12;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}/${year} ${hour12}:${String(minute).padStart(2, "0")} ${isPM ? "PM" : "AM"}`;
}

/* contactStatus drives every interaction's status: a closed case has every
   interaction closed; an open case has exactly one (its most recent, i === 0)
   still-open interaction — which also has no resolution time yet — while the
   rest of its history is closed. */
function buildInteractions(seed: number, contactStatus: "open" | "closed", count: number): ContactInteraction[] {
  return Array.from({ length: count }, (_, i) => {
    const source = INTERACTION_CHANNELS[(seed + i) % INTERACTION_CHANNELS.length];
    const isStillOpen = contactStatus === "open" && i === 0;
    return {
      id: `${seed}-${i}`,
      caseId: makeCaseId(seed, i),
      priority: 0,
      type: source.type,
      direction: i % 2 === 0 ? "inbound" : "outbound",
      createDate: formatCreateDate(seed, i),
      status: isStillOpen ? "open" : "closed",
      channel: source.channel,
      resolutionTime: isStillOpen ? "—" : RESOLUTION_TIMES[(seed * 3 + i * 5) % RESOLUTION_TIMES.length],
      skill: source.skill,
      owner: INTERACTION_OWNERS[(seed * 5 + i * 3) % INTERACTION_OWNERS.length],
    };
  });
}

/* ── Queue widget side panel (drill-down) ──
   Clicking one of the four home-tab queue widgets opens the interior panel
   with this queue's own skills — e.g. "Digital" breaks down into its own
   channels (UX Chat, UX Email, UX SMS, Social Support). Each row shows an
   icon matching its own label (not a single icon reused across every row),
   how many contacts are waiting, the longest wait time, and — per explicit
   confirmation — the same Available/Working/Unavailable agent breakdown
   the Activity/Productivity cards already use: same icons
   (CheckCircle2/CircleDot/MinusCircle), same success/warning/critical
   colors, same left-to-right order, just rendered as compact circular
   `Icon` badges here instead of a donut or bar.

   `INITIAL_QUEUE_SUB_ITEMS` is only the *seed* — the component below holds
   the live copy in `queueSubItems` state (see "Live queue simulation" near
   the component's other state) so the home tab's Contacts metric can
   visibly fluctuate over time while staying derived from this same list
   (see `sumInQueue` below), not an independently-randomized number.

   Defined before the queue-widget row (rather than after, as it originally
   was) so each queue widget's `skillsCount` can be derived from this
   list's own length — see the comment on `LATEST_CONTACTS_STATIC` below. */
interface QueueSubItem {
  id: string;
  label: string;
  icon: LucideIcon;
  inQueueCount: number;
  wait: string;
  available: number;
  working: number;
  unavailable: number;
}

const INITIAL_QUEUE_SUB_ITEMS: Record<string, QueueSubItem[]> = {
  "1": [
    { id: "d1", label: "UX Chat",         icon: MessageSquare, inQueueCount: 2, wait: "3m 5s", available: 3, working: 1, unavailable: 0 },
    { id: "d2", label: "UX Email",        icon: Mail,          inQueueCount: 2, wait: "3m 5s", available: 3, working: 1, unavailable: 0 },
    { id: "d3", label: "UX SMS",          icon: MessageCircle, inQueueCount: 2, wait: "3m 5s", available: 3, working: 1, unavailable: 0 },
    { id: "d4", label: "Social Support",  icon: Share2,        inQueueCount: 2, wait: "3m 5s", available: 3, working: 1, unavailable: 0 },
  ],
  "2": [
    { id: "v1", label: "AKR_Phone_IB",              icon: PhoneIncoming, inQueueCount: 0, wait: "0s", available: 0, working: 0, unavailable: 1 },
    { id: "v2", label: "AKR_Phone_IB_Sales",        icon: PhoneIncoming, inQueueCount: 0, wait: "0s", available: 0, working: 0, unavailable: 1 },
    { id: "v3", label: "Auto Attendant",            icon: PhoneIncoming, inQueueCount: 0, wait: "0s", available: 0, working: 0, unavailable: 1 },
    { id: "v4", label: "Auto Inbound",               icon: PhoneIncoming, inQueueCount: 0, wait: "0s", available: 0, working: 0, unavailable: 1 },
    { id: "v5", label: "KJ_Inbound_Phone",          icon: PhoneIncoming, inQueueCount: 0, wait: "0s", available: 1, working: 0, unavailable: 1 },
    { id: "v6", label: "mojo_finance_voice_support", icon: PhoneIncoming, inQueueCount: 0, wait: "0s", available: 0, working: 0, unavailable: 1 },
  ],
  "3": [
    { id: "vm1", label: "UX Voicemail",  icon: Voicemail, inQueueCount: 3, wait: "15m", available: 1, working: 0, unavailable: 1 },
    { id: "vm2", label: "After-Hours VM", icon: Voicemail, inQueueCount: 0, wait: "0s",  available: 0, working: 0, unavailable: 0 },
  ],
  "4": [
    { id: "w1", label: "Case Management", icon: ClipboardList, inQueueCount: 4, wait: "30m", available: 2, working: 3, unavailable: 0 },
    { id: "w2", label: "Escalations",     icon: ClipboardList, inQueueCount: 1, wait: "10m", available: 1, working: 1, unavailable: 0 },
    { id: "w3", label: "Billing Review",  icon: ClipboardList, inQueueCount: 0, wait: "0s",  available: 1, working: 0, unavailable: 0 },
  ],
  "5": [
    { id: "ov1", label: "Outbound_Sales_Voice",       icon: PhoneOutgoing, inQueueCount: 1, wait: "0s", available: 2, working: 1, unavailable: 0 },
    { id: "ov2", label: "Outbound_Renewals",          icon: PhoneOutgoing, inQueueCount: 0, wait: "0s", available: 1, working: 0, unavailable: 0 },
    { id: "ov3", label: "Outbound_Win_Back_Campaign", icon: PhoneOutgoing, inQueueCount: 1, wait: "0s", available: 1, working: 1, unavailable: 1 },
  ],
};

/* Contact-in-queue counts for each queue widget — NOT independently
   randomized (that was the bug: an earlier version generated these with
   `randomContactsCount()`, a plausible-looking number with no connection to
   the actual queue data, so the metric card's "Contacts" count and the side
   panel's own "In Queue" figures for the same queue could — and did —
   disagree, e.g. "2 Contacts" on a queue whose sub-items summed to 5).
   Fixed the same way `skillsCount` already worked, and still true now that
   the source list is React state instead of a module constant: derived
   directly from a `QueueSubItem[]`, the same list the side panel renders,
   so the two can never drift apart — including while the live simulation
   below is nudging that list's counts up and down. */
function sumInQueue(items: QueueSubItem[]): number {
  return items.reduce((total, item) => total + item.inQueueCount, 0);
}

/** Static per-queue "Agents" metric for the home tab's queue widgets — a
 *  headcount `QueueSubItem` has no single equivalent of (its own
 *  available/working/unavailable are per-channel, not a queue-wide total),
 *  so unlike `contactsCount`/`skillsCount` this one has no underlying list
 *  to derive from and is just seeded to match the reference screenshot. */
const AGENTS_COUNT_BY_QUEUE: Record<string, number> = { "1": 3, "2": 2, "3": 3, "4": 11, "5": 4 };

/** Baseline queue-wait seconds (matches the reference screenshot's
 *  00:02:34 / 00:00:00 / 00:02:00 / 00:00:24) — the component below adds
 *  the shared `clockTick` counter to these every render so the home tab's
 *  "Wait Time" ticks up in real time like a live clock, the same
 *  convention `formatElapsedTime`'s callers already use for interaction
 *  elapsed-time displays. */
const QUEUE_WAIT_BASE_SECONDS: Record<string, number> = { "1": 154, "2": 0, "3": 120, "4": 24, "5": 0 };

/* Everything about each queue widget that never changes on its own — kept
   separate from the derived/ticking fields (`contactsCount`, `skillsCount`,
   `agentsCount`, `wait`) so those can be recomputed each render (see the
   `latestContacts` useMemo inside the component) without re-running
   `buildInteractions` every tick. */
const LATEST_CONTACTS_STATIC: Omit<LatestContact, "contactsCount" | "skillsCount" | "agentsCount" | "wait">[] = [
  { id: "1", name: "Digital",       icon: MessageSquare, status: "open",   channel: "Atlas", caseId: "CST-21009", interactions: buildInteractions(1, "open", 3) },
  { id: "2", name: "Inbound Voice", icon: PhoneIncoming, status: "open",   channel: "Atlas", caseId: "CST-21016", interactions: buildInteractions(2, "open", 5) },
  { id: "3", name: "Voicemail",     icon: Voicemail,     status: "closed", channel: "Atlas", caseId: "CST-21028", interactions: buildInteractions(3, "closed", 1) },
  { id: "4", name: "Work Item",     icon: ClipboardList, status: "open",   channel: "Emily", caseId: "CST-15001", interactions: buildInteractions(4, "open", 7) },
  { id: "5", name: "Outbound Voice", icon: PhoneOutgoing, status: "open",  channel: "Atlas", caseId: "CST-21042", interactions: buildInteractions(5, "open", 2) },
];

/* ── Home screen summary cards ── */

type DateFilterValue = "today" | "yesterday" | "last7" | "custom";

/* Dummy Performance data per date range — drives the Performance summary
   card's rows/footer so the numbers actually change when a range is picked.
   `overallPerformance` is a percentage (replaces the old "CSAT Score"
   0-5 rating), stored pre-formatted with the "%" like every other range
   here does with its own unit. */
const PERFORMANCE_DATA_BY_RANGE: Record<
  DateFilterValue,
  { casesResolved: string; overallPerformance: string; handleTime: string; improvement: string }
> = {
  today:     { casesResolved: "12",  overallPerformance: "96%", handleTime: "8m 32s", improvement: "15% improvement" },
  yesterday: { casesResolved: "19",  overallPerformance: "92%", handleTime: "9m 05s", improvement: "8% improvement" },
  last7:     { casesResolved: "104", overallPerformance: "94%", handleTime: "8m 50s", improvement: "11% improvement" },
  custom:    { casesResolved: "—",   overallPerformance: "—",   handleTime: "—",      improvement: "Select a range" },
};

/* Channel Type breakdown (Performance card) — Inbound/Outbound call counts,
   "you" vs. "team", per date range. Same static-meta + per-range-values
   split as `PRODUCTIVITY_STATUS_META`/`PRODUCTIVITY_DATA_BY_RANGE` below,
   and rendered with that same row shape (icon+label+value, indented "Team"
   comparison line beneath) rather than a literal `Table` — a plain stacked
   list reads fine for 2-3 rows and keeps this card visually consistent
   with the Productivity card right next to it. */

type ChannelTypeId = "inbound" | "outbound";

interface ChannelTypeMeta {
  id: ChannelTypeId;
  label: string;
  icon: LucideIcon;
}

const CHANNEL_TYPE_META: ChannelTypeMeta[] = [
  { id: "inbound",  label: "Inbound",  icon: PhoneIncoming },
  { id: "outbound", label: "Outbound", icon: PhoneOutgoing },
];

interface ChannelTypeValue {
  you: number;
  team: number;
}

const CHANNEL_TYPE_DATA_BY_RANGE: Record<DateFilterValue, Record<ChannelTypeId, ChannelTypeValue>> = {
  // Matches the reference screenshot's all-zero state — no calls logged yet today.
  today: {
    inbound:  { you: 0, team: 0 },
    outbound: { you: 0, team: 0 },
  },
  yesterday: {
    inbound:  { you: 14, team: 162 },
    outbound: { you: 9,  team: 98  },
  },
  last7: {
    inbound:  { you: 88, team: 1024 },
    outbound: { you: 52, team: 640  },
  },
  custom: {
    inbound:  { you: 0, team: 0 },
    outbound: { you: 0, team: 0 },
  },
};

/** "% of Team" for a single row — you as a share of the team total. 0 when the team total is 0 (avoids dividing by zero). */
function percentOfTeam(you: number, team: number): number {
  return team > 0 ? Math.round((you / team) * 100) : 0;
}

/* ── Productivity breakdown card (agent state duration bars + date filter chip) ──
   Replaces the third summary card slot — same Container/header styling as the
   Schedule/Performance stat cards (no Table), with a FilterChip (search + Select
   All + checkbox options) for the date filter in the header. Each agent state
   (Available/Working/Unavailable) shows the agent's own duration bar + time,
   plus a lighter "Team" comparison bar + time beneath it. Static id/label/icon
   metadata is kept separate from the per-range numeric values so the date
   filter can swap the values without touching the row definitions. */

type ProductivityStatusId = "available" | "working" | "unavailable";

interface ProductivityStatusMeta {
  id: ProductivityStatusId;
  label: string;
  icon: LucideIcon;
  iconColorClassName: string;
}

const PRODUCTIVITY_STATUS_META: ProductivityStatusMeta[] = [
  { id: "available",   label: "Available",   icon: CheckCircle2, iconColorClassName: "text-lyra-status-success-strong" },
  { id: "working",     label: "Working",     icon: CircleDot,    iconColorClassName: "text-lyra-status-warning-strong" },
  { id: "unavailable", label: "Unavailable", icon: MinusCircle,  iconColorClassName: "text-lyra-status-critical-strong" },
];

/* Sub-state breakdown shown in the info tooltip on the Productivity card's
   Unavailable row — which specific unavailable codes made up that time. */
const UNAVAILABLE_STATE_BREAKDOWN: { label: string; percent: number }[] = [
  { label: "Bio Break", percent: 100 },
  { label: "Break",     percent: 0 },
  { label: "Meeting",   percent: 0 },
  { label: "Team",      percent: 100 },
];

interface ProductivityStatusValue {
  percent: number;
  teamPercent: number;
  time: string;
  teamTime: string;
}

const PRODUCTIVITY_DATA_BY_RANGE: Record<DateFilterValue, Record<ProductivityStatusId, ProductivityStatusValue>> = {
  today: {
    available:   { percent: 22, teamPercent: 28, time: "01:45:12", teamTime: "02:14:40" },
    working:     { percent: 61, teamPercent: 55, time: "04:53:08", teamTime: "04:24:00" },
    unavailable: { percent: 17, teamPercent: 17, time: "01:21:40", teamTime: "01:21:20" },
  },
  yesterday: {
    available:   { percent: 18, teamPercent: 24, time: "01:26:24", teamTime: "01:55:12" },
    working:     { percent: 67, teamPercent: 58, time: "05:21:36", teamTime: "04:38:24" },
    unavailable: { percent: 15, teamPercent: 18, time: "01:12:00", teamTime: "01:26:24" },
  },
  last7: {
    available:   { percent: 24, teamPercent: 27, time: "13:26:00", teamTime: "15:07:20" },
    working:     { percent: 58, teamPercent: 54, time: "32:26:24", teamTime: "30:14:24" },
    unavailable: { percent: 18, teamPercent: 19, time: "10:04:48", teamTime: "10:38:16" },
  },
  custom: {
    available:   { percent: 0, teamPercent: 0, time: "00:00:00", teamTime: "00:00:00" },
    working:     { percent: 0, teamPercent: 0, time: "00:00:00", teamTime: "00:00:00" },
    unavailable: { percent: 0, teamPercent: 0, time: "00:00:00", teamTime: "00:00:00" },
  },
};

const DATE_FILTER_OPTIONS: { value: DateFilterValue; label: string }[] = [
  { value: "today",     label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7",     label: "Last 7 days" },
  { value: "custom",    label: "Custom" },
];

/* Single-select date filter chip — same trigger styling as FilterChip's
   "default" (neutral) variant, via the exported filterChipVariants, so it
   matches the same gray chip look FilterChip itself uses whenever nothing
   is actively narrowing/differing from the norm — including DashboardCard's
   own header FilterChip in its unselected state. This picker always has
   *some* range selected ("Today" by default), but that's just its resting
   state, not a filter being "applied" the way FilterChip's blue "active"
   variant signals — so it shouldn't render permanently blue the way
   `variant: "active"` did before. Uses a RadioGroup (not checkboxes) in the
   popover since only one range can be selected at a time. Selecting
   "Custom" reveals a DateRangePicker beneath the radio list. */
function DateFilterChip({ onValueChange }: { onValueChange?: (value: DateFilterValue) => void }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<DateFilterValue>("today");
  const [customRange, setCustomRange] = useState<DateRange | undefined>(undefined);

  const selectedLabel = DATE_FILTER_OPTIONS.find((o) => o.value === value)?.label ?? "";

  const handleValueChange = (v: DateFilterValue) => {
    setValue(v);
    onValueChange?.(v);
  };

  return (
    // Tooltip wraps the Popover from the OUTSIDE (not the other way around)
    // — CONTRIBUTING.md §16 "Portals still bubble through the React tree":
    // wiring it any other way risks the tooltip re-triggering off hover
    // inside the popover's own portaled content. `disabled` while `open` is
    // true keeps the tooltip from competing with the already-open popover
    // for the same corner of the screen. Mainly earns its keep once the
    // chip has collapsed to the icon-only kebab below 480px (see
    // lyra-tokens.css's "Filter chip icon collapse" family) — there's no
    // visible "Date: Today" label left at that point for a sighted user to
    // read at a glance, and no accessible name for anyone else without this
    // (the `aria-label` below covers screen readers either way, but the
    // visible tooltip matters for sighted mouse users too).
    <Tooltip content={`Date filter: ${selectedLabel}`} placement="bottom" disabled={open}>
      <span className="inline-flex">
        <Popover
          open={open}
          onOpenChange={setOpen}
          placement="bottom"
          content={
            <div className="flex flex-col gap-3 p-3 w-[260px]">
              <RadioGroup value={value} onValueChange={(v) => handleValueChange(v as DateFilterValue)}>
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
          <button
            type="button"
            aria-label={open ? "Close date filter" : `Date filter: ${selectedLabel}`}
            className={cn(filterChipVariants({ variant: "default" }), "rounded-lyra-md lyra-container-header-filter-trigger")}
          >
            {/* Full label — hidden below 480px of the header's own width (see
                lyra-tokens.css's "Filter chip icon collapse" family) in favor
                of the compact kebab icon below, both wired to this same
                Popover trigger/open state. */}
            <span className="lyra-container-header-filter-full inline-flex items-baseline gap-1">
              <span className="lyra-body-md-emphasis whitespace-nowrap">Date:</span>
              <span className="lyra-body-md truncate">{selectedLabel}</span>
            </span>
            <ChevronDown className={cn("lyra-container-header-filter-full h-3.5 w-3.5 flex-shrink-0 transition-transform", open && "rotate-180")} strokeWidth={1.5} aria-hidden="true" />
            <MoreVertical className="lyra-container-header-filter-compact h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </Popover>
      </span>
    </Tooltip>
  );
}

/* ── Activity card (donut chart) ──
   Replaces the old Schedule summary card. Reuses the same Available/Working/
   Unavailable status metadata and values as the ring chart at the bottom of
   the Productivity card below (see `ACTIVITY_STATUS_COLORS`), so the two
   stay visually consistent — same colors, same percentages. */
const ACTIVITY_STATUS_COLORS: Record<ProductivityStatusId, { dotClassName: string; colorVar: string }> = {
  available:   { dotClassName: "bg-lyra-status-success-strong",  colorVar: "var(--lyra-color-status-success-strong)" },
  working:     { dotClassName: "bg-lyra-status-warning-strong",  colorVar: "var(--lyra-color-status-warning-strong)" },
  unavailable: { dotClassName: "bg-lyra-status-critical-strong", colorVar: "var(--lyra-color-status-critical-strong)" },
};

/* Productivity breakdown card — agent state duration bars (Available/
   Working/Unavailable, each with a "Team" comparison line beneath) plus,
   below all three rows, the same ring-chart + legend that used to be its
   own standalone "Activity" card. Folded into this card (rather than kept
   separate) on request — the ring visualizes the exact same
   Available/Working/Unavailable percentages already listed above it, so it
   reads as one more view of this card's own data instead of a second card
   repeating it. Both the rows and the ring now share the one live
   `dateFilter`/`values` this card already owns — the ring is no longer
   pinned to "today" the way the standalone Activity card was. */
function PerformanceBreakdownCard() {
  const [dateFilter, setDateFilter] = useState<DateFilterValue>("today");
  const values = PRODUCTIVITY_DATA_BY_RANGE[dateFilter];
  const ringData = PRODUCTIVITY_STATUS_META.map((meta) => ({
    id: meta.id,
    label: meta.label,
    percent: values[meta.id].percent,
    ...ACTIVITY_STATUS_COLORS[meta.id],
  }));

  return (
    <DashboardCard
      variant="neutral-subtle"
      headerTitle="Productivity"
      headerIcon={<Icon icon={Gauge} size="md" background="info" shape="rounded" decorative />}
      headerActions={<DateFilterChip onValueChange={setDateFilter} />}
      // No `SearchInput` here to wrap — `actionsWrap` is only turned on so
      // its container-query boundary exists for `DateFilterChip`'s own
      // icon-collapse (see lyra-tokens.css's "Filter chip icon collapse"
      // family, which reuses this same ancestor). The row-wrap half of
      // `actionsWrap` is a no-op with a single action child either way.
      headerActionsWrap
    >
      <div className="flex flex-col gap-4 px-4 pb-4">
        {PRODUCTIVITY_STATUS_META.map((meta) => {
          const row = values[meta.id];
          return (
            <div key={meta.id} className="flex flex-col gap-1.5">
              {/* Self row */}
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 lyra-body-md-emphasis text-lyra-fg-default">
                  <meta.icon className={cn("h-4 w-4", meta.iconColorClassName)} strokeWidth={1.5} />
                  {meta.label}
                  <span className="lyra-body-sm text-lyra-fg-secondary font-normal">({row.percent}%)</span>
                  {meta.id === "unavailable" && (
                    <Tooltip
                      placement="right"
                      content={
                        <div className="flex flex-col gap-1">
                          {UNAVAILABLE_STATE_BREAKDOWN.map((state) => (
                            <span key={state.label} className="lyra-body-sm text-lyra-fg-default whitespace-nowrap">
                              {state.label} ({state.percent}%)
                            </span>
                          ))}
                        </div>
                      }
                    >
                      <span className="inline-flex items-center text-lyra-fg-secondary hover:text-lyra-fg-action transition-colors cursor-default">
                        <Info className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                        <span className="sr-only">
                          Unavailable breakdown: {UNAVAILABLE_STATE_BREAKDOWN.map((s) => `${s.label} (${s.percent}%)`).join(", ")}
                        </span>
                      </span>
                    </Tooltip>
                  )}
                </span>
                <span className="lyra-body-md-emphasis tabular-nums text-lyra-fg-default">{row.time}</span>
              </div>
              {/* Team comparison row */}
              <div className="flex items-center justify-between gap-3 pl-6">
                <span className="lyra-body-sm text-lyra-fg-secondary">Team ({row.teamPercent}%)</span>
                <span className="lyra-body-sm tabular-nums text-lyra-fg-secondary">{row.teamTime}</span>
              </div>
            </div>
          );
        })}

        <Separator />

        {/* Ring chart + legend — same Available/Working/Unavailable data as
            the rows above, just visualized as a ring instead of stacked bars. */}
        <div className="flex items-center gap-6">
          <div className="h-[120px] w-[120px] shrink-0">
            <DonutChart
              data={ringData.map((d) => ({ label: d.label, value: d.percent, colorVar: d.colorVar }))}
            />
          </div>
          <div className="flex flex-1 flex-col gap-2.5">
            {ringData.map((d) => (
              <div key={d.id} className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 lyra-body-md text-lyra-fg-secondary">
                  <span className={cn("h-2.5 w-2.5 rounded-full", d.dotClassName)} aria-hidden="true" />
                  {d.label}
                </span>
                <span className="lyra-heading-sm text-lyra-fg-default">{d.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}

/* Performance summary card — mirrors PerformanceBreakdownCard's pattern:
   owns its own date filter state and looks up dummy data per range so the
   Assignments Resolved / Overall Performance numbers — and the Channel Type
   breakdown below them — change when a range is picked. */
function PerformanceSummaryCard() {
  const [dateFilter, setDateFilter] = useState<DateFilterValue>("today");
  const data = PERFORMANCE_DATA_BY_RANGE[dateFilter];
  const channelData = CHANNEL_TYPE_DATA_BY_RANGE[dateFilter];
  const overallYou = CHANNEL_TYPE_META.reduce((sum, meta) => sum + channelData[meta.id].you, 0);
  const overallTeam = CHANNEL_TYPE_META.reduce((sum, meta) => sum + channelData[meta.id].team, 0);

  return (
    <DashboardCard
      variant="neutral-subtle"
      headerTitle="Performance"
      headerIcon={<Icon icon={TrendingUp} size="md" background="success" shape="rounded" decorative />}
      headerActions={<DateFilterChip onValueChange={setDateFilter} />}
      // See PerformanceBreakdownCard's identical `headerActionsWrap` comment.
      headerActionsWrap
    >
      <div className="flex flex-col gap-3 px-4 pb-4">
        <div className="flex items-center justify-between">
          <span className="lyra-body-md text-lyra-fg-secondary">Assignments Resolved</span>
          <span className="lyra-heading-sm text-lyra-fg-default">{data.casesResolved}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="lyra-body-md text-lyra-fg-secondary">Overall Performance</span>
          <span className="lyra-heading-sm text-lyra-status-success-strong">{data.overallPerformance}</span>
        </div>
        <Separator />

        {/* Channel Type breakdown — same row shape as PerformanceBreakdownCard's
            Productivity rows (icon+label+value, indented "Team" comparison line
            beneath) rather than a Table, so this section reads consistently with
            the card right next to it. */}
        <span className="lyra-body-sm-emphasis text-lyra-fg-secondary">Channel Type</span>
        <div className="flex flex-col gap-4">
          {CHANNEL_TYPE_META.map((meta) => {
            const row = channelData[meta.id];
            const pct = percentOfTeam(row.you, row.team);
            return (
              <div key={meta.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 lyra-body-md-emphasis text-lyra-fg-default">
                    <meta.icon className="h-4 w-4 text-lyra-fg-secondary" strokeWidth={1.5} />
                    {meta.label}
                  </span>
                  <span className="lyra-body-md-emphasis tabular-nums text-lyra-fg-default">{row.you}</span>
                </div>
                <div className="flex items-center justify-between gap-3 pl-6">
                  <span className="lyra-body-sm text-lyra-fg-secondary">Team ({pct}% of Team)</span>
                  <span className="lyra-body-sm tabular-nums text-lyra-fg-secondary">{row.team}</span>
                </div>
              </div>
            );
          })}

          <Separator />

          {/* Overall — the summed total, same row shape but with no icon and no indent on its own Team line (it's a total, not a per-channel comparison). */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3">
              <span className="lyra-body-md-emphasis text-lyra-fg-default">Overall</span>
              <span className="lyra-body-md-emphasis tabular-nums text-lyra-fg-default">{overallYou}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="lyra-body-sm text-lyra-fg-secondary">Team ({percentOfTeam(overallYou, overallTeam)}% of Team)</span>
              <span className="lyra-body-sm tabular-nums text-lyra-fg-secondary">{overallTeam}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}

/* ── Contact History card (home tab, below Performance/Productivity) ──
   A recent-customer-contacts summary — name, resolution status, an optional
   "Redial" action for voice contacts, a one-line case summary, case ID, and
   (right-aligned) the channel + how long ago it happened, plus the handle
   time. The base 5 rows (`CONTACT_HISTORY`) are from a screenshot of
   exactly this content, so those values are that screenshot's own data,
   not derived from any other part of the app. Composed entirely from
   existing lyra-ui atoms — `DashboardCard` for the card shell
   (`headerActions` holding this card's own `ContactHistoryDateFilterChip`
   — a separate, 3-option "Today / Last 48 Hours / Last 72 Hours"
   control, not the shared `DateFilterChip` the Performance/Productivity
   cards' headers use, since this card's range options and cumulative-
   window semantics are its own — see `ContactHistoryDateFilterValue`'s own
   doc comment for why), `Badge` (`shape="circle" dot`) + plain text for the
   status indicator (critical=red/Escalated, info=blue/In Progress,
   success=green/Resolved, neutral=gray/New), and a plain `Button
   variant="outline"` for "Redial" (reusing the same `PhoneOutgoing` icon
   `InteractionRowActions`' kebab menu already uses for its own "Redial"
   action, rather than inventing a second icon for the same meaning) — no
   hand-rolled badge/pill markup.

   Row set is driven by the selected date range (`CONTACT_HISTORY_BY_RANGE`):
   "Today" (the default on login) shows `TODAY_CONTACT_HISTORY`'s 4 rows;
   "Last 48 Hours" adds the 5 hand-authored `CONTACT_HISTORY` rows on top
   of that; "Last 72 Hours" adds 5 more (`EXTENDED_CONTACT_HISTORY`)
   pulled from the shared customer "database" (`CREATE_NEW_CUSTOMERS`, the
   same fixture `OUTBOUND_CUSTOMERS` above already sources from) rather than
   inventing unrelated names. Each range is a strict superset of the one
   before it — today's own rows never disappear just because a wider range
   is selected. */

/** Case-status color — "critical" (red, Escalated), "info" (blue, In
 *  Progress), "success" (green, Resolved), "neutral" (gray, New). Reuses
 *  `Badge`'s own `BadgeCircleVariant` names directly (see the status
 *  badge's own rendering below) rather than a separate string union, so
 *  there's no separate mapping table that could drift out of sync with
 *  what `Badge` actually accepts. */
type ContactHistoryStatusVariant = "critical" | "info" | "success" | "neutral";

interface ContactHistoryEntry {
  id: string;
  name: string;
  statusLabel: string;
  statusVariant: ContactHistoryStatusVariant;
  /** Voice contacts only — shows a "Redial" action next to the status tag. */
  redial: boolean;
  description: string;
  caseId: string;
  channelType: "voice" | "chat" | "email";
  channelLabel: string;
  timeAgo: string;
  duration: string;
  /** The real `CREATE_NEW_CUSTOMERS` record id backing this row, when this
   *  entry was built from that fixture (see `buildContactHistoryFromCustomers`
   *  below) — undefined for the hand-authored `CONTACT_HISTORY` rows above,
   *  which have no real customer record behind their invented names/case
   *  IDs. `handleRedial` uses this (when present) as the redialed
   *  interaction's own id instead of a synthetic `redial:` one, so the
   *  resulting card's id resolves in `useOutboundAddButton`'s contact
   *  lookup the exact same way a card started from the Outbound picker
   *  does — see `handleRedial`'s own doc comment for why a synthetic id
   *  silently broke that card's "+" (Add Channel) button. */
  customerId?: string;
}

const CONTACT_HISTORY_CHANNEL_ICON: Record<ContactHistoryEntry["channelType"], LucideIcon> = {
  voice: Phone,
  chat:  MessageCircle,
  email: Mail,
};

const CONTACT_HISTORY: ContactHistoryEntry[] = [
  {
    id: "ch1", name: "Nathan Cole", statusLabel: "Resolved", statusVariant: "success", redial: true,
    description: "Customer was locked out after 5 failed attempts. Verified identity via KBA, reset credentials, and confirmed access restored.",
    caseId: "CST-22841", channelType: "voice", channelLabel: "Voice", timeAgo: "8m ago", duration: "8m 14s",
  },
  {
    id: "ch2", name: "Priya Shah", statusLabel: "Resolved", statusVariant: "success", redial: false,
    description: "Duplicate charge dispute — $89.99 refund issued",
    caseId: "CST-30164", channelType: "chat", channelLabel: "Chat", timeAgo: "34m ago", duration: "12m 02s",
  },
  {
    id: "ch3", name: "Omar Farooq", statusLabel: "Resolved", statusVariant: "success", redial: false,
    description: "Plan upgrade confirmation & feature overview",
    caseId: "CST-16823", channelType: "email", channelLabel: "Email", timeAgo: "2h ago", duration: "6m 30s",
  },
  {
    id: "ch4", name: "Lauren Briggs", statusLabel: "Escalated", statusVariant: "critical", redial: true,
    description: "Escalated fraud investigation — 4 suspicious transactions",
    caseId: "CST-27760", channelType: "voice", channelLabel: "Voice", timeAgo: "5h ago", duration: "22m 47s",
  },
  {
    id: "ch5", name: "Mei Tanaka", statusLabel: "Resolved", statusVariant: "success", redial: false,
    description: "Shipping delay — expedited replacement dispatched",
    caseId: "CST-31045", channelType: "chat", channelLabel: "Chat", timeAgo: "1d ago", duration: "9m 15s",
  },
];

const CONTACT_HISTORY_CHANNEL_LABEL: Record<ContactHistoryEntry["channelType"], string> = {
  voice: "Voice",
  chat: "Chat",
  email: "Email",
};

/** Channel-type tag color — Voice/Chat/Email each get one of `Tag`'s fixed
 *  "purple"/"teal"/"pink" accent variants (see CONTRIBUTING.md's "Channel
 *  type colors" convention) rather than a one-off className per row, so
 *  any other spot that adds a channel-type tag later picks the same
 *  mapping instead of inventing its own. */
const CONTACT_HISTORY_CHANNEL_TAG_VARIANT: Record<ContactHistoryEntry["channelType"], TagVariant> = {
  voice: "purple",
  chat: "teal",
  email: "pink",
};

/** Same Voice/Chat/Email → purple/teal/pink mapping as
 *  `CONTACT_HISTORY_CHANNEL_TAG_VARIANT` above, as plain icon-color
 *  classes instead of a `Tag` variant — for spots like
 *  `InteractionsTable`'s per-row type icon, where the channel indicator is
 *  a bare icon (no room for a pill in a 48px column) but should still tint
 *  to the same three hues rather than sitting flat gray. */
const CHANNEL_TYPE_ICON_COLOR_CLASS: Record<ContactHistoryEntry["channelType"], string> = {
  voice: "text-lyra-accent-purple-strong",
  chat: "text-lyra-accent-teal-strong",
  email: "text-lyra-accent-pink-strong",
};

/** Maps a customer's supported `ChannelType[]` (from `CREATE_NEW_CUSTOMERS`,
 *  e.g. `["email", "sms", "voice"]`) down to Contact History's own narrower
 *  channel grouping — voice takes priority (it's what "Redial" needs),
 *  then sms/whatsapp both read as "Chat", falling back to "Email" (every
 *  customer record includes it). */
function contactHistoryChannelType(channels: ChannelType[]): ContactHistoryEntry["channelType"] {
  if (channels.includes("voice")) return "voice";
  if (channels.includes("sms") || channels.includes("whatsapp")) return "chat";
  return "email";
}

/** Shared per-row content shape for every customer-derived (as opposed to
 *  hand-authored, like `CONTACT_HISTORY` above) Contact History row —
 *  everything except what's already on the `CREATE_NEW_CUSTOMERS` record
 *  itself (name/caseId) or derived from it (channelType/channelLabel/
 *  redial, via `contactHistoryChannelType`). */
interface ContactHistoryTemplate {
  statusLabel: string;
  statusVariant: ContactHistoryStatusVariant;
  description: string;
  timeAgo: string;
  duration: string;
}

/** Builds a set of Contact History rows from real `CREATE_NEW_CUSTOMERS`
 *  fixture records — same "deterministic indexes, not `Math.random()`"
 *  convention as the rest of this file's dummy data. `customerIndexes[i]`
 *  pairs with `templates[i]`; `idPrefix` keeps each range's ids from
 *  colliding with another range's (e.g. "Today" vs. "Last 7 days" picking
 *  overlapping customer indexes would otherwise produce duplicate React
 *  keys if both ever rendered in the same list). */
function buildContactHistoryFromCustomers(
  customerIndexes: number[],
  templates: ContactHistoryTemplate[],
  idPrefix: string
): ContactHistoryEntry[] {
  return customerIndexes.map((customerIndex, i) => {
    const customer = CREATE_NEW_CUSTOMERS[customerIndex];
    const channelType = contactHistoryChannelType(customer.channels);
    return {
      id: `${idPrefix}-${customer.id}`,
      name: customer.name,
      // `customer.customerId` is already "CST-…"-prefixed — use it as-is
      // rather than re-prefixing into "CST-CST-…".
      caseId: customer.customerId,
      channelType,
      channelLabel: CONTACT_HISTORY_CHANNEL_LABEL[channelType],
      redial: channelType === "voice",
      // The real `CREATE_NEW_CUSTOMERS` id (e.g. "customer-9") — see
      // `ContactHistoryEntry.customerId`'s own doc comment for why
      // `handleRedial` needs this.
      customerId: customer.id,
      ...templates[i],
    };
  });
}

// Fixed customer indexes + content templates for the 4 "Today" rows — the
// range shown on page load, so these need to read as *today's* activity
// (minutes/an hour or two ago, not "1d ago"+). Indexes chosen to land on
// 4 different customers than "Last 72 Hours" below uses (no index overlap
// with EXTENDED_CONTACT_HISTORY_CUSTOMER_INDEXES) and to alternate
// voice/chat channel types the same way the hand-authored CONTACT_HISTORY
// rows above do (this fixture's own channel-assignment rule — see
// create-new-customers-data.ts's `buildCustomers` — never actually
// produces an email-only customer, so "Today" mixes voice/chat like
// "Last 72 Hours" already does rather than trying to force an email row).
const TODAY_CONTACT_HISTORY_CUSTOMER_INDEXES = [1, 8, 13, 15];
const TODAY_CONTACT_HISTORY_TEMPLATES: ContactHistoryTemplate[] = [
  { statusLabel: "Resolved", statusVariant: "success", description: "Order status inquiry — provided tracking link and delivery estimate", timeAgo: "12m ago", duration: "5m 40s" },
  { statusLabel: "Resolved", statusVariant: "success", description: "Account access issue — reset password after failed login attempts", timeAgo: "45m ago", duration: "9m 22s" },
  { statusLabel: "Escalated", statusVariant: "critical", description: "Billing dispute escalated to Tier 2 for manual review", timeAgo: "1h ago", duration: "11m 08s" },
  { statusLabel: "Resolved", statusVariant: "success", description: "Subscription renewal question — confirmed upcoming billing date", timeAgo: "3h ago", duration: "6m 15s" },
];
const TODAY_CONTACT_HISTORY: ContactHistoryEntry[] = buildContactHistoryFromCustomers(
  TODAY_CONTACT_HISTORY_CUSTOMER_INDEXES,
  TODAY_CONTACT_HISTORY_TEMPLATES,
  "ch-today"
);

// Fixed customer indexes + content templates for the 5 extra rows that
// appear once "Last 72 Hours" is selected (on top of "Last 48 Hours"'s own
// today+yesterday rows) — deterministic (not `Math.random()`), matching
// the rest of this file's dummy-data convention. Names/case IDs come from
// the real `CREATE_NEW_CUSTOMERS` records at these indexes; only the
// description/status/timing are authored here. `timeAgo` is capped at
// "2d ago" (hour 49-72 of the window: today=hours 0-24, yesterday=hours
// 24-48, this batch=hours 48-72) so nothing in "Last 72 Hours" reads as
// older than its own label.
const EXTENDED_CONTACT_HISTORY_CUSTOMER_INDEXES = [5, 12, 19, 26, 33];
const EXTENDED_CONTACT_HISTORY_TEMPLATES: ContactHistoryTemplate[] = [
  { statusLabel: "Resolved", statusVariant: "success", description: "Password reset — identity verified via KBA, access restored", timeAgo: "1d ago", duration: "7m 40s" },
  { statusLabel: "Resolved", statusVariant: "success", description: "Billing question — walked through recent charges, no refund needed", timeAgo: "1d ago", duration: "5m 18s" },
  { statusLabel: "Escalated", statusVariant: "critical", description: "Product setup issue escalated to Tier 2 for configuration support", timeAgo: "2d ago", duration: "14m 05s" },
  { statusLabel: "Resolved", statusVariant: "success", description: "Subscription cancellation request — retention offer accepted", timeAgo: "2d ago", duration: "10m 52s" },
  { statusLabel: "Resolved", statusVariant: "success", description: "Shipping delay follow-up — updated delivery window provided", timeAgo: "2d ago", duration: "4m 27s" },
];
const EXTENDED_CONTACT_HISTORY: ContactHistoryEntry[] = buildContactHistoryFromCustomers(
  EXTENDED_CONTACT_HISTORY_CUSTOMER_INDEXES,
  EXTENDED_CONTACT_HISTORY_TEMPLATES,
  "ch-ext"
);

/** Contact History's own date filter — deliberately a separate type/value
 *  set from the shared `DateFilterValue` (Today/Yesterday/Last 7 days/
 *  Custom) the Productivity/Performance cards' `DateFilterChip` uses: this
 *  card only ever wants 3 cumulative, "as of now" windows, no custom range
 *  picker. Reusing `DateFilterValue` here would either force those other
 *  two cards' filter to change too (they weren't asked to) or require
 *  awkwardly repurposing "yesterday"/"last7" values to mean something else
 *  than their names say. */
type ContactHistoryDateFilterValue = "today" | "last48h" | "last72h";

const CONTACT_HISTORY_DATE_FILTER_OPTIONS: { value: ContactHistoryDateFilterValue; label: string }[] = [
  { value: "today",   label: "Today" },
  { value: "last48h", label: "Last 48 Hours" },
  { value: "last72h", label: "Last 72 Hours" },
];

/* Each range is cumulative (a superset of the one before it) — "Last 48
   Hours" is today's rows plus yesterday's, "Last 72 Hours" adds the day
   before that on top — rather than each range being its own disjoint
   bucket the way the old Today/Yesterday/Last 7 days setup was (selecting
   "Last 7 days" there dropped today's own rows entirely, which read as a
   bug once the range names started actually promising "the last N hours"
   instead of a single day or a disjoint window). */
const CONTACT_HISTORY_BY_RANGE: Record<ContactHistoryDateFilterValue, ContactHistoryEntry[]> = {
  today: TODAY_CONTACT_HISTORY,
  last48h: [...TODAY_CONTACT_HISTORY, ...CONTACT_HISTORY],
  last72h: [...TODAY_CONTACT_HISTORY, ...CONTACT_HISTORY, ...EXTENDED_CONTACT_HISTORY],
};

/* Same trigger/popover chrome as `DateFilterChip` above (filterChipVariants
   "default" trigger, RadioGroup popover) but for `ContactHistoryDateFilterValue`
   specifically and with no "Custom" branch/DateRangePicker — kept as its own
   small component rather than genericizing `DateFilterChip` itself, since
   the two have different value sets and this one is intentionally simpler
   (no custom-range case to handle). */
function ContactHistoryDateFilterChip({ onValueChange }: { onValueChange?: (value: ContactHistoryDateFilterValue) => void }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<ContactHistoryDateFilterValue>("today");

  const selectedLabel = CONTACT_HISTORY_DATE_FILTER_OPTIONS.find((o) => o.value === value)?.label ?? "";

  const handleValueChange = (v: ContactHistoryDateFilterValue) => {
    setValue(v);
    onValueChange?.(v);
  };

  return (
    // See `DateFilterChip`'s identical Tooltip-wraps-Popover composition
    // above (CONTRIBUTING.md §16) for why this is structured outside-in.
    <Tooltip content={`Date filter: ${selectedLabel}`} placement="bottom" disabled={open}>
      <span className="inline-flex">
        <Popover
          open={open}
          onOpenChange={setOpen}
          placement="bottom"
          content={
            <div className="flex flex-col gap-3 p-3 w-[260px]">
              <RadioGroup value={value} onValueChange={(v) => handleValueChange(v as ContactHistoryDateFilterValue)}>
                {CONTACT_HISTORY_DATE_FILTER_OPTIONS.map((option) => (
                  <RadioGroupItem key={option.value} value={option.value} label={option.label} />
                ))}
              </RadioGroup>
            </div>
          }
        >
          <button
            type="button"
            aria-label={open ? "Close date filter" : `Date filter: ${selectedLabel}`}
            className={cn(filterChipVariants({ variant: "default" }), "rounded-lyra-md lyra-container-header-filter-trigger")}
          >
            {/* Full label — hidden below 480px of the header's own width (see
                lyra-tokens.css's "Filter chip icon collapse" family) in favor
                of the compact kebab icon below, both wired to this same
                Popover trigger/open state. */}
            <span className="lyra-container-header-filter-full inline-flex items-baseline gap-1">
              <span className="lyra-body-md-emphasis whitespace-nowrap">Date:</span>
              <span className="lyra-body-md truncate">{selectedLabel}</span>
            </span>
            <ChevronDown className={cn("lyra-container-header-filter-full h-3.5 w-3.5 flex-shrink-0 transition-transform", open && "rotate-180")} strokeWidth={1.5} aria-hidden="true" />
            <MoreVertical className="lyra-container-header-filter-compact h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </Popover>
      </span>
    </Tooltip>
  );
}

function ContactHistoryCard({ onRedial }: { onRedial?: (entry: ContactHistoryEntry) => void }) {
  const [dateFilter, setDateFilter] = useState<ContactHistoryDateFilterValue>("today");
  const [searchQuery, setSearchQuery] = useState("");
  const entries = CONTACT_HISTORY_BY_RANGE[dateFilter];

  // Filters the already date-ranged `entries` down to whatever matches the
  // search box — name, case ID, channel, or the one-line case summary, so
  // a query like "billing" or "CST-30164" both find their row. Case-
  // insensitive substring match, same convention as every other quick
  // search in this app (e.g. `DesktopDesignsPage`'s table toolbar).
  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return entries;
    return entries.filter((entry) =>
      [entry.name, entry.description, entry.caseId, entry.channelLabel].some((field) =>
        field.toLowerCase().includes(query)
      )
    );
  }, [entries, searchQuery]);

  return (
    <DashboardCard
      variant="neutral-subtle"
      headerTitle="Contact History"
      headerIcon={<Icon icon={History} size="md" background="info" shape="rounded" decorative />}
      headerActionsWrap
      // Two real `SearchInput`s, both bound to the same `searchQuery` state
      // — one lives in `headerActions` (visible ≥480px, inline beside the
      // date filter), the other in `headerTabs` (visible <480px, its own
      // full-width row below the title). CSS toggles which one shows (see
      // lyra-tokens.css's "Search inline/below" family); the date filter
      // chip stays in `headerActions` either way and never moves — only
      // search needed room, so search is the only thing that relocates
      // (confirmed from a screenshot: forcing the whole actions block to
      // move together, the previous approach, shoved a lone filter chip
      // onto its own line even on cards with no search box at all).
      headerActions={
        <>
          <SearchInput
            value={searchQuery}
            onValueChange={setSearchQuery}
            placeholder="Search contact history"
            size="sm"
            className="lyra-container-header-search-inline flex-1 min-w-[240px]"
          />
          <ContactHistoryDateFilterChip onValueChange={setDateFilter} />
        </>
      }
      headerTabs={
        // The `-search-below` toggle class goes on this plain OUTER div,
        // not on `SearchInput`'s own className — `SearchInput`'s root is
        // itself `position: relative` and its search icon is positioned
        // `absolute left-3` against that same box, so padding added
        // directly to `SearchInput`'s className would shift the padding
        // edge the icon measures from, throwing the icon out of alignment
        // with the input's own baked-in `pl-9` text padding. Padding lives
        // out here instead, where it can't affect that inner math.
        //
        // `pt-3` — `ContainerHeader`'s `tabs` slot (which this reuses, see
        // its own doc comment) drops the header's normal bottom padding to
        // 0 whenever `tabs` is set, on the assumption its content (usually
        // a `TabList`) supplies its own visual separation via a `border-b`.
        // A `SearchInput` has no such border, so without this it sat
        // flush against the title row above it — confirmed from a
        // screenshot. Plain static padding, not container-query-gated:
        // this whole div is already only visible in the narrow state (see
        // `.lyra-container-header-search-below` in lyra-tokens.css), so
        // there's no "wide" state where this padding needs to disappear.
        <div className="lyra-container-header-search-below px-4 pt-3 pb-3">
          <SearchInput
            value={searchQuery}
            onValueChange={setSearchQuery}
            placeholder="Search contact history"
            size="sm"
            className="w-full"
          />
        </div>
      }
    >
      {filteredEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
          <Inbox className="h-6 w-6 text-lyra-fg-secondary" strokeWidth={1.5} aria-hidden="true" />
          <span className="lyra-body-md text-lyra-fg-secondary">
            {entries.length === 0 ? "Nothing to Display" : "No matching contacts"}
          </span>
        </div>
      ) : (
        <div className="flex flex-col">
          {filteredEntries.map((entry, i) => {
            const ChannelIcon = CONTACT_HISTORY_CHANNEL_ICON[entry.channelType];
            return (
              <div
                key={entry.id}
                className={cn(
                  "flex items-start justify-between gap-4 px-4 py-4 transition-colors hover:bg-lyra-state-hover",
                  i > 0 && "border-t border-lyra-border-subtle"
                )}
              >
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="lyra-body-md-emphasis text-lyra-fg-default">{entry.name}</span>
                    {/* Status badge — dot + label, matching the reference
                        screenshot's status-dropdown rows (colored dot,
                        plain text, no pill background) rather than Tag's
                        bordered/tinted pill: critical=red (Escalated),
                        info=blue (In Progress), success=green (Resolved),
                        neutral=gray (New). */}
                    <span className="inline-flex items-center gap-1.5">
                      <Badge shape="circle" dot size="sm" variant={entry.statusVariant} aria-hidden="true" />
                      <span className="lyra-body-sm-emphasis text-lyra-fg-default">{entry.statusLabel}</span>
                    </span>
                    {entry.redial && (
                      <Button variant="outline" size="sm" onClick={() => onRedial?.(entry)}>
                        <PhoneOutgoing className="h-3.5 w-3.5" strokeWidth={1.5} />
                        Redial
                      </Button>
                    )}
                  </div>
                  <span className="lyra-body-md text-lyra-fg-secondary">{entry.description}</span>
                  <span className="lyra-body-sm text-lyra-fg-secondary">{entry.caseId}</span>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {/* Channel-type pill — "purple"/"teal"/"pink" per
                      CONTACT_HISTORY_CHANNEL_TAG_VARIANT (Voice/Chat/
                      Email), matching the same three `lyra-accent-*`
                      hues CONTRIBUTING.md's "Channel type colors"
                      convention documents, not a one-off tint. */}
                  <Tag
                    label={entry.channelLabel}
                    variant={CONTACT_HISTORY_CHANNEL_TAG_VARIANT[entry.channelType]}
                    shape="pill"
                    icon={<ChannelIcon strokeWidth={1.5} />}
                  />
                  <span className="lyra-body-sm text-lyra-fg-secondary whitespace-nowrap">{entry.timeAgo}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardCard>
  );
}

/* ── Interaction history table (sortable) — content of each Latest Interactions accordion item ── */

type InteractionSortKey = "owner" | "priority" | "createDate" | "status" | "channel" | "resolutionTime" | "skill";

function nextInteractionSortDirection(current: SortDirection): SortDirection {
  if (current === null) return "asc";
  if (current === "asc") return "desc";
  return null;
}

/* Per-row "more options" kebab — opens a Menu with a single contextual
   action: voice interactions offer "Redial", everything else offers "Reopen". */
function InteractionRowActions({ interaction }: { interaction: ContactInteraction }) {
  const [open, setOpen] = useState(false);
  const isVoice = interaction.type === "voice";
  const isAssignedToMe = interaction.owner === CURRENT_AGENT_NAME;

  const items: MenuEntry[] = [];
  items.push(
    isVoice
      ? { id: "redial", label: "Redial", icon: <PhoneOutgoing className="h-4 w-4" strokeWidth={1.5} />, onClick: () => setOpen(false) }
      : {
          id: interaction.status === "open" ? "open-interaction" : "reopen",
          label: interaction.status === "open" ? "Open Interaction" : "Reopen",
          icon: <RotateCcw className="h-4 w-4" strokeWidth={1.5} />,
          onClick: () => setOpen(false),
        }
  );
  if (!isAssignedToMe) {
    items.push({
      id: "assign-to-me",
      label: "Assign To Me",
      icon: <UserPlus className="h-4 w-4" strokeWidth={1.5} />,
      onClick: () => setOpen(false),
    });
  }
  items.push("separator");
  items.push({
    id: "customer-info",
    label: "Customer Information",
    icon: <UserRound className="h-4 w-4" strokeWidth={1.5} />,
    onClick: () => setOpen(false),
  });

  return (
    <Popover open={open} onOpenChange={setOpen} placement="bottom" content={<Menu items={items} />}>
      <button
        type="button"
        aria-label="More options"
        className="flex h-7 w-7 items-center justify-center rounded-lyra-sm text-lyra-fg-secondary hover:bg-lyra-bg-surface-shell transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lyra-border-focus focus-visible:ring-offset-2"
      >
        <MoreVertical className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
      </button>
    </Popover>
  );
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
    const aVal = String(a[sortKey]).toLowerCase();
    const bVal = String(b[sortKey]).toLowerCase();
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[48px] shrink-0"><span className="sr-only">Type</span></TableHead>
          <SortableTableHead className="flex-[1.4]" sortDirection={dirFor("owner")} onSort={() => handleSort("owner")}>Owner Assignee</SortableTableHead>
          <SortableTableHead className="flex-[0.7]" sortDirection={dirFor("priority")} onSort={() => handleSort("priority")}>Priority</SortableTableHead>
          <SortableTableHead className="flex-1" sortDirection={dirFor("createDate")} onSort={() => handleSort("createDate")}>Create Date</SortableTableHead>
          <SortableTableHead className="flex-1" sortDirection={dirFor("status")} onSort={() => handleSort("status")}>Status</SortableTableHead>
          <SortableTableHead className="flex-[1.2]" sortDirection={dirFor("channel")} onSort={() => handleSort("channel")}>Channel</SortableTableHead>
          <SortableTableHead className="flex-1" sortDirection={dirFor("resolutionTime")} onSort={() => handleSort("resolutionTime")}>Resolution Time</SortableTableHead>
          <SortableTableHead className="flex-1" sortDirection={dirFor("skill")} onSort={() => handleSort("skill")}>Skill</SortableTableHead>
          <TableHead className="w-[48px] shrink-0"><span className="sr-only">Actions</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((interaction) => (
          <TableRow key={interaction.id}>
            <TableCell className="w-[48px] shrink-0">
              <span className={cn("relative inline-flex h-4 w-4 items-center justify-center", CHANNEL_TYPE_ICON_COLOR_CLASS[interaction.type])}>
                {interaction.type === "email" ? (
                  <Mail className="h-4 w-4" strokeWidth={1.5} />
                ) : interaction.type === "voice" ? (
                  <Phone className="h-4 w-4" strokeWidth={1.5} />
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
            <TableCell className="flex-[1.4]">{interaction.owner}</TableCell>
            <TableCell className="flex-[0.7]">{interaction.priority}</TableCell>
            <TableCell className="flex-1">{interaction.createDate}</TableCell>
            <TableCell className="flex-1">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full shrink-0",
                    interaction.status === "open" ? "bg-lyra-status-success-strong" : "bg-lyra-status-critical-strong"
                  )}
                  aria-hidden="true"
                />
                {interaction.status === "open" ? "Open" : "Closed"}
              </span>
            </TableCell>
            <TableCell className="flex-[1.2]">{interaction.channel}</TableCell>
            <TableCell className="flex-1">{interaction.resolutionTime}</TableCell>
            <TableCell className="flex-1">{interaction.skill || "—"}</TableCell>
            <TableCell className="w-[48px] shrink-0">
              <InteractionRowActions interaction={interaction} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/* ── InteractionTranscript ──
   The conversation-transcript body for an active interaction's detail page,
   shown below the page header — whose own `titleSuffix` slot holds the
   `ChannelToggle` row now, not a separate row beneath it (replaces the
   empty placeholder div that used to sit there — see the `activeInteraction`
   branch above). Shows
   one fixed mock conversation (Liam Davis ↔ John Smith) split across two
   fixed mock sessions (`TRANSCRIPT_SESSIONS`) for every active interaction
   rather than a real per-interaction transcript — this is a UI prototype of
   the transcript layout itself, not a case-data integration.

   Broken into sessions (each a `# <case id> · <date>` separator — see
   `TranscriptSessionSeparator` — followed by that session's own messages)
   rather than one flat message list, per explicit request: a single
   interaction can span more than one contact record (a follow-up thread
   days later, a callback), and each one needs its own separator that
   expands in place to a "Session Details" summary (`TranscriptSession
   Details`) without disturbing the others. Each separator is `sticky
   top-0`, so scrolling through a session keeps its separator pinned at the
   top until the next session's own separator reaches the top and takes
   over — plain CSS sticky-header stacking, no scroll listener — see that
   component's own doc comment for why source order alone is enough to get
   this behavior.

   Deliberately hand-built instead of composed from lyra-ui's
   `ConversationMessage`: that component's "agent" variant doesn't produce
   the white-bordered customer bubble the reference screenshot shows (no
   variant maps to that background), and its avatar sits beside the bubble
   rather than below it next to the tag row — both would require changing
   `ConversationMessage` itself, which is off the table for this feature
   ("do not update the components in lyra-ui until i say"). The removable
   Technical/Urgent/Billing pills still reuse `Tag` unmodified — it already
   supports `onRemove` plus the purple/critical/default variants used below,
   no lyra-ui changes needed there. */

interface TranscriptTag {
  id: string;
  label: string;
  variant: TagVariant;
}

interface TranscriptMessage {
  id: string;
  sender: "customer" | "agent";
  name: string;
  initials: string;
  timestamp: string;
  text: string;
  tags?: TranscriptTag[];
}

/* Each `TranscriptSession` is one contact record within the interaction —
   the reference screenshot's "# CTX-20250722-08841 · July 22, 2025 ⌄"
   separator plus the "Session Details" panel it expands to (Contact ID /
   Date / Start / End / Channel / Skill / Agent / Status). A single
   interaction can span more than one session (a callback, a follow-up
   message thread days later, etc.) — grouping `TranscriptMessage[]` under
   a session rather than one flat list is what lets the transcript render a
   separator between each and let every one collapse/expand independently.
   Two mock sessions here (a closed first contact, then a shorter follow-up)
   are enough to demonstrate the separator-per-session + sticky-stacking
   behavior; still a UI prototype, not real per-interaction session data. */
interface TranscriptSession {
  id: string;
  caseId: string;
  date: string;
  startTime: string;
  endTime: string;
  channel: string;
  skill: string;
  agent: string;
  status: string;
  messages: TranscriptMessage[];
}

const TRANSCRIPT_SESSIONS: TranscriptSession[] = [
  {
    id: "session-1",
    caseId: "CTX-20250722-08841",
    date: "July 22, 2025",
    startTime: "9:13 AM",
    endTime: "9:27 AM",
    channel: "SMS",
    skill: "SMS Support",
    agent: "John Smith",
    status: "Resolved",
    messages: [
      {
        id: "m1",
        sender: "customer",
        name: "Liam Davis",
        initials: "LD",
        timestamp: "9:14 AM",
        text: "Hi, I'm having trouble with my recent invoice — it looks like I was charged twice for the same service.",
      },
      {
        id: "m2",
        sender: "agent",
        name: "John Smith",
        initials: "JS",
        timestamp: "9:15 AM",
        text: "Hi! Thanks for reaching out. I'm sorry to hear that — let me pull up your account right away.",
      },
      {
        id: "m3",
        sender: "agent",
        name: "John Smith",
        initials: "JS",
        timestamp: "9:17 AM",
        text: "I can see the duplicate charge from July 18th. I'll submit a refund request for the second charge now.",
      },
      {
        id: "m4",
        sender: "customer",
        name: "Liam Davis",
        initials: "LD",
        timestamp: "9:18 AM",
        text: "Thank you! How long will it take?",
        tags: [{ id: "m4-billing", label: "Billing", variant: "default" }],
      },
      {
        id: "m5",
        sender: "agent",
        name: "John Smith",
        initials: "JS",
        timestamp: "9:20 AM",
        text: "Refunds typically appear within 3–5 business days. You'll also receive a confirmation email shortly.",
      },
      {
        id: "m6",
        sender: "customer",
        name: "Liam Davis",
        initials: "LD",
        timestamp: "9:22 AM",
        text: "Great, sounds good. One more thing — can I also update the billing email on file?",
      },
      {
        id: "m7",
        sender: "agent",
        name: "John Smith",
        initials: "JS",
        timestamp: "9:23 AM",
        text: "Of course! What would you like to change it to?",
      },
      {
        id: "m8",
        sender: "customer",
        name: "Liam Davis",
        initials: "LD",
        timestamp: "9:24 AM",
        text: "Please update it to: sarah.chen@example.com",
      },
      {
        id: "m9",
        sender: "agent",
        name: "John Smith",
        initials: "JS",
        timestamp: "9:25 AM",
        text: "Done! Your billing email has been updated. Is there anything else I can help with?",
      },
      {
        id: "m10",
        sender: "customer",
        name: "Liam Davis",
        initials: "LD",
        timestamp: "9:26 AM",
        text: "No, that's all. Thanks for your help!",
      },
    ],
  },
  {
    id: "session-2",
    caseId: "CTX-20250723-09234",
    date: "July 23, 2025",
    startTime: "2:04 PM",
    endTime: "2:12 PM",
    channel: "SMS",
    skill: "SMS Support",
    agent: "John Smith",
    status: "Resolved",
    messages: [
      {
        id: "m11",
        sender: "customer",
        name: "Liam Davis",
        initials: "LD",
        timestamp: "2:05 PM",
        text: "Hi again — the refund still hasn't appeared on my account.",
      },
      {
        id: "m12",
        sender: "agent",
        name: "John Smith",
        initials: "JS",
        timestamp: "2:08 PM",
        text: "Hi! I apologize for the delay. I can see the refund was processed on our end — it may take until the end of the business day to appear.",
      },
      {
        id: "m13",
        sender: "customer",
        name: "Liam Davis",
        initials: "LD",
        timestamp: "2:10 PM",
        text: "Okay, I'll check again tomorrow.",
      },
      {
        id: "m14",
        sender: "agent",
        name: "John Smith",
        initials: "JS",
        timestamp: "2:11 PM",
        text: "Sounds good! Feel free to reach back out if you don't see it by tomorrow afternoon.",
      },
    ],
  },
];

// Quick-add options offered from a message's hover "Tags" action — matches
// the app's real tag vocabulary (Complain/Help/Praise/Share/Billing), not
// an invented set, so a picked tag reads the same as the one seeded on m4.
// "Billing" (topic label, not sentiment) reuses the same neutral `default`
// variant "Share" already established for a non-sentiment tag. Deliberately
// not purple/teal/pink — CONTRIBUTING.md reserves those three Tag variants
// for channel-type coloring specifically.
const QUICK_TAG_OPTIONS: Omit<TranscriptTag, "id">[] = [
  { label: "Complain", variant: "critical" },
  { label: "Help", variant: "info" },
  { label: "Praise", variant: "success" },
  { label: "Share", variant: "default" },
  { label: "Billing", variant: "default" },
];

/* ── TranscriptMessageBubble ──
   One customer/agent bubble, extracted out of the old flat-list
   `InteractionTranscript` so it can be looped once per `TranscriptSession`
   instead of once for the whole (now session-grouped) transcript. Tag
   add/remove and the copy action are still owned by `InteractionTranscript`
   (tag state lives per-session there) — this component is just the row
   markup, taking the handlers it needs as props. Unchanged from the
   original inline JSX otherwise. */
function TranscriptMessageBubble({
  message,
  tagPickerOpen,
  onTagPickerOpenChange,
  onAddTag,
  onRemoveTag,
  onCopy,
}: {
  message: TranscriptMessage;
  tagPickerOpen: boolean;
  onTagPickerOpenChange: (open: boolean) => void;
  onAddTag: (option: Omit<TranscriptTag, "id">) => void;
  onRemoveTag: (tagId: string) => void;
  onCopy: () => void;
}) {
  const isCustomer = message.sender === "customer";
  return (
    <div className={cn("flex flex-col", isCustomer ? "items-start" : "items-end")}>
      <div className={cn("flex max-w-[70%] items-start gap-2", isCustomer ? "flex-row" : "flex-row-reverse")}>
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full lyra-body-sm-emphasis lyra-transcript-avatar",
            isCustomer
              ? "bg-lyra-accent-green-soft text-lyra-accent-green-strong"
              : "bg-lyra-bg-primary text-lyra-fg-on-primary"
          )}
          aria-hidden="true"
        >
          {message.initials}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <span className={cn("lyra-body-sm text-lyra-fg-secondary px-1", !isCustomer && "text-right")}>
            {message.name}
          </span>
          <div className={cn("group flex items-end gap-1.5", isCustomer ? "flex-row" : "flex-row-reverse")}>
            <div
              className={cn(
                "rounded-lyra-lg px-4 py-3 border border-transparent",
                isCustomer ? "rounded-tl-none bg-lyra-state-hover" : "rounded-tr-none"
              )}
              style={!isCustomer ? { backgroundColor: "var(--lyra-color-bg-conversation-user)" } : undefined}
            >
              <p className="lyra-body-md text-lyra-fg-default">{message.text}</p>
              <span className="mt-2 block lyra-body-sm text-lyra-fg-secondary">{message.timestamp}</span>
            </div>
            {/* Copy / Add tag — hidden until the bubble row is hovered,
                sitting just outside the bubble (right for customer bubbles,
                left for agent bubbles), bottom-aligned with it rather than
                overlapping it. */}
            <div
              className={cn(
                "mb-0.5 flex shrink-0 items-center gap-0.5 rounded-lyra-md border border-lyra-border-subtle bg-lyra-bg-surface-base p-0.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100",
                // The "Add tag" popover renders in a portal, so moving the
                // pointer into it isn't hovering this row anymore —
                // group-hover alone would fade the toolbar out from under
                // an open popover. Force it visible whenever this
                // message's picker is open.
                tagPickerOpen && "opacity-100"
              )}
            >
              <ActionIconButton size="sm" title="Copy message" onClick={onCopy}>
                <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />
              </ActionIconButton>
              <Popover
                open={tagPickerOpen}
                onOpenChange={onTagPickerOpenChange}
                placement="bottom"
                header={
                  <PanelHeader
                    title="Add tag"
                    bordered={false}
                    className="px-5 pb-0"
                    onClose={() => onTagPickerOpenChange(false)}
                  />
                }
                content={
                  <div className="flex flex-col gap-1 py-2">
                    {QUICK_TAG_OPTIONS.filter((opt) => !message.tags?.some((t) => t.label === opt.label)).map(
                      (opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          className="group flex items-center rounded-lyra-sm px-1 py-1 text-left"
                          onClick={() => onAddTag(opt)}
                        >
                          {/* Hover feedback lives on the tag pill's own
                              color (darkens slightly) instead of a gray row
                              background behind it — the pill already
                              carries the variant's color, so that's what
                              should visibly react to hovering it.
                              `brightness` works regardless of which variant
                              color is in play, no per-variant hover class
                              needed. */}
                          <Tag
                            label={opt.label}
                            variant={opt.variant}
                            shape="pill"
                            className="transition-[filter] group-hover:brightness-95 dark:group-hover:brightness-125"
                          />
                        </button>
                      )
                    )}
                    {QUICK_TAG_OPTIONS.every((opt) => message.tags?.some((t) => t.label === opt.label)) && (
                      <span className="px-1 py-1 lyra-body-sm text-lyra-fg-secondary">All tags added</span>
                    )}
                  </div>
                }
              >
                <ActionIconButton size="sm" title="Add tag">
                  <Tags className="h-3.5 w-3.5" strokeWidth={1.5} />
                </ActionIconButton>
              </Popover>
            </div>
          </div>
          {message.tags && message.tags.length > 0 && (
            <div className={cn("mt-1 flex flex-wrap items-center gap-2", isCustomer ? "flex-row" : "flex-row-reverse")}>
              {message.tags.map((tag) => (
                <Tag key={tag.id} label={tag.label} variant={tag.variant} shape="pill" onRemove={() => onRemoveTag(tag.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── TranscriptSessionDetails ──
   The "Session Details" card a session separator expands to (reference
   screenshot 2) — Contact ID/Date, Start/End, Channel/Skill, Agent/Status,
   two fields per row. Uses lyra-ui's own documented "Label Horizontal"
   pattern (`Input.stories.tsx`'s `LabelHorizontalWithSeparator` story: the
   real `Label` atom on the left, a plain `lyra-body-md text-lyra-fg-
   secondary` value span on the right, in one row) rather than `Input` —
   `Input` always stacks its label *above* the field, which read as a
   normal editable-looking form regardless of `readonly`, not the
   horizontal label/value row the reference screenshot shows. Same pattern
   minus that story's trailing `Separator` — explicitly no dividers between
   rows here, this card is one glanceable block, not a divided list. Two
   pairs per row via `.lyra-form-grid` (an existing lyra-tokens.css
   container-query family, not a bare Tailwind `grid-cols-2`) under a
   `lyra-form-grid-wrap` boundary, same mechanism `CustomerDetailTabContent`
   uses for its own 2-up field rows.

   Wrapped in the same neutral `rounded-lyra-md border border-lyra-border-
   subtle bg-lyra-bg-control-subtle` container CONTRIBUTING.md's "Composing
   panel body content" convention uses for a card-like block sitting inside
   a body area — the Overview tab's own "Latest Interaction" accordion uses
   the identical classes for the same reason (a block that reads as a
   distinct card, not flush against the transcript's own background). */
function TranscriptSessionDetails({ session }: { session: TranscriptSession }) {
  const rows: Array<[string, string, string, string]> = [
    ["Contact ID", session.caseId, "Date", session.date],
    ["Start", session.startTime, "End", session.endTime],
    ["Channel", session.channel, "Skill", session.skill],
    ["Agent", session.agent, "Status", session.status],
  ];
  return (
    <div className="flex flex-col gap-3 rounded-lyra-md border border-lyra-border-subtle bg-lyra-bg-control-subtle p-4 lyra-form-grid-wrap">
      <h3 className="lyra-body-md-emphasis text-lyra-fg-default">Session Details</h3>
      {rows.map(([label1, value1, label2, value2]) => (
        <div key={label1} className="lyra-form-grid">
          <div className="flex items-center justify-between gap-4">
            <Label label={label1} />
            <span className={cn("lyra-body-md text-lyra-fg-secondary", label1 === "Contact ID" && "font-mono")}>
              {value1}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label label={label2} />
            <span className="lyra-body-md text-lyra-fg-secondary">{value2}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── TranscriptSessionSeparator ──
   The "# CTX-... · <date>" pill row between sessions. `sticky top-0` (no
   extra plumbing needed — this relies on plain CSS sticky-header stacking:
   each separator is the first child of its own session block, in normal
   document flow as a sibling of the next session block below it, so as the
   transcript's own `overflow-y-auto` container scrolls, a separator sticks
   to the top for as long as its session's messages are still scrolling by,
   then gets pushed off-screen the instant the *next* session block's own
   top — and therefore its own separator — reaches the scroll container's
   top edge. That hand-off is the "then it replaces the other one" behavior
   from the request; no scroll listener or IntersectionObserver needed for
   it, just each separator being `sticky top-0` in source order.
   `bg-lyra-bg-surface-base` keeps messages scrolling underneath from
   showing through while it's pinned; `z-[1]` keeps it above them —
   deliberately *not* `z-10`: `CustomerInformationInteriorPanel` (the
   docked panel this transcript sits beside) renders at `z-[5]`
   (interior-panel.tsx), and a sticky element's own `z-index` opens a new
   stacking context compared against siblings up the tree, not just against
   the messages scrolling directly beneath it — `z-10` was outranking that
   panel and painting the separator/expanded Session Details card over top
   of it once the panel had content past the fold (confirmed via
   screenshot). `z-[1]` is enough to clear plain in-flow message content
   (which has no z-index of its own) while staying under every panel in
   this file that intentionally layers above the transcript.

   The trailing gradient div is the same "soft fade instead of a hard edge"
   technique `InteractionComposer` uses for its own top edge (see that
   component's doc comment), mirrored: `position: sticky` already
   establishes a containing block for an absolutely-positioned descendant
   (same as `relative` would), so no extra wrapper is needed here. Placed
   at `-bottom-8` (outside this div's own box, extending down into the
   messages scrolling underneath) rather than as internal bottom padding,
   so it overlays whatever message content is passing directly beneath the
   separator instead of just adding empty space inside it. Gradient runs
   solid (matching this bar's own background) at the top down to
   transparent at the bottom — the reverse of the composer's direction,
   since here the solid edge is at the *top* of the fade band, not the
   bottom.

   Session Details' open/close is animated via @radix-ui/react-accordion
   directly (AccordionPrimitive.Root/Item/Content) rather than lyra-ui's
   own Accordion component — that component always renders its own trigger
   row (a full-width button with its own chevron) plus a border-b divider
   after every item, neither of which fits here: the real trigger is the
   "# CTX-..." pill button below, and this feature was explicitly built
   with no dividers. Reusing the bare Radix primitives keeps the actual
   animation mechanism identical to Accordion's though — same
   data-[state=open]:animate-accordion-down data-[state=closed]:animate-
   accordion-up classes, same --radix-accordion-content-height CSS
   variable driving the height, same 200ms ease-in-out keyframes already
   defined in this app's own tailwind.config.js (added there so Tailwind
   picks up the classes Accordion itself needs) — just without Accordion's
   own trigger/divider markup along for the ride. Root is fully controlled
   off openSessionIds (InteractionTranscript's own state) via value; the
   pill button below drives that state directly and never touches Radix's
   own Trigger (not rendered here at all), so onValueChange is a no-op —
   it only exists to satisfy React's controlled-prop-without-a-change-
   handler warning. */
function TranscriptSessionSeparator({
  session,
  open,
  onToggle,
}: {
  session: TranscriptSession;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      value={open ? session.id : ""}
      onValueChange={() => {}}
      className="sticky top-0 z-[1] bg-lyra-bg-surface-base"
    >
      <AccordionPrimitive.Item value={session.id}>
        <div className="flex items-center gap-3 py-2">
          <div className="h-px flex-1 bg-lyra-border-subtle" />
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-lyra-border-subtle px-3 py-1.5 lyra-body-sm text-lyra-fg-secondary transition-colors hover:bg-lyra-state-hover"
          >
            <span aria-hidden="true">#</span>
            <span className="font-mono">{session.caseId}</span>
            <span aria-hidden="true">·</span>
            <span>{session.date}</span>
            {open ? (
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>
          <div className="h-px flex-1 bg-lyra-border-subtle" />
        </div>
        <AccordionPrimitive.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <div className="pb-4">
            <TranscriptSessionDetails session={session} />
          </div>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
      <div
        className="pointer-events-none absolute inset-x-0 -bottom-8 h-8 bg-gradient-to-b from-lyra-bg-surface-base to-transparent"
        aria-hidden="true"
      />
    </AccordionPrimitive.Root>
  );
}

function InteractionTranscript() {
  // Local, per-session tag state — removing/adding a tag on one message
  // shouldn't touch any other message's tags (in this session or any
  // other), so this is keyed by session id rather than one flat array.
  const [sessionMessages, setSessionMessages] = useState<Record<string, TranscriptMessage[]>>(() =>
    Object.fromEntries(TRANSCRIPT_SESSIONS.map((s) => [s.id, s.messages]))
  );
  // Which message's "Add tag" popover is open — at most one at a time,
  // across every session (message ids are already unique per session, so
  // a single id is enough with no session key needed alongside it).
  const [tagPickerOpenId, setTagPickerOpenId] = useState<string | null>(null);
  // Which sessions' "Session Details" panel is expanded — a Set, not a
  // single id, since sessions toggle open/closed independently rather than
  // as an exclusive accordion (matches the reference: clicking one
  // separator doesn't collapse another that's already open).
  const [openSessionIds, setOpenSessionIds] = useState<Set<string>>(new Set());

  const toggleSession = (sessionId: string) => {
    setOpenSessionIds((prev) => {
      const next = new Set(prev);
      if (next.has(sessionId)) next.delete(sessionId);
      else next.add(sessionId);
      return next;
    });
  };

  const removeTag = (sessionId: string, messageId: string, tagId: string) => {
    setSessionMessages((prev) => ({
      ...prev,
      [sessionId]: prev[sessionId].map((m) => (m.id === messageId ? { ...m, tags: m.tags?.filter((t) => t.id !== tagId) } : m)),
    }));
  };

  const addTag = (sessionId: string, messageId: string, option: Omit<TranscriptTag, "id">) => {
    setSessionMessages((prev) => ({
      ...prev,
      [sessionId]: prev[sessionId].map((m) =>
        m.id === messageId
          ? { ...m, tags: [...(m.tags ?? []), { ...option, id: `${messageId}-${option.label.toLowerCase()}` }] }
          : m
      ),
    }));
    // Deliberately doesn't close the popover — picking a tag is meant to be
    // a quick multi-select (add Complain, then Help, then close when done),
    // not a one-shot pick. Closing is explicit: the header's close button,
    // or clicking off the popover (Radix's default outside-click handling
    // on `PopoverPrimitive.Content`, unchanged here).
  };

  const copyMessage = (text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full max-w-[1200px] mx-auto px-6 py-4 lyra-transcript-wrap">
        {TRANSCRIPT_SESSIONS.map((session) => (
          <div key={session.id} className="flex flex-col">
            <TranscriptSessionSeparator
              session={session}
              open={openSessionIds.has(session.id)}
              onToggle={() => toggleSession(session.id)}
            />
            <div className="flex flex-col gap-5 py-4">
              {sessionMessages[session.id].map((message) => (
                <TranscriptMessageBubble
                  key={message.id}
                  message={message}
                  tagPickerOpen={tagPickerOpenId === message.id}
                  onTagPickerOpenChange={(open) => setTagPickerOpenId(open ? message.id : null)}
                  onAddTag={(option) => addTag(session.id, message.id, option)}
                  onRemoveTag={(tagId) => removeTag(session.id, message.id, tagId)}
                  onCopy={() => copyMessage(message.text)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── InteractionComposer ──
   The message-input bar fixed to the bottom of an active interaction's
   detail page — a sibling rendered right after `InteractionTranscript`
   rather than living inside it, so it's a `shrink-0` row in the same flex
   column instead of scrolling away with the transcript above it (which is
   the `flex-1 overflow-y-auto` element doing all the scrolling).

   Composed entirely from existing lyra-ui exports (`Textarea`, `Button`,
   `ActionIconButton`) — no lyra-ui changes. The "Send ▾" control is hand-
   built from two adjacent `Button`s (rounded-r-none / rounded-l-none, a
   hairline divider between) since lyra-ui has no dedicated split-button
   component; same reasoning as everywhere else in this file that composes
   existing atoms rather than waiting on a new lyra-ui primitive. */
function InteractionComposer() {
  const [message, setMessage] = useState("");
  const canSend = message.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    // No real send pipeline yet (the transcript above is fixed mock data,
    // not a live conversation) — clearing the field is the one honest
    // "sent" signal available without pretending this posts anywhere.
    setMessage("");
  };

  return (
    <div className="relative shrink-0 bg-lyra-bg-surface-base px-6 py-4">
      {/* Soft fade instead of a hard border-top — reads as the transcript
          scrolling *under* the composer rather than stopping at a line.
          Positioned outside this div's own box (negative top), so it
          overlays the last ~32px of the scrollable transcript sitting
          directly above it (that sibling isn't `overflow-hidden` on itself
          from the outside, only its own internal scroll is clipped, so an
          absolutely-positioned overlay from a neighboring box can still
          paint over it). */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-b from-transparent to-lyra-bg-surface-base"
        aria-hidden="true"
      />
      <div className="w-full max-w-[1200px] mx-auto">
        <Textarea
          label="Chat with Customer"
          placeholder="Type a message... or # for quick replies"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            <ActionIconButton size="sm" title="Attach file">
              <Paperclip className="h-4 w-4" strokeWidth={1.5} />
            </ActionIconButton>
            <ActionIconButton size="sm" title="Bold">
              <Bold className="h-4 w-4" strokeWidth={1.5} />
            </ActionIconButton>
            <ActionIconButton size="sm" title="Italic">
              <Italic className="h-4 w-4" strokeWidth={1.5} />
            </ActionIconButton>
            <ActionIconButton size="sm" title="Emoji">
              <Smile className="h-4 w-4" strokeWidth={1.5} />
            </ActionIconButton>
            <ActionIconButton size="sm" title="Quick replies">
              <Zap className="h-4 w-4" strokeWidth={1.5} />
            </ActionIconButton>
            <ActionIconButton size="sm" title="Templates">
              <FileText className="h-4 w-4" strokeWidth={1.5} />
            </ActionIconButton>
          </div>
          <div className="inline-flex items-center">
            <Button
              variant="default"
              size="lg"
              className="gap-1.5 rounded-r-none"
              disabled={!canSend}
              onClick={handleSend}
            >
              <Send className="h-4 w-4" strokeWidth={1.5} />
              Send
            </Button>
            <Button
              variant="default"
              size="icon-lg"
              className="rounded-l-none border-l border-white/25"
              disabled={!canSend}
              title="More send options"
            >
              <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── CustomerInformationPanelBody ──
   Body content for the "Customer Information" `InteriorPanel` docked right
   of an active interaction — a profile block (avatar initials + name +
   presence),
   two placeholder tab sections, and a detail-row list, reproducing the
   reference mockup's layout as placeholder content (real per-tab data isn't
   wired up yet, same "prototype the shape first" status as the transcript
   above).

   The mockup's field rows (label left, value right, hairline divider) are
   lyra-ui's own documented "Label Horizontal With Separator" composition
   (see Input.stories.tsx) — `Label` (not a plain span) + a value span
   (`lyra-body-md text-lyra-fg-secondary`) + `Separator`, not literally the
   `Input` component itself (Input's own `readonly` mode still renders a
   bordered box, which isn't this shape at all — the horizontal/label-only
   look lives in this separate story pattern, composed from `Label` +
   `Separator`, both already lyra-ui exports). Avatar uses initials
   (`initialsFor`, already used everywhere else in this file) instead of
   the mockup's photo — no photo source exists for these interactions. */

interface CustomerInfoField {
  label: string;
  value: string;
}

// Content swapped from the earlier agent-metrics mockup to real customer
// contact/billing fields (per a later reference screenshot) — same
// Label + Separator row formatting as before. The values themselves used to
// be one fixed placeholder profile (literally the app owner's own info,
// "dBauer79"/"david.bauer@nice.com") shown for every interaction regardless
// of who the actual customer was — confirmed from a screenshot that this
// read as static/disconnected rather than describing whoever was actually
// open. Replaced below with `buildCustomerInfoFields`, which derives a
// profile per interaction instead.

/* Tiny deterministic string hash → stable "random" index. Not
   cryptographic, just needs to turn a customer's `recordId` (or name, as a
   fallback) into the same pseudo-random number every time it's hashed, so
   the same customer always shows the same synthesized address/balance/zip
   across renders and reopening the panel — same intent as a seeded RNG,
   without pulling in a dependency for it. */
function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// There's no real per-customer contact/billing record anywhere in this
// app's data — `CREATE_NEW_CUSTOMERS` (lyra-ui's shared customer fixture,
// see the import above) only carries `id`/`name`/`customerId`/`channels`,
// nothing address- or billing-shaped. These pools exist so the synthesized
// profile below reads as plausible varied data (different customers land on
// different cities/streets) rather than everyone getting the exact same
// invented address with only the house number changing.
const CUSTOMER_INFO_STREET_NAMES = [
  "Clinton Heights Ave", "Maple Grove Dr", "Sunset Ridge Ln", "Harbor View Ct",
  "Cedar Hollow Rd", "Birchwood Ter", "Fieldstone Way", "Willow Creek Blvd",
];
const CUSTOMER_INFO_CITY_STATE: { city: string; state: string }[] = [
  { city: "Columbus", state: "OH" },
  { city: "Austin", state: "TX" },
  { city: "Portland", state: "OR" },
  { city: "Raleigh", state: "NC" },
  { city: "Denver", state: "CO" },
  { city: "Tampa", state: "FL" },
  { city: "Madison", state: "WI" },
  { city: "Boise", state: "ID" },
];

/** A plausible (but invented) US phone number, formatted to match this
 *  panel's own existing style ("+1 614 749 1794") — used only as a fallback
 *  when the active interaction has no real voice channel address to show
 *  instead (see `buildCustomerInfoFields` below). */
function synthesizePhone(seed: number): string {
  const areaCode = 200 + (seed % 800);
  const exchange = 100 + (Math.floor(seed / 7) % 900);
  const line = 1000 + (Math.floor(seed / 13) % 9000);
  return `+1 ${areaCode} ${exchange} ${line}`;
}

/** Splits a customer's display name into first/last — shared by
 *  `buildCustomerInfoFields` (its synthesized email) and the Detail tab's
 *  "First Name"/"Last Name" fields, so both land on the exact same split
 *  for the same customer instead of two independently-hand-rolled
 *  versions of the same logic drifting apart. A name with no space (or no
 *  name at all) falls back to using the whole/default name as both. */
function splitCustomerName(customerName: string | undefined): { firstName: string; lastName: string } {
  const name = customerName ?? "Customer";
  const [firstName, ...restNameParts] = name.split(" ");
  const lastName = restNameParts.join(" ") || firstName;
  return { firstName, lastName };
}

/** Builds this panel's field list for whichever customer/interaction is
 *  actually open, instead of one fixed placeholder profile shown for every
 *  interaction. Prefers real data already on the interaction itself over
 *  synthesized filler: `recordId` (the same id already shown in the panel's
 *  own header subhead) becomes "Contact #", and "Phone #"/"Email" read the
 *  real address a voice/email channel was actually opened on
 *  (`TrackedChannel.addressLabel`/`value` — see that field's own doc
 *  comment) when one exists, since that's genuine data particular to this
 *  interaction, not invented. Everything else (balance, street address,
 *  city/state/zip) has no real source anywhere in this app's data — see the
 *  const comment above — so it's deterministically synthesized from
 *  `recordId` via `hashSeed`, which at least keeps a given customer's
 *  "invented" details stable across reopens instead of reshuffling every
 *  render. */
function buildCustomerInfoFields(
  customerName: string | undefined,
  recordId: string,
  channels: TrackedChannel[]
): CustomerInfoField[] {
  const name = customerName ?? "Customer";
  const { firstName, lastName } = splitCustomerName(customerName);
  const seed = hashSeed(recordId || name);

  const voiceChannel = channels.find((c) => c.type === "voice");
  const emailChannel = channels.find((c) => c.type === "email");

  const phone = voiceChannel?.addressLabel ?? voiceChannel?.value ?? synthesizePhone(seed);
  const email = emailChannel?.value ?? `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

  const { city, state } = CUSTOMER_INFO_CITY_STATE[seed % CUSTOMER_INFO_CITY_STATE.length];
  const street = CUSTOMER_INFO_STREET_NAMES[Math.floor(seed / 7) % CUSTOMER_INFO_STREET_NAMES.length];
  const houseNumber = 100 + (seed % 900);
  const zipCode = String(10000 + (seed % 89999)).padStart(5, "0");
  const balance = (seed % 25000) / 100;

  return [
    { label: "Phone #", value: phone },
    { label: "Contact #", value: recordId },
    { label: "Email", value: email },
    { label: "Balance", value: balance.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
    { label: "Address", value: `${houseNumber} ${street}` },
    { label: "City", value: city },
    { label: "State", value: state },
    { label: "Zip Code", value: zipCode },
  ];
}

// "Latest Interaction" summary shown on the Overview tab, below the
// contact/billing field list. Same "no real per-customer data source, so
// deterministically synthesize one from the customer's own recordId"
// approach as `buildCustomerInfoFields` above — used to be one fixed
// summary (gendered pronoun and all: "Walked *her* through the upgrade
// flow") shown for every interaction regardless of who was actually open,
// which read just as disconnected as the old fixed contact-fields
// placeholder did. Pools below are written in third person with no
// pronouns at all, since the same pool is shared across every customer.
interface CustomerLatestInteraction {
  timeAgo: string;
  channel: string;
  status: string;
  statusColor: BadgeColor;
  summary: string;
  caseId: string;
  handledBy: string;
}

const CUSTOMER_LATEST_INTERACTION_STATUS_POOL: { status: string; color: BadgeColor }[] = [
  { status: "Resolved", color: "green" },
  { status: "Escalated", color: "red" },
  { status: "Pending", color: "orange" },
];

const CUSTOMER_LATEST_INTERACTION_CHANNEL_POOL = ["Email", "Voice", "Chat", "SMS"];

const CUSTOMER_LATEST_INTERACTION_TIME_AGO_POOL = [
  "3 days ago", "9 days ago", "2 weeks ago", "3 weeks ago", "1 month ago", "6 weeks ago",
];

const CUSTOMER_LATEST_INTERACTION_SUMMARY_POOL = [
  "Asked about upgrading to the Pro tier for additional storage. Walked through the upgrade flow and confirmed the new billing amount.",
  "Reported trouble accessing the account after a password reset. Verified identity via KBA and confirmed access was restored.",
  "Requested a copy of the most recent invoice. Located the billing record and sent it over by email.",
  "Called in to update the account's mailing address. Confirmed the new address and applied the change.",
  "Flagged a recent charge that looked unfamiliar. Reviewed the transaction history and clarified the charge.",
  "Wanted to add an additional user seat to the plan. Walked through the add-seat flow and confirmed the updated price.",
];

/** Deterministic per-customer "Latest Interaction" summary — same
 *  `hashSeed`-on-`recordId` approach as `buildCustomerInfoFields`, just
 *  salted with a different suffix so this doesn't land on the exact same
 *  pool indexes that function's own fields happen to hash to for the same
 *  customer. `handledBy` reuses the real `OUTBOUND_AGENTS` roster (the
 *  same agent names already used elsewhere in this app) rather than a
 *  separate invented-name pool. */
function buildLatestInteraction(customerName: string | undefined, recordId: string): CustomerLatestInteraction {
  const seed = hashSeed(`${recordId || customerName || "customer"}-latest-interaction`);
  const { status, color } = CUSTOMER_LATEST_INTERACTION_STATUS_POOL[seed % CUSTOMER_LATEST_INTERACTION_STATUS_POOL.length];
  const channel = CUSTOMER_LATEST_INTERACTION_CHANNEL_POOL[Math.floor(seed / 3) % CUSTOMER_LATEST_INTERACTION_CHANNEL_POOL.length];
  const timeAgo = CUSTOMER_LATEST_INTERACTION_TIME_AGO_POOL[Math.floor(seed / 7) % CUSTOMER_LATEST_INTERACTION_TIME_AGO_POOL.length];
  const summary = CUSTOMER_LATEST_INTERACTION_SUMMARY_POOL[Math.floor(seed / 11) % CUSTOMER_LATEST_INTERACTION_SUMMARY_POOL.length];
  const handledByAgent = OUTBOUND_AGENTS[seed % OUTBOUND_AGENTS.length];
  const caseId = `CASE-${40000 + (seed % 9000)}`;

  return {
    timeAgo,
    channel,
    status,
    statusColor: color,
    summary,
    caseId,
    handledBy: handledByAgent?.name ?? "Support Team",
  };
}

// Placeholder tab set (per reference screenshot). The screenshot itself
// showed "Interactions" active, but the panel should open on "Overview"
// (index 0) by default — so `activeTab` below just starts at 0 rather than
// looking up a specific tab's index.
const CUSTOMER_PANEL_TABS = ["Overview", "Detail", "Directory", "Interactions", "Tasks", "Notes", "Accounts", "Tickets"];

/** Shared neutral bordered-container treatment for every collapsible
 *  `Accordion` in the Customer Information panel (Overview tab's "Customer
 *  Overview"/"Latest Interaction", Detail tab's "General"/"Address",
 *  Directory tab's per-phone-slot rows) — one constant instead of each tab
 *  re-typing the same class string, so the four surfaces can't quietly
 *  drift apart. Callers that need an additional class alongside it (the
 *  Overview tab's `.lyra-card-split-even`) compose it with `cn(...)` rather
 *  than duplicating this string with an extra class appended. */
const CUSTOMER_INFO_ACCORDION_CLASSNAME = "rounded-lyra-md border border-lyra-border-subtle bg-lyra-bg-control-subtle overflow-hidden h-fit";

/** Looks up one of `buildCustomerInfoFields`'s rows by label — lets the
 *  Detail tab below reuse the exact same Contact #/Balance/Address/City/
 *  State/Zip values the Overview tab already shows for this customer,
 *  instead of a second, independently-synthesized set that could disagree
 *  with it (e.g. a different "invented" balance on each tab for the same
 *  customer). */
function getFieldValue(fields: CustomerInfoField[], label: string): string {
  return fields.find((f) => f.label === label)?.value ?? "";
}

const CUSTOMER_DETAIL_ACCOUNT_BLOCK_OPTIONS: SelectOption[] = [
  { value: "none", label: "None" },
  { value: "collections", label: "Collections" },
  { value: "fraud-review", label: "Fraud Review" },
  { value: "credit-hold", label: "Credit Hold" },
];

/* ── CustomerDetailTabContent ──
   The "Detail" tab's field-editor form (per a reference screenshot of a
   legacy admin contact-edit page) — two collapsible `Accordion` sections,
   "General" and "Address", both open by default, each a responsive
   `.lyra-form-grid` of real lyra-ui field components (`Input`/`Select`/
   `Checkbox`/`DatePicker`), same "Accordion wrapping real editable fields"
   composition `FormTemplate`'s own "Placement Information" section already
   demonstrates (form-template.tsx) — not a hand-rolled bordered box imitating
   one. `lyra-form-grid-wrap` on the root establishes the container-query
   boundary `.lyra-form-grid` needs (see that class's own doc comment in
   lyra-tokens.css): each row is 2-up at this component's own full width,
   stepping down to a single column well before an `InteriorPanel`'s
   typical ~250–425px width would otherwise crowd two fields onto one line.

   Reference screenshot's field labels were all-caps ("CONTACT #", "FIRST
   NAME") — that's the *legacy* admin app's own styling, not something to
   replicate via CSS `text-transform` (CONTRIBUTING.md §17 already covers
   exactly this mistake). Labels here are typed in normal case and rendered
   through each field component's own built-in label, same as every other
   field in this panel/app.

   Fields with a real source reuse it instead of inventing a second,
   possibly-disagreeing value: "Contact #"/"Total Balance"/"Address
   1"/"City"/"State"/"Zip Code" come straight from `fields` (the same
   per-customer data `buildCustomerInfoFields` already computed for the
   Overview tab — see `getFieldValue` above), and "First Name"/"Last Name"
   split `customerName` the same way `buildCustomerInfoFields`'s own
   synthesized email does (`splitCustomerName`). Everything else in the
   reference screenshot (Original Contact #, Title, Department, Balance
   Due, Account Block, Group, Due Date, Address 2) has no real or
   synthesized source anywhere in this app's data, so those stay at the
   screenshot's own shown defaults (empty / "None" / unchecked-false where
   shown, "$0.00" for Balance Due specifically since it's a distinct
   "amount currently owed" concept from Total Balance, not just a repeat of
   it) — editable, uncontrolled-from-outside local state, same
   "self-contained, not wired to persistence" status as every other
   prototype form in this app (`FormTemplate` included). */
function CustomerDetailTabContent({
  customerName,
  fields,
}: {
  customerName?: string;
  fields: CustomerInfoField[];
}) {
  const { firstName, lastName } = splitCustomerName(customerName);

  const [originalContactNumber, setOriginalContactNumber] = useState("");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [balanceDue, setBalanceDue] = useState("$0.00");
  const [active, setActive] = useState(true);
  const [accountBlock, setAccountBlock] = useState("none");
  const [group, setGroup] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [address2, setAddress2] = useState("");

  // Same neutral bordered-container treatment as the Overview tab's
  // "Customer Overview"/"Latest Interaction" accordions (see
  // `CustomerInformationPanelBody`) — each section gets its own card-like
  // container rather than the two sharing one borderless `Accordion` root,
  // so "General" and "Address" read as distinct blocks instead of one long
  // list. Split into two single-item `Accordion`s (each still open by
  // default via its own `defaultValue`) instead of the previous single
  // `type="multiple"` root, since that's what separate containers require —
  // each item now toggles independently by construction, the same behavior
  // `type="multiple"` was providing before.
  return (
    <div className="flex flex-col gap-4 px-4 pt-3 pb-4 lyra-form-grid-wrap">
      <Accordion
        defaultValue="general"
        className={CUSTOMER_INFO_ACCORDION_CLASSNAME}
        items={[
          {
            id: "general",
            title: "General",
            content: (
              <div className="flex flex-col gap-4">
                <div className="lyra-form-grid">
                  <Input label="Contact #" value={getFieldValue(fields, "Contact #")} readonly />
                  <Input label="Original Contact #" value={originalContactNumber} onChange={(e) => setOriginalContactNumber(e.target.value)} />
                </div>
                <div className="lyra-form-grid">
                  <Input label="First Name" defaultValue={firstName} />
                  <Input label="Last Name" defaultValue={lastName} />
                </div>
                <div className="lyra-form-grid">
                  <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <Input label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                </div>
                <div className="lyra-form-grid">
                  <Input label="Total Balance" value={getFieldValue(fields, "Balance")} readonly />
                  <Input label="Balance Due" value={balanceDue} onChange={(e) => setBalanceDue(e.target.value)} />
                </div>
                <div className="lyra-form-grid">
                  <Checkbox label="Active" checked={active} onCheckedChange={(checked) => setActive(checked === true)} />
                  <Select
                    label="Account Block"
                    options={CUSTOMER_DETAIL_ACCOUNT_BLOCK_OPTIONS}
                    value={accountBlock}
                    onValueChange={setAccountBlock}
                  />
                </div>
                <div className="lyra-form-grid">
                  <Select
                    label="Group"
                    options={[]}
                    value={group}
                    onValueChange={setGroup}
                    placeholder="Select group"
                  />
                  <DatePicker label="Due Date" value={dueDate} onChange={setDueDate} />
                </div>
              </div>
            ),
          },
        ]}
      />
      <Accordion
        defaultValue="address"
        className={CUSTOMER_INFO_ACCORDION_CLASSNAME}
        items={[
          {
            id: "address",
            title: "Address",
            content: (
              <div className="flex flex-col gap-4">
                <div className="lyra-form-grid">
                  <Input label="Address 1" value={getFieldValue(fields, "Address")} readonly />
                  <Input label="Address 2" value={address2} onChange={(e) => setAddress2(e.target.value)} />
                </div>
                <div className="lyra-form-grid">
                  <Input label="City" value={getFieldValue(fields, "City")} readonly />
                  <Input label="State" value={getFieldValue(fields, "State")} readonly />
                </div>
                <div className="lyra-form-grid">
                  <Input label="Zip Code" value={getFieldValue(fields, "Zip Code")} readonly />
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

/** Bare digits (US-style raw phone digits, no formatting/dial code — what
 *  `PhoneInput`'s own `PhoneValue.number` expects) parsed out of one of
 *  this panel's own already-formatted display strings (e.g. "Phone #"'s
 *  "+1 614 749 1794"). Strips a leading "1" country-code digit when
 *  present so a 10-digit US number round-trips back into `PhoneInput`
 *  correctly instead of overflowing its mask by one digit. Falls back to
 *  an empty number (still a valid, just-blank `PhoneValue`) for a
 *  synthesized phone that doesn't parse cleanly, rather than showing
 *  something wrong. */
function phoneValueFromDisplay(display: string): PhoneValue {
  const digits = display.replace(/\D/g, "");
  const withoutCountryCode = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  return { countryCode: "us", number: withoutCountryCode };
}

const CUSTOMER_DIRECTORY_BLOCK_OPTIONS = [
  { value: "no-block", label: "No Block" },
  { value: "block-daily", label: "Block Daily" },
  { value: "block-permanent", label: "Block Permanent" },
];

/** Total phone slots the Directory tab renders — "up to 10 phones" per the
 *  reference screenshot: the first is always labeled "Home", the rest
 *  "Phone 2" through "Phone 10". */
const CUSTOMER_DIRECTORY_PHONE_COUNT = 10;
const CUSTOMER_DIRECTORY_PHONE_LABELS = Array.from({ length: CUSTOMER_DIRECTORY_PHONE_COUNT }, (_, i) =>
  i === 0 ? "Home" : `Phone ${i + 1}`
);

interface CustomerDirectoryPhoneState {
  phone: PhoneValue;
  consentCall: boolean;
  consentSms: boolean;
  block: string;
}

/* ── CustomerDirectoryPhoneRow ──
   One phone slot's worth of fields, its own little self-contained block —
   pulled out of `CustomerDirectoryTabContent` (rather than inlined in a
   `.map`) so each of the up to 10 rows below owns independent `useState`
   the normal way a component does, instead of ten parallel array-indexed
   state slots in the parent needing hand-rolled per-index update
   functions for every field. Same "Call Attempts Today/Total" read-only
   stat pair for every row (there's no live call-attempt tracking in this
   demo, same static-`0` status as `TrackedChannel.messageCount`
   elsewhere) — plain text, not `Metric`/`DashboardCardMetric`, since those
   render a large headline figure + caption meant for a dashboard card,
   not a compact inline stat under a phone field.

   Each slot is its own single-item `Accordion` (title = the slot label,
   e.g. "Home"/"Phone 2") — collapsible per request, `defaultValue={label}`
   so every slot still starts open (same "collapsible but open by default"
   convention as the Overview tab's own "Latest Interaction" accordion).
   `PhoneInput` no longer gets its own `label` prop: the accordion's own
   trigger already shows the slot name as its title immediately above the
   field, so a second, identical label directly under it was pure
   duplication (confirmed from a screenshot of the pre-accordion layout —
   "Home" as a plain heading, then "Home" again as the phone field's own
   label right below it).

   No divider of its own on this row — `Accordion`'s own per-item
   `border-b` (accordion.tsx, rendered after every item's content)
   supplies the hairline between consecutive slots; `CustomerDirectory
   TabContent` adds one `border-t` above the whole list of rows for the
   divider separating it from the Email/Consent block, rather than every
   row duplicating that same top border (which used to visually double up
   with the row-before's own bottom divider). */
function CustomerDirectoryPhoneRow({
  label,
  defaultState,
}: {
  label: string;
  defaultState: CustomerDirectoryPhoneState;
}) {
  const [phone, setPhone] = useState<PhoneValue>(defaultState.phone);
  const [consentCall, setConsentCall] = useState(defaultState.consentCall);
  const [consentSms, setConsentSms] = useState(defaultState.consentSms);
  const [block, setBlock] = useState(defaultState.block);

  return (
    <Accordion
      type="single"
      defaultValue={label}
      // Same neutral bordered-container treatment as the Overview tab's
      // "Customer Overview"/"Latest Interaction" accordions and the Detail
      // tab's "General"/"Address" accordions (see those components' own
      // comments) — each phone slot now reads as its own card instead of a
      // borderless row, consistent across all three tabs.
      className={CUSTOMER_INFO_ACCORDION_CLASSNAME}
      items={[
        {
          id: label,
          title: label,
          content: (
            // Three columns — phone + its call-attempt stats, consent
            // checkboxes, block radios — share one `.lyra-form-grid` row.
            // `.lyra-form-grid` already handles any number of children
            // evenly (`> *` gets `flex: 1 1 0%` by default — no
            // per-consumer modifier needed, unlike `.lyra-card-split`'s
            // `-even`, see that class's own doc comment in
            // lyra-tokens.css for why the two families differ here), and
            // reacts off the same `.lyra-form-grid-wrap` boundary this
            // row's ancestor (`CustomerDirectoryTabContent`'s root div)
            // already establishes — full width (e.g. `allowFullScreen`'d)
            // reads as a real 3-up row per the reference screenshot, this
            // panel's normal ~350–425px resizable width stacks to one
            // column same as before this existed.
            <div className="lyra-form-grid">
              <div className="flex flex-col gap-3">
                {/* `max-w-sm` (384px) — same convention as the Directory
                    tab's `EmailInput` above (see its own comment): caps a
                    single full-width-by-default field at a sane reading
                    width via the standing `className` passthrough, rather
                    than letting it stretch to fill this column's full
                    (already only ~1/3-row) width. */}
                <PhoneInput value={phone} onChange={setPhone} className="max-w-sm" />
                <div className="flex flex-col gap-1">
                  <span className="lyra-body-md-emphasis text-lyra-fg-default">Call Attempts Today: 0</span>
                  <span className="lyra-body-md-emphasis text-lyra-fg-default">Call Attempts Total: 0</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Checkbox label="Consent Call" checked={consentCall} onCheckedChange={(c) => setConsentCall(c === true)} />
                <Checkbox label="Consent SMS" checked={consentSms} onCheckedChange={(c) => setConsentSms(c === true)} />
              </div>
              <RadioGroup value={block} onValueChange={setBlock} className="gap-2">
                {CUSTOMER_DIRECTORY_BLOCK_OPTIONS.map((option) => (
                  <RadioGroupItem key={option.value} value={option.value} label={option.label} />
                ))}
              </RadioGroup>
            </div>
          ),
        },
      ]}
    />
  );
}

/* ── CustomerDirectoryTabContent ──
   The "Directory" tab (per a reference screenshot of a legacy admin
   contact-edit page): an `EmailInput` + a standalone consent `Checkbox` at
   the top, then up to 10 phone slots (`CustomerDirectoryPhoneRow`),
   separated by a hairline divider between every section
   (`border-lyra-border-subtle`). The reference screenshot's own
   alternating shaded/unshaded rows were dropped on request — plain
   dividers only, no zebra striping.

   Reference screenshot's own field labels were all-caps ("EMAIL", "HOME") —
   same legacy-app-styling situation as the Detail tab's "CONTACT #" etc.
   (see `CustomerDetailTabContent`'s own doc comment and CONTRIBUTING.md
   §17): typed in normal case here and left to each field component's own
   built-in label typography, not forced uppercase via CSS.

   Only the "Home" row (the first phone slot) seeds from real data — the
   same `fields` "Phone #" this panel's Overview/Detail tabs already show
   (parsed back into a `PhoneValue` via `phoneValueFromDisplay`), with
   `consentCall`/`consentSms` defaulted true since it's the customer's
   already-established primary channel. "Phone 2" through "Phone 10" have
   no real or synthesized source (a customer doesn't have 10 real numbers
   in this app's data), so they start genuinely blank/unconsented, same as
   the reference screenshot shows them. */
function CustomerDirectoryTabContent({ email, phoneDisplay }: { email: string; phoneDisplay: string }) {
  const [directoryEmail, setDirectoryEmail] = useState(email);
  const [emailConsent, setEmailConsent] = useState(false);

  return (
    <div className="flex flex-col lyra-form-grid-wrap">
      <div className="flex flex-col gap-3 px-4 py-4">
        {/* `max-w-sm` (384px) — same "cap a single full-width-by-default
            field at a sane reading width" convention lyra-ui's own
            Storybook demos use for a lone `Input`/`EmailInput` outside a
            multi-column grid (`Input.stories.tsx`'s `max-w-[400px]`,
            `TagsInput`/`Textarea` stories' `max-w-sm`) — `EmailInput`
            itself has no dedicated width prop; `className` lands on its
            outer wrapper div (email-input.tsx) same as `Input`, so this is
            the standing way to constrain one rather than adding a new
            component prop for it. */}
        <EmailInput label="Email" value={directoryEmail} onChange={setDirectoryEmail} className="max-w-sm" />
        <Checkbox label="Consent" checked={emailConsent} onCheckedChange={(c) => setEmailConsent(c === true)} />
      </div>
      {/* Each phone slot is now its own bordered card
          (`CUSTOMER_INFO_ACCORDION_CLASSNAME` on the `Accordion` inside
          `CustomerDirectoryPhoneRow`), so this wrapper switches from a bare
          `border-t` + flush list (dividers supplied by each row's own
          bottom border) to a gap + padding, matching the Overview/Detail
          tabs' own card-stack spacing. */}
      <div className="flex flex-col gap-4 px-4 pt-3 pb-4">
        {CUSTOMER_DIRECTORY_PHONE_LABELS.map((label, i) => (
          <CustomerDirectoryPhoneRow
            key={label}
            label={label}
            defaultState={
              i === 0
                ? { phone: phoneValueFromDisplay(phoneDisplay), consentCall: true, consentSms: true, block: "no-block" }
                : { phone: { countryCode: "us", number: "" }, consentCall: false, consentSms: false, block: "no-block" }
            }
          />
        ))}
      </div>
    </div>
  );
}

function CustomerInformationPanelBody({
  activeTab,
  customerName,
  fields,
  latestInteraction,
}: {
  activeTab: number;
  /** Needed here (not just by `buildCustomerInfoFields`) for the Detail
   *  tab's "First Name"/"Last Name" fields — see `CustomerDetailTabContent`. */
  customerName?: string;
  /** Built per-interaction by `buildCustomerInfoFields` (see
   *  `CustomerInformationInteriorPanel`, which owns the interaction's
   *  `customerName`/`recordId`/`channels` this depends on) — no longer a
   *  fixed module-level placeholder shared by every interaction. */
  fields: CustomerInfoField[];
  /** Built per-interaction by `buildLatestInteraction` — see that
   *  function's own doc comment. */
  latestInteraction: CustomerLatestInteraction;
}) {
  return (
    <div className="flex flex-col">
      {/* No avatar/name/presence block here — the InteriorPanel's own
          header (`headerTitle="Customer Information"` +
          `headerSubhead="{name} · {id}"`) already shows the name, so a
          second name+avatar block right below it was redundant.

          No tabs here either anymore — they used to live at the top of
          this same scrolling body, pinned via a hand-rolled `sticky`
          wrapper (see the git history / CONTRIBUTING.md's "Composing
          panel body content" for the full story of why that was wrong:
          the surrounding scroll container's own scrollbar still ran
          alongside a merely-`sticky` row, and `TabList`'s "N More"
          overflow menu had its own separate bug where selecting a tab
          from it silently did nothing once the row collapsed, fixed in
          tabs.tsx). They now render inside the header itself via
          `InteriorPanel`'s `headerTabs` prop — see
          `CustomerInformationInteriorPanel` below, which owns the
          `activeTab` state both this body and that header tab row need
          and passes this component just the number.

          This field list and the Latest Interaction accordion below it are
          now both explicitly gated to the Overview tab (`activeTab ===
          ...indexOf("Overview")`) — previously only the accordion had that
          gate, so this list rendered on every tab, including the new
          Detail tab added below, which shows its own full editable version
          of the same fields (`CustomerDetailTabContent`) and would
          otherwise show them twice.

          The field list and the Latest Interaction accordion below now
          share one `.lyra-card-split-wrap`/`.lyra-card-split` row (see
          lyra-tokens.css) instead of always stacking — reusing the same
          family `DashboardCard` bodies already use for "a couple of
          regions side by side, stacking once the container's own width
          gets tight" rather than inventing a new one (its ≤480px threshold
          already fits here on both ends: this panel's normal resizable
          range, ~350–425px per `InteriorPanel`'s own min/max defaults,
          stays comfortably under it — single column, unchanged from
          before this existed — and `allowFullScreen`'d width is easily
          past it — side by side). `align-items: stretch` (that family's
          own default) is harmless here specifically because `Accordion`'s
          own root has no `h-full`/`flex-1` of its own (accordion.tsx) — a
          stretched flex item just leaves invisible empty space below its
          natural-height content, not a visibly over-tall bordered box.

          Unlike `.lyra-container-grid`/`.lyra-form-grid`, `.lyra-card-
          split` does NOT put `flex: 1 1 0%` on its children automatically
          — that family's own two optional modifiers (`.lyra-card-split-
          fixed`, a deliberately fixed 12rem column; `.lyra-card-split-
          chart`, `flex: 1 1 0%` for the region beside it) exist precisely
          because its usual pairing is one fixed-width region next to one
          flexible one, not two equal columns. Left as plain children here,
          the two columns took their own natural content width instead —
          the field list (narrow content) versus the Latest Interaction
          card (padding + longer text) rendering visibly unequal. The new
          `.lyra-card-split-even` modifier (lyra-tokens.css) on both fixes
          that, splitting the row evenly (and correctly resetting back to
          full-width at the stacked stage, same as `.lyra-container-grid`/
          `.lyra-form-grid`'s own children — see that modifier's own doc
          comment for why a bare `flex-1` utility class alone isn't enough
          here). */}
      {activeTab === CUSTOMER_PANEL_TABS.indexOf("Overview") && (
        <div className="px-4 py-3 lyra-card-split-wrap">
          <div className="lyra-card-split">
            {/* Customer Overview field list. Wrapped in the same neutral
                container + collapsible `Accordion` treatment as the Latest
                Interaction block below it (see that block's own comment for
                the container/collapsible rationale — applies identically
                here), rather than the field rows sitting flush against the
                panel background. */}
            <Accordion
              className={cn(CUSTOMER_INFO_ACCORDION_CLASSNAME, "lyra-card-split-even")}
              defaultValue="customer-overview"
              items={[
                {
                  id: "customer-overview",
                  title: "Customer Overview",
                  content: (
                    <div className="flex flex-col gap-3">
                      {fields.map((field, index) => (
                        <div key={field.label} className="flex flex-col gap-3">
                          <div className="flex items-center justify-between gap-4">
                            <Label label={field.label} />
                            <span className="lyra-body-md text-lyra-fg-secondary whitespace-nowrap">
                              {field.value}
                            </span>
                          </div>
                          {index < fields.length - 1 && <Separator />}
                        </div>
                      ))}
                    </div>
                  ),
                },
              ]}
            />

            {/* Latest Interaction summary. Wrapped in a neutral container
                (`bg-lyra-bg-control-subtle`, rounded) per CONTRIBUTING.md's
                "Composing panel body content" convention, rather than
                sitting flush against the panel background — the
                convention to follow for any future card-like block added
                here, not a one-off choice for this block alone.

                Collapsible via lyra-ui's `Accordion` (single item, open by
                default) rather than a plain static block, so the panel can
                be collapsed once read. Its trigger renders the "Latest
                Interaction" title itself — no hand-styled label needed
                here at all, which also fixes an earlier mistake: that
                label used to be a hand-built `uppercase tracking-wide`
                span, applying an all-caps CSS transform to change how it
                displayed instead of just typing it correctly — exactly
                the thing CONTRIBUTING.md §17 ("Field label casing") says
                not to do ("don't add `text-transform`; type the label
                text correctly to begin with"). Typing the string as
                `"Latest Interaction"` (already correct Title Case) and
                letting the shared component's own typography render it is
                the fix, not restyling it further.

                Content itself comes from `latestInteraction` (built by
                `buildLatestInteraction`) rather than one fixed placeholder
                blurb — see that function's own doc comment for why (it
                used to be the exact same "Asked about upgrading her
                plan..." summary for every customer, gendered pronoun and
                all, regardless of who was actually open). `statusColor`
                drives the `Badge`'s `color` instead of a hardcoded
                `"green"`, since a synthesized status can land on
                "Escalated"/"Pending" too, not just "Resolved". */}
            <Accordion
              className={cn(CUSTOMER_INFO_ACCORDION_CLASSNAME, "lyra-card-split-even")}
              defaultValue="latest-interaction"
              items={[
                {
                  id: "latest-interaction",
                  title: "Latest Interaction",
                  content: (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-1.5 lyra-body-sm text-lyra-fg-secondary">
                          <Clock className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                          {latestInteraction.timeAgo} · {latestInteraction.channel}
                        </span>
                        <Badge color={latestInteraction.statusColor} variant="subtle">
                          {latestInteraction.status}
                        </Badge>
                      </div>
                      <p className="lyra-body-md text-lyra-fg-default">{latestInteraction.summary}</p>
                      <span className="lyra-body-sm text-lyra-fg-secondary">
                        {latestInteraction.caseId} · Handled by {latestInteraction.handledBy}
                      </span>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      )}

      {activeTab === CUSTOMER_PANEL_TABS.indexOf("Detail") && (
        <CustomerDetailTabContent customerName={customerName} fields={fields} />
      )}

      {activeTab === CUSTOMER_PANEL_TABS.indexOf("Directory") && (
        <CustomerDirectoryTabContent
          email={getFieldValue(fields, "Email")}
          phoneDisplay={getFieldValue(fields, "Phone #")}
        />
      )}
    </div>
  );
}

/* ── CustomerInformationInteriorPanel ──
   Owns `activeTab` — the one piece of state both the header's `TabList`
   (via `InteriorPanel`'s `headerTabs`) and the scrolling body below it
   (`CustomerInformationPanelBody`) need, which is why this wraps both
   instead of `CustomerInformationPanelBody` owning that state itself the
   way it used to when the tabs still lived inside it.

   Also where the field list and Latest Interaction summary are actually
   computed (`buildCustomerInfoFields`/`buildLatestInteraction`, each
   memoized on `customerName`/`recordId`/`channels`) — takes the raw
   interaction fields instead of a pre-joined `headerSubhead` string so it
   has what it needs to build the header text and both panel-body pieces
   from the same source, rather than the caller assembling one string this
   component has to parse back apart. */
function CustomerInformationInteriorPanel({
  open,
  onClose,
  customerName,
  recordId,
  channels,
  width,
  onWidthChange,
}: {
  open: boolean;
  onClose: () => void;
  customerName?: string;
  recordId: string;
  channels: TrackedChannel[];
  width: number;
  onWidthChange: (width: number) => void;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const fields = useMemo(
    () => buildCustomerInfoFields(customerName, recordId, channels),
    [customerName, recordId, channels]
  );
  const latestInteraction = useMemo(
    () => buildLatestInteraction(customerName, recordId),
    [customerName, recordId]
  );

  return (
    <InteriorPanel
      side="right"
      open={open}
      onClose={onClose}
      headerTitle="Customer Information"
      headerSubhead={`${customerName ?? "Customer"} · ${recordId}`}
      // Lets an agent expand this panel to the full width of its container
      // when a tab's content (e.g. Directory's phone list, or Detail's
      // two-column form) would benefit from more room than the panel's
      // normal ~350–425px resizable range comfortably gives it — see
      // `allowFullScreen`'s own doc comment in interior-panel.tsx.
      allowFullScreen
      // Plain default `"wide"` mode (no `overflowBreakpoint` override) per
      // explicit request: a fixed ≤400px collapse threshold, with the row
      // scrolling via chevrons above that if these 8 tabs don't all fit —
      // same behavior as every other `TabList` in the app. An earlier pass
      // used `overflowBreakpoint="compact"` instead (content-aware,
      // collapsing exactly when the tabs stop fitting regardless of any
      // fixed pixel number) specifically because this panel's normal
      // ~350–425px resizable width sits almost entirely at or under that
      // 400px line — under `"wide"`, the row is collapsed to "active tab +
      // N More" for nearly the panel's whole non-full-screen size range,
      // only showing real tabs (or chevrons) once `allowFullScreen` pushes
      // it past 400px. Switched back to the standard `"wide"` default
      // anyway, to match how every other tab bar in the app behaves,
      // trading that off deliberately.
      headerTabs={
        <TabList className="px-4" overflowMenu>
          {CUSTOMER_PANEL_TABS.map((label, i) => (
            <Tab key={label} active={activeTab === i} onClick={() => setActiveTab(i)}>
              {label}
            </Tab>
          ))}
        </TabList>
      }
      width={width}
      onWidthChange={onWidthChange}
    >
      <CustomerInformationPanelBody
        activeTab={activeTab}
        customerName={customerName}
        fields={fields}
        latestInteraction={latestInteraction}
      />
    </InteriorPanel>
  );
}

/* ── AgentNextGenPage ── */

type Page = "agent-workspace" | "agent" | "outbound" | "login";

const AI_PANEL_DEFAULT_WIDTH = 360;

// Screen Pop — external apps an agent can pop the current contact/record
// into. Dummy list; wiring an actual screen-pop integration per app is out
// of scope for now.
const SCREEN_POP_APPS: SelectOption[] = [
  { value: "salesforce", label: "Salesforce" },
  { value: "zendesk",    label: "Zendesk" },
  { value: "servicenow", label: "ServiceNow" },
  { value: "hubspot",    label: "HubSpot" },
  { value: "freshdesk",  label: "Freshdesk" },
];

export function AgentNextGenPage({
  showPageHeader = false,
  showPanelToggle = false,
  showInteriorPanel = true,
  onNavigate,
  initialInteraction,
  sidePanelToggleLabel,
}: {
  showPageHeader?: boolean;
  showPanelToggle?: boolean;
  showInteriorPanel?: boolean;
  onNavigate?: (page: Page) => void;
  /**
   * Seeds `interactions`/`activeInteractionId` with an already-active call
   * instead of starting empty — mirrors lyra-ui's `AgentNextGenTemplate`
   * "Active Interaction" story prop of the same name (see that story's own
   * doc comment for the full rationale). Not passed anywhere in this app
   * today — kept as an opt-in capability so this component stays in sync
   * with the canonical template's shape, not to change default behavior.
   */
  initialInteraction?: ActiveInteraction;
  /**
   * Overrides the record-header toggle button's tooltip for the Customer
   * Information `InteriorPanel` (the button is icon-only, so this is its
   * only visible label) — mirrors lyra-ui's `AgentNextGenTemplate` prop of
   * the same name. Defaults to "Toggle Customer Information" here; pass a
   * different string to override it.
   */
  sidePanelToggleLabel?: string;
}) {
  const [navOpen, setNavOpen] = useState(!!initialInteraction);
  // No interactions exist until the agent launches one from the CreateNew
  // menu (Start Interaction / quick dial) — see handleStartCall/handleQuick
  // Dial below. Click any resulting InteractionNavItem card to make it the
  // active one. `initialInteraction` (see above) seeds this instead, for
  // callers that want to start already mid-call.
  const [interactions, setInteractions] = useState<ActiveInteraction[]>(
    () => (initialInteraction ? [initialInteraction] : [])
  );
  const [activeInteractionId, setActiveInteractionId] = useState<string | null>(
    () => initialInteraction?.id ?? null
  );
  // Drives the main content area: whenever an interaction is active, the
  // Desk dashboard is replaced by that interaction's blank detail page (see
  // the PageHeader "record header" mode below) — starting/quick-dialing/
  // redialing a new assignment always sets this, so the screen switches
  // over automatically the moment one is added.
  const activeInteraction = interactions.find((i) => i.id === activeInteractionId) ?? null;
  // Shared clock powering every open channel's live "MM:SS since it
  // started" elapsed display — independent of `elapsedSeconds` below, which
  // is the agent's own status timer and resets on status change.
  const [clockTick, setClockTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setClockTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const [activeDeskTab, setActiveDeskTab] = useState<"home" | "customers" | "accounts" | "tickets" | "interactions" | "wem">("home");
  /* Settings — a third top-level view alongside Desk/interaction-record,
     shown in place of both in the content column when the Settings rail
     item is clicked. Mutually exclusive with an active interaction: opening
     one closes the other. Interaction → Settings is enforced below via an
     effect (selecting/starting any interaction always takes over the
     content column, same "one primary view at a time" rule Desk already
     follows per `buildNavItems`'s `active: !hasActiveInteraction`); Settings
     → interaction is enforced the other way, directly in the `LeftNav`
     `onSettingsClick` handler, since there's only that one call site
     (unlike `setActiveInteractionId`, which has several). */
  const [showSettings, setShowSettings] = useState(false);

  // Effect rather than touching every `setActiveInteractionId` call site
  // individually.
  useEffect(() => {
    if (activeInteractionId) setShowSettings(false);
  }, [activeInteractionId]);
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("unavailable");
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
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

  /* ── Single-container app-header panel ──
     Screen Pop/Conversations/Schedule/Notifications/Ask AI used to each be
     an independently open/mounted/positioned/sized `Draggable` (five full
     copies of this state, plus a `dockPanelExclusively` helper enforcing
     "only one of the five may be docked at once"). Per request ("Multiple
     Containers: false" — see lyra-ui's `Draggable.stories.tsx`
     `MultiplePanelsSingleDock` story and its own "Multiple Containers"
     control), there is now only ONE physical container — clicking a
     different button just swaps `activePanelKey` (and therefore which
     content shows) without the container itself resizing, repositioning,
     or replaying its open/close animation. That also makes the old
     "only one may be docked" rule trivially true (there's only ever one
     container to dock) instead of something to actively enforce.

     Ask AI's and Notifications' actual content (previously only reachable
     via the standalone `AiPanel`/`AgentNotifications` components, each of
     which bakes its own header AND its own `Draggable` wrapper together)
     now comes from `useAiPanelContent`/`useAgentNotificationsContent`
     (lyra-ui) — the same two hooks those components call internally, so
     this is a second CALLER of that content, not a second, drifting copy
     of it. See lyra-ui's own "Single Container - Real Content" Storybook
     demo (`Draggable.stories.tsx`) for this exact pattern in isolation. */
  type PanelKey = "ai" | "notif" | "conversations" | "schedule" | "screenpop";

  const [panelOpen,      setPanelOpen]      = useState(false);
  const [panelMounted,   setPanelMounted]   = useState(false);
  const [panelState,     setPanelState]     = useState<PanelState>("closed");
  const [activePanelKey, setActivePanelKey] = useState<PanelKey | null>(null);
  // Defaults to "docked" per an earlier request — the AppHeader icon
  // buttons should each open the full layout-pushing docked panel
  // immediately on first click, rather than a transient floating popover.
  // The actual dock-on-open happens explicitly in `handlePanelButtonClick`
  // below (only when transitioning fully closed -> open) — "float" is
  // still reachable afterward (dragging the panel off the edge, or just
  // switching which button is active while already open leaves whatever
  // variant it was already in alone).
  const [panelVariant,    setPanelVariant]    = useState<DraggableVariant>("docked");
  const [panelWidth,      setPanelWidth]      = useState(AI_PANEL_DEFAULT_WIDTH);
  const [panelHeight,     setPanelHeight]     = useState(860);
  const [panelIsResizing, setPanelIsResizing] = useState(false);
  const containerRef  = useRef<HTMLDivElement>(null);
  const panelFloatLeft = useRef<number | null>(null);
  const panelFloatTop  = useRef<number | null>(null);
  const panelRef       = useRef<HTMLDivElement>(null);
  const panelAnimTimer = useRef<ReturnType<typeof setTimeout>>();
  const [screenPopApp, setScreenPopApp] = useState("");

  /* Interior panel (right) */
  const [interiorPanelOpen, setInteriorPanelOpen] = useState(false);
  /* Which home-tab queue widget (if any) is selected — reuses the same
     interior panel slot as Case Details, swapping its content instead of
     stacking a second right-docked panel. */
  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);

  /* ── Live queue simulation ──
     The home tab's queue widgets should look "live" — wait time ticks up
     like a real clock, and Contacts fluctuates a bit over time — without
     reintroducing the old `randomContactsCount()` bug (an independently-
     randomized number that could disagree with the side panel's own
     breakdown, see the comment on `sumInQueue` above). So the *only* thing
     that gets randomized here is `queueSubItems` itself — the same list
     the side panel renders and `sumInQueue` totals for the Contacts metric
     — every few seconds one random sub-item's `inQueueCount` nudges by
     -1/0/+1 (clamped to [0, 20]). Both the widget's Contacts number and the
     side panel's "In Queue" figures re-derive from this one state update,
     so they can't drift apart. Wait time uses the shared `clockTick`
     (declared above) instead of its own timer — same "count seconds since
     mount" convention `formatElapsedTime`'s callers already use — added to
     each queue's `QUEUE_WAIT_BASE_SECONDS` baseline every render. */
  const [queueSubItems, setQueueSubItems] = useState<Record<string, QueueSubItem[]>>(INITIAL_QUEUE_SUB_ITEMS);
  useEffect(() => {
    const id = setInterval(() => {
      setQueueSubItems((prev) => {
        const queueIds = Object.keys(prev);
        const queueId = queueIds[Math.floor(Math.random() * queueIds.length)];
        const items = prev[queueId];
        const itemIndex = Math.floor(Math.random() * items.length);
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const nextCount = Math.max(0, Math.min(20, items[itemIndex].inQueueCount + delta));
        if (nextCount === items[itemIndex].inQueueCount) return prev;
        return {
          ...prev,
          [queueId]: items.map((item, i) => (i === itemIndex ? { ...item, inQueueCount: nextCount } : item)),
        };
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  /* Home tab's queue widget row — `LATEST_CONTACTS_STATIC`'s fixed fields
     merged with the live `contactsCount`/`skillsCount` (derived from
     `queueSubItems`) and `wait` (derived from `clockTick`) every time
     either changes. Wait is pinned to zero once a queue actually empties
     (matches the reference screenshot's own Inbound Voice row: 0 contacts,
     00:00:00 wait) rather than ticking up forever regardless of whether
     anyone's still waiting. */
  const latestContacts = useMemo<LatestContact[]>(() => {
    return LATEST_CONTACTS_STATIC.map((base) => {
      const contactsCount = sumInQueue(queueSubItems[base.id]);
      return {
        ...base,
        contactsCount,
        skillsCount: queueSubItems[base.id].length,
        agentsCount: AGENTS_COUNT_BY_QUEUE[base.id],
        wait: contactsCount > 0 ? formatWaitTime(QUEUE_WAIT_BASE_SECONDS[base.id] + clockTick) : formatWaitTime(0),
      };
    });
  }, [queueSubItems, clockTick]);

  /* Customer Information panel — an `InteriorPanel` (right-docked, inline
     within the interaction body's own flex row) rather than the `SidePanel`/
     `CustomerInformationPanel` this used to be built on. `InteriorPanel` has
     no pin/hover-preview concept at all (that's a `SidePanel`-only idea) and
     already handles the "too narrow, force an overlay" case internally
     (built into the component itself below ~1024px container width), so
     none of the old pinned/hover-timer/narrow-container plumbing is needed
     here anymore — just a plain open/closed boolean, matching how the
     Desk dashboard's own right-docked `InteriorPanel` (below, "Case
     Details"/queue drill-down) already works. */
  const [customerPanelOpen,  setCustomerPanelOpen]  = useState(false);
  const [customerPanelWidth, setCustomerPanelWidth] = useState(350);

  // The Customer Information panel belongs to the interaction it was opened
  // from — its only trigger is the toggle button on the interaction
  // `PageHeader`, which doesn't exist on the Desk dashboard at all. Leaving
  // the interaction (dismissing it, or navigating to Desk/another tab) must
  // close it, or it'd stay open pointing at a customer who's no longer the
  // active interaction. Keyed on the id (a stable primitive) rather than
  // the `activeInteraction` object itself.
  useEffect(() => {
    if (!activeInteractionId) setCustomerPanelOpen(false);
  }, [activeInteractionId]);

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

  // Close and undock the shared app-header panel when viewport drops below
  // 1280px — generalized from a pairwise "if AI is docked .../if
  // Notifications is docked ..." (the old five-panel version only ever
  // covered two of the five) to the one shared container this now is.
  useEffect(() => {
    if (isNavNarrow && panelVariant === "docked") {
      setPanelVariant("float");
      setPanelOpen(false);
    }
  }, [isNavNarrow]); // eslint-disable-line react-hooks/exhaustive-deps

  // Plain open/closed toggle for the Customer Information `InteriorPanel`'s
  // trigger button — no pin/hover state to coordinate with anymore (see the
  // panel state's own doc comment above).
  const handleCustomerPanelToggle = () => setCustomerPanelOpen((v) => !v);

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

  /* ── Launching interactions from CreateNew ──
     Overrides OUTBOUND_CONFIG's default onStartCall/onQuickDial (which just
     console.log) so this page actually surfaces what gets launched as
     InteractionNavItem cards in the left nav. Each handler below also
     expands the nav (`setNavOpen(true)`) — a collapsed rail would otherwise
     hide the card it just launched/updated from view entirely, so starting
     a call always surfaces it regardless of whether the nav happened to be
     collapsed at the time. */
  const handleStartCall = (selection: {
    contact: CreateNewOutboundContact;
    channel: ChannelType;
    phone: string;
    skillId: string;
  }) => {
    const skillLabel = OUTBOUND_CONFIG.skillOptions.find((o) => o.value === selection.skillId)?.label;
    // `phoneOptions` only has a value→label mapping for phone numbers (raw
    // digits → formatted display string) — email/WhatsApp addresses are
    // already human-readable as-is (see `create-new.tsx`'s
    // `defaultDetailValueFor`, where their `value` and `label` are the same
    // string), so falling back to `selection.phone` itself is correct there,
    // not a placeholder.
    const addressLabel = OUTBOUND_CONFIG.phoneOptions.find((o) => o.value === selection.phone)?.label ?? selection.phone;
    const newChannel: TrackedChannel = {
      id: `${selection.channel}:${selection.phone}`,
      type: selection.channel,
      startTick: clockTick,
      preview: skillLabel,
      value: selection.phone,
      addressLabel,
      // A freshly started outbound conversation hasn't exchanged any
      // messages yet — `0` (not omitted) so the tooltip actually reads "0
      // Messages" instead of showing nothing. Voice has no message concept
      // at all, so it's left `undefined` there — see
      // `ChannelTabProps.messageCount`'s own doc comment.
      messageCount: selection.channel === "voice" ? undefined : 0,
      interactionId: generateInteractionId(),
    };

    setInteractions((prev) => {
      const idx = prev.findIndex((i) => i.id === selection.contact.id);
      // No existing interaction with this contact — start a new card.
      if (idx === -1) {
        return [...prev, {
          id: selection.contact.id,
          customerName: selection.contact.name,
          // `subtitle` is the contact's real id (customerId/agentId/
          // TEAM-.../SKL-.../ASN-...) whenever CreateNew's record set one —
          // only missing for records that genuinely have none.
          recordId: selection.contact.subtitle ?? generateCaseId(),
          channels: [newChannel],
          currentChannelId: newChannel.id,
        }];
      }
      // Same contact already has an interaction open — restart the matching
      // channel's timer if this is the *same* type+address (e.g. redialing
      // the same SMS number), or add a new row alongside the existing ones
      // if it's a different address on the same type (e.g. a second SMS
      // thread on a different number) — those are genuinely separate
      // conversations, not a duplicate of the first, so they shouldn't
      // overwrite it.
      return prev.map((interaction, i) => {
        if (i !== idx) return interaction;
        const chIdx = interaction.channels.findIndex((c) => c.id === newChannel.id);
        const channels = chIdx === -1
          ? [...interaction.channels, newChannel]
          : interaction.channels.map((c, j) => (j === chIdx ? newChannel : c));
        // The channel just started/restarted always takes over as current —
        // mirrors InteractionNavItem's own auto-select-newest rule, now
        // mirrored up here too since this state is what drives both the
        // card (via currentChannelKey) and the new ChannelToggle bar.
        return { ...interaction, channels, currentChannelId: newChannel.id };
      });
    });
    setActiveInteractionId(selection.contact.id);
    setNavOpen(true);
    // A newly launched interaction defaults to its Customer Information
    // panel open — previously it stayed closed until the agent clicked the
    // toggle on every single interaction, even though that's the panel
    // they almost always want up front.
    setCustomerPanelOpen(true);
  };

  const handleQuickDial = (phoneNumber: string) => {
    // No contact record for a quick-dialed number — key the card off the
    // number itself so redialing the same number restarts its card rather
    // than stacking up duplicates.
    const id = `quickdial:${phoneNumber}`;
    // Voice has no message concept at all, so `messageCount` is left
    // undefined here (not `0`) — see `ChannelTabProps.messageCount`'s own
    // doc comment for why that's a deliberate omission, not an oversight.
    const newChannel: TrackedChannel = {
      id: "voice",
      type: "voice",
      startTick: clockTick,
      value: phoneNumber,
      addressLabel: phoneNumber,
      interactionId: generateInteractionId(),
    };
    setInteractions((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx === -1) return [...prev, { id, recordId: generateCaseId(), channels: [newChannel], currentChannelId: newChannel.id }];
      return prev.map((interaction, i) => (i === idx ? { ...interaction, channels: [newChannel], currentChannelId: newChannel.id } : interaction));
    });
    setActiveInteractionId(id);
    setNavOpen(true);
    setCustomerPanelOpen(true);
  };

  /* "Redial" from the home tab's Contact History card — same merge-by-id
     pattern as `handleQuickDial` (a fresh "voice" channel, keyed so redialing
     the same past contact again restarts their existing card instead of
     stacking a duplicate), but keyed off that contact-history entry's own id
     (namespaced "redial:" to stay distinct from quick-dial/outbound ids) and
     carrying the customer's real name, since — unlike a quick-dialed number —
     Contact History always has one on hand. Also expands the nav, same
     reasoning as handleStartCall/handleQuickDial above.

     Prefers `entry.customerId` (the real `CREATE_NEW_CUSTOMERS` id) over the
     synthetic `redial:` one whenever it's on hand — this was a real, shipped
     bug: `useOutboundAddButton`'s `getHeaderAction` looks up an interaction's
     own id in `outboundConfig.groups` to build its "+" (Add Channel) button,
     and `CreateNew`'s `launchRequest` effect does the same lookup again when
     a channel is actually picked from that button's flyout. A synthetic
     `redial:ch1`-style id never matches any real contact id, so the button
     still rendered (its own fallback, per `getHeaderAction`'s doc comment,
     covers exactly this) but clicking a channel in it silently did nothing —
     `CreateNew`'s effect found no matching contact and just called
     `onLaunchRequestHandled()` without ever opening the call-setup screen.
     Using the real id makes a redialed card id-identical to one started
     from the Outbound picker for the same customer, so "Add Channel" (and,
     as a side effect, redialing the same customer who already has a card
     open elsewhere) both resolve correctly. Only the 5 hand-authored
     `CONTACT_HISTORY` rows (fictional names/case IDs, no backing
     `CREATE_NEW_CUSTOMERS` record) still fall back to the synthetic id —
     same pre-existing limitation `handleQuickDial` already has for numbers
     with no contact record at all, not something new. */
  const handleRedial = (entry: ContactHistoryEntry) => {
    const id = entry.customerId ?? `redial:${entry.id}`;
    // No stored phone number on ContactHistoryEntry — this channel's
    // ChannelToggle just shows icon + "Voice" with no address, same as any
    // other channel with no addressLabel.
    const newChannel: TrackedChannel = {
      id: "voice",
      type: "voice",
      startTick: clockTick,
      interactionId: generateInteractionId(),
    };
    setInteractions((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx === -1) return [...prev, { id, customerName: entry.name, recordId: entry.caseId, channels: [newChannel], currentChannelId: newChannel.id }];
      return prev.map((interaction, i) => (i === idx ? { ...interaction, channels: [newChannel], currentChannelId: newChannel.id } : interaction));
    });
    setActiveInteractionId(id);
    setNavOpen(true);
    setCustomerPanelOpen(true);
  };

  /* "Unassign & Dismiss" — `InteractionNavItem` itself decides which of
     these two applies (based on how many channels the card has open when
     it's clicked), so these just need to implement each half:
     `onDismiss` (whole card, only called when just one channel was open —
     nothing would be left of the card otherwise) removes the interaction
     entirely, clearing `activeInteractionId` too if it was the active one so
     the side panel/content area doesn't keep pointing at a card that no
     longer exists. `onDismissChannel` (only called when more than one
     channel was open) drops just that one channel, leaving the rest of the
     card and its other channels open. The `ChannelToggle` bar's own kebab
     wires to the same two handlers (see the `activeInteraction` block
     below), so dismissing from a toggle behaves identically to dismissing
     from the card. */
  const handleDismissInteraction = (id: string) => {
    // Dismissing the active assignment shouldn't strand the agent on an
    // empty dashboard when there's other open work waiting — hand "active"
    // to whichever assignment now sits at the top of the LeftNav list
    // (`interactions` renders top-down, see the `header` block below)
    // instead of clearing to `null`. Only clears to `null` (back to the
    // dashboard) once every assignment is gone. Computed from the same
    // filtered list `setInteractions` below produces, so the two state
    // updates can never disagree about what's actually left.
    const remaining = interactions.filter((interaction) => interaction.id !== id);
    setInteractions(remaining);
    setActiveInteractionId((current) => (current === id ? remaining[0]?.id ?? null : current));
  };

  const handleDismissChannel = (id: string, channel: Pick<InteractionChannel, "id" | "type">) => {
    // Match on `id` (falling back to `type`, same as InteractionNavItem's
    // own `channelKey` convention) rather than `type` alone — two open
    // channels can share a `type` (e.g. two SMS threads on different
    // numbers), and filtering by `type` would drop *both* instead of just
    // the one the agent actually dismissed.
    const dismissedKey = channel.id ?? channel.type;
    setInteractions((prev) =>
      prev.map((interaction) => {
        if (interaction.id !== id) return interaction;
        const channels = interaction.channels.filter((c) => (c.id ?? c.type) !== dismissedKey);
        // Dismissing the currently-selected channel needs to hand "current"
        // to another remaining one (the new last channel, same fallback
        // InteractionNavItem itself uses) — otherwise the card/tab bar would
        // keep pointing at a channel that no longer exists.
        const currentChannelId = interaction.currentChannelId === dismissedKey
          ? channels[channels.length - 1]?.id
          : interaction.currentChannelId;
        return { ...interaction, channels, currentChannelId };
      })
    );
  };

  /** Fired by a card row's `onCurrentChannelChange` or a `ChannelToggle`'s
   *  `onClick` — both point at this same setter so either one updates the
   *  other (see `ActiveInteraction.currentChannelId`'s own doc comment). */
  const handleChannelSelect = (interactionId: string, channelKey: string) => {
    setInteractions((prev) =>
      prev.map((interaction) =>
        interaction.id === interactionId ? { ...interaction, currentChannelId: channelKey } : interaction
      )
    );
  };

  /* ── Preventing duplicate channels from the CreateNew picker ──
     A contact already reachable via a currently-open channel (e.g. Jamie
     Torres has an SMS interaction open on a specific number) still shows
     that channel in "Select Channel" and every address in the detail
     screen's second field ("Select Phone"/"Select Email Address"/"Select
     WhatsApp Handle") — except whichever exact address(es) are already in
     use, which are disabled so starting another interaction on one of them
     wouldn't just duplicate the one already running (a different outbound
     line for the same channel — or a second, still-unused one, even when
     one SMS number is already open — stays selectable).
     `CreateNewOutboundContact.openChannelAddresses` is exactly the
     mechanism `CreateNew` exposes for this (see its own doc comment), so
     rather than adding new disabling logic to that shared component, this
     derives a per-render copy of OUTBOUND_CONFIG that tags each contact
     with every address in use for whichever channels they already have
     open in `interactions` (read off each `TrackedChannel.value`, set at
     start-call time — a contact can have more than one channel of the same
     type open at once, e.g. two SMS threads on different numbers, so this
     is a list per channel type, not a single address), across every group
     (Agents/Teams/Skills/Customers — Favorites is derived from these same
     records, so it inherits the tagging automatically). Recomputed
     whenever `interactions` changes so an address re-enables the moment its
     interaction is dismissed. */
  const outboundConfig = useMemo<CreateNewOutboundConfig>(() => {
    const openAddressesByContactId = new Map<string, Partial<Record<ChannelType, string[]>>>(
      interactions.map((interaction) => {
        const byType: Partial<Record<ChannelType, string[]>> = {};
        for (const c of interaction.channels) {
          if (!c.value) continue;
          (byType[c.type] ??= []).push(c.value);
        }
        return [interaction.id, byType];
      })
    );
    return {
      ...OUTBOUND_CONFIG,
      groups: OUTBOUND_CONFIG.groups.map((group) => {
        if (!group.contacts) return group;
        return {
          ...group,
          contacts: group.contacts.map((contact) => {
            const openChannelAddresses = openAddressesByContactId.get(contact.id);
            if (!openChannelAddresses || Object.keys(openChannelAddresses).length === 0) return contact;
            return { ...contact, openChannelAddresses };
          }),
        };
      }),
    };
  }, [interactions]);

  // Every "Agent Next Gen" consumer (this app, AgentNextGenTemplate.
  // stories.tsx, LeftNav.stories.tsx's "Agent Next Gen Left Nav" story)
  // wants the exact same "+" behavior on each InteractionNavItem card —
  // look up that interaction's underlying outbound contact, scope the
  // flyout to whatever channels it actually supports (falling back to the
  // full unfiltered list for quick-dialed/redialed numbers with no matching
  // contact record), and deep-link a picked channel into CreateNew's
  // `launchRequest`. That's `useOutboundAddButton` (lyra-ui) — a single
  // shared implementation instead of three hand-copied ones that could
  // (and did) quietly drift out of sync.
  const { launchRequest: outboundLaunchRequest, onLaunchRequestHandled, getHeaderAction } = useOutboundAddButton(outboundConfig);

  /* Welcome modal — shown once on page load; "Go Available" flips the agent
     to Available, "Start Unavailable" keeps them Unavailable (the default
     state). lyra-ui's `AgentStatus` dropped "offline" (just
     Available/Unavailable now), so this no longer keeps the agent
     "Offline" — Unavailable is the closest equivalent starting state. */
  const handleGoAvailable = () => {
    handleStatusChange("available");
    setShowWelcomeModal(false);
  };
  const handleStartUnavailable = () => {
    handleStatusChange("unavailable");
    setShowWelcomeModal(false);
  };

  // Open/close animation state machine for the single shared panel — mounts
  // on open, transitions through the shared fade/slide animation on close,
  // then unmounts. Previously a generic `usePanelOpenEffect` factory called
  // once per panel (five times); with only one physical container now,
  // there's only one caller, so it's inlined rather than kept as a
  // factory-of-one.
  useEffect(() => {
    clearTimeout(panelAnimTimer.current);
    if (panelOpen) {
      if (containerRef.current && panelFloatLeft.current === null) {
        const r = containerRef.current.getBoundingClientRect();
        panelFloatLeft.current = r.left + containerRef.current.offsetWidth - panelWidth - 16;
      }
      setPanelHeight(computePanelHeight());
      setPanelMounted(true);
      setPanelState("open");
    } else {
      setPanelState("closing");
      panelAnimTimer.current = setTimeout(() => setPanelState("closed"), 150);
    }
    return () => clearTimeout(panelAnimTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelOpen]);

  // Shrink panel height with viewport when open
  useEffect(() => {
    if (!panelOpen) return;
    const onResize = () => setPanelHeight(computePanelHeight());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelOpen]);

  // When docking: capture actual rendered position (includes CSS transform
  // drag offset) before the float wrapper unmounts — restored when
  // undocking. The old "only one of five may be docked" exclusivity check
  // (`dockPanelExclusively`) is gone — with a single shared container
  // there's only ever one panel to dock in the first place.
  const handlePanelVariantChange = (v: DraggableVariant) => {
    if (v === "docked" && panelRef.current) {
      const r = panelRef.current.getBoundingClientRect();
      panelFloatLeft.current = r.left;
      panelFloatTop.current  = r.top;
    }
    setPanelVariant(v);
  };

  // Float position — absolute viewport coordinates, anchored via
  // `panelFloatLeft`/`panelFloatTop` once set. No more per-panel z-index
  // "bring to front" competition (`topPanel`) — there's only ever one
  // floating panel now, so it's always topmost.
  const getPanelFloatStyle = (): React.CSSProperties => {
    const rect = containerRef.current?.getBoundingClientRect();
    const left = panelFloatLeft.current !== null
      ? panelFloatLeft.current
      : containerRef.current
        ? (rect?.left ?? 0) + containerRef.current.offsetWidth - panelWidth - 16
        : 0;
    const top = panelFloatTop.current !== null
      ? panelFloatTop.current
      : (rect?.top ?? 0);
    return { position: "fixed", top, left, zIndex: 10000 };
  };

  // ── Content for each of the five buttons ──
  // Ask AI's and Notifications' real content — same `useAiPanelContent`/
  // `useAgentNotificationsContent` hooks `AiPanel`/`AgentNotifications`
  // call internally (ai-panel.tsx/agent-notifications.tsx in lyra-ui) — so
  // this app gets their actual bodies, not a reimplemented copy. Called
  // unconditionally every render (Rules of Hooks) regardless of whether
  // that content is the one currently showing.
  const aiContent = useAiPanelContent({
    userName: "John",
    suggestions: [
      { id: "1", label: "Summarise this contact's history" },
      { id: "2", label: "Suggest a response to the customer" },
      { id: "3", label: "What changed since yesterday?" },
    ],
  });
  const notifContent = useAgentNotificationsContent({
    notifications,
    onMarkAllRead: () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
    onClearAll: () => setNotifications([]),
    onDismiss: (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id)),
    onNotificationClick: (n: AgentNotification) =>
      setNotifications((prev) => prev.map((i) => i.id === n.id ? { ...i, read: true } : i)),
  });
  // Conversations/Schedule — no bespoke component (same blank empty-state
  // `DraggablePanel` itself defaults to when given no children).
  const blankPanelContent = (title: string): EmbeddablePanelContent => ({
    title,
    body: (
      <div className="overflow-y-auto flex-1 flex items-center justify-center p-4">
        <p className="lyra-body-md text-lyra-fg-disabled text-center">Nothing here yet.</p>
      </div>
    ),
  });
  // Screen Pop — same blank body, plus a Select (which external app to pop
  // the current contact/record into) in `headerContent` (fixed above the
  // divider, alongside the title row) rather than the scrollable body, so
  // it stays put — no `label` since the field sits in the header, not a
  // body form, where a label would be redundant.
  const screenPopContent: EmbeddablePanelContent = {
    title: "Screen Pop",
    headerContent: (
      <Select
        placeholder="Select an app..."
        options={SCREEN_POP_APPS}
        value={screenPopApp}
        onValueChange={setScreenPopApp}
      />
    ),
    body: (
      <div className="overflow-y-auto flex-1 flex items-center justify-center p-4">
        <p className="lyra-body-md text-lyra-fg-disabled text-center">Nothing here yet.</p>
      </div>
    ),
  };
  const contentByPanelKey: Record<PanelKey, EmbeddablePanelContent> = {
    ai: aiContent,
    notif: notifContent,
    conversations: blankPanelContent("Conversations"),
    schedule: blankPanelContent("Schedule"),
    screenpop: screenPopContent,
  };
  const activePanelContent = activePanelKey ? contentByPanelKey[activePanelKey] : null;

  // Clicking a button: re-clicking the CURRENTLY showing one closes the
  // shared container outright. Otherwise, if it's closed, open it docked
  // (see `panelVariant`'s own doc comment above); if it's already open
  // showing a DIFFERENT key, only `activePanelKey` changes — the container
  // itself never resizes, repositions, or re-animates open+close, only its
  // title/body content does.
  const handlePanelButtonClick = (key: PanelKey) => () => {
    if (panelOpen && activePanelKey === key) {
      setPanelOpen(false);
      return;
    }
    if (!panelOpen) {
      setPanelVariant("docked");
      setPanelOpen(true);
    }
    setActivePanelKey(key);
  };

  // The one shared `Draggable` — its header (icon/actions/title) and body
  // swap to whichever button's content is active; the container itself
  // (variant/width/position) never does.
  const sharedPanel = panelMounted && activePanelContent ? (
    <Draggable
      ref={panelRef}
      variant={panelVariant}
      defaultWidth={panelWidth}
      defaultHeight={panelHeight}
      minWidth={280}
      minHeight={400}
      onVariantChange={handlePanelVariantChange}
      onWidthChange={setPanelWidth}
      onResizeStateChange={setPanelIsResizing}
      className={cn(
        "rounded-lyra-lg border border-lyra-border-subtle bg-lyra-bg-surface-base",
        panelVariant === "float" ? "shadow-lg" : "h-full"
      )}
      renderHeaderControls={({ gripProps, dockButtonProps, dockIcon, variant: dVariant }) => (
        <>
          <ContainerHeader
            title={activePanelContent.title}
            titleBadge={activePanelContent.titleBadge}
            titleClassName={activePanelContent.titleClassName}
            icon={
              dVariant === "float"
                ? <div {...gripProps}><GripVertical className="h-4 w-4" strokeWidth={1.5} /></div>
                : activePanelContent.dockedIcon
            }
            bordered={!activePanelContent.headerContent}
            actions={
              <>
                {activePanelContent.headerActions}
                <Tooltip content={dockButtonProps["aria-label"]} placement="bottom" asLabel>
                  <button
                    {...dockButtonProps}
                    className="flex h-8 w-8 items-center justify-center rounded-lyra-sm text-lyra-fg-secondary hover:bg-lyra-state-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lyra-border-focus"
                  >
                    {dockIcon}
                  </button>
                </Tooltip>
              </>
            }
            onClose={() => setPanelOpen(false)}
          />
          {activePanelContent.headerContent && (
            <div className="shrink-0 px-4 pb-3 border-b border-lyra-border-subtle">
              {activePanelContent.headerContent}
            </div>
          )}
        </>
      )}
    >
      {activePanelContent.body}
    </Draggable>
  ) : null;

  return (
    <div className="flex flex-col h-screen bg-lyra-bg-surface-shell overflow-hidden animate-in fade-in-0 duration-500">

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
            {/* Screen Pop / Conversations / Schedule / Notifications / Ask AI
                — all five now go through lyra-ui's `ActionIconButton`
                (`size="xl"`, 44px), the single canonical AppHeader
                icon-button shape. These used to be hand-rolled
                `<button>`s (`h-10 w-10 rounded-lyra-lg`) matching
                `NotificationsBell`'s own trigger, which at the time was
                also hand-rolled rather than built on `ActionIconButton` —
                lyra-ui has since consolidated `NotificationsBell` and
                `ActionIconButton` onto one shared implementation (composing
                `Button` internally), with 44px/`rounded-lyra-sm` as the
                confirmed canonical AppHeader size, so this row now matches
                `Header.tsx`'s (and lyra-ui's own `AppHeader.stories.tsx`)
                icon buttons instead of diverging from them. Labeled
                "Conversations" (renamed from "Messages" — same
                trigger/panel, just the label). Screen Pop sits to the left
                of Conversations, using lucide's `MonitorUp` (monitor + up
                arrow) to match the requested icon exactly. */}
            <ActionIconButton
              size="xl"
              title="Screen Pop"
              aria-expanded={panelOpen && activePanelKey === "screenpop"}
              onClick={handlePanelButtonClick("screenpop")}
              className={panelOpen && activePanelKey === "screenpop" ? "bg-lyra-state-hover" : undefined}
            >
              <MonitorUp className="h-5 w-5" strokeWidth={1.5} />
            </ActionIconButton>
            <ActionIconButton
              size="xl"
              title="Conversations"
              aria-expanded={panelOpen && activePanelKey === "conversations"}
              onClick={handlePanelButtonClick("conversations")}
              className={panelOpen && activePanelKey === "conversations" ? "bg-lyra-state-hover" : undefined}
            >
              <MessageSquare className="h-5 w-5" strokeWidth={1.5} />
            </ActionIconButton>
            <ActionIconButton
              size="xl"
              title="Schedule"
              aria-expanded={panelOpen && activePanelKey === "schedule"}
              onClick={handlePanelButtonClick("schedule")}
              className={panelOpen && activePanelKey === "schedule" ? "bg-lyra-state-hover" : undefined}
            >
              <CalendarDays className="h-5 w-5" strokeWidth={1.5} />
            </ActionIconButton>
            <NotificationsBell
              notifications={notifications}
              open={panelOpen && activePanelKey === "notif"}
              onOpenChange={() => handlePanelButtonClick("notif")()}
              renderPanel={false}
            />
            {/* Sole "Ask AI" entry point — the PageHeader labeled button
                (Desk dashboard and the record-page header) was removed so
                this AppHeader icon is the only trigger for the shared
                panel's Ask AI content now. Renders lyra-ui's exported
                `AiSparkleIcon` — the same solid-color sparkle mark
                `AgentNextGenTemplate.stories.tsx` and `lyra-ux-templates`'
                `AgentNextGenPage.tsx` both use here — via `ActionIconButton`
                (44px, matching every other icon button in this row now). */}
            <ActionIconButton
              size="xl"
              title="Ask AI"
              aria-expanded={panelOpen && activePanelKey === "ai"}
              onClick={handlePanelButtonClick("ai")}
              className={panelOpen && activePanelKey === "ai" ? "bg-lyra-state-hover" : undefined}
            >
              <AiSparkleIcon />
            </ActionIconButton>
            {/* Separator between the icon-button row (Screen Pop through Ask
                AI) and AgentProfile — `orientation="vertical"` + `h-auto
                self-stretch` is the same sizing lyra-ui's own vertical
                Separator usage uses (see `dashboard-card.tsx`'s metric-row
                divider) so it stretches to match the row's height inside
                AppHeader's `flex items-center` actions container instead of
                a hand-picked fixed height. */}
            <Separator orientation="vertical" className="h-auto self-stretch" />
            <AgentProfile
              name="John Smith"
              initials="JS"
              status={agentStatus}
              onStatusChange={handleStatusChange}
              onDarkModeToggle={handleDarkModeToggle}
              isDarkMode={darkMode}
              timer={formattedTimer}
              // Standalone AppHeader "?" icon removed — this app now uses
              // `AgentProfile`'s own conditional "Help" row instead (renders
              // below "Agent Leg Disconnected" whenever `onHelpClick` is
              // passed; see agent-profile.tsx). Same destination/new-tab
              // behavior as the removed icon button.
              onHelpClick={() => window.open("https://help.nicecxone.com/content/agent/cxoneagent/cxoneagent.htm?cshid=CXoneAgent", "_blank", "noopener,noreferrer")}
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
          items={buildNavItems(
            Boolean(activeInteraction),
            () => { setActiveInteractionId(null); setShowSettings(false); },
            showSettings,
            () => { setShowSettings(true); setActiveInteractionId(null); }
          )}
          open={navOpen}
          onToggle={() => setNavOpen((v) => !v)}
          overlay={isNavNarrow}
          pinnedHeader={
            <CreateNew
              title="New Outbound"
              outbound={{
                ...outboundConfig,
                onStartCall: handleStartCall,
                onQuickDial: handleQuickDial,
                launchRequest: outboundLaunchRequest,
                onLaunchRequestHandled,
              }}
              expanded={navOpen}
            />
          }
          header={
            <>
              {/* No cards until the agent actually starts one above — each
                  card is one contact (or quick-dialed number), with every
                  channel they're being reached on folded into that same
                  card unless it's a different address on an already-open
                  type, which opens as its own row instead (see
                  handleStartCall's merge-by-type+address logic). */}
              {interactions.map((interaction) => {
                const mostRecentId = interaction.channels[interaction.channels.length - 1]?.id;
                const currentId = interaction.currentChannelId ?? mostRecentId;
                const channels: InteractionChannel[] = interaction.channels.map((c) => ({
                  id: c.id,
                  type: c.type,
                  elapsed: formatElapsedTime(clockTick - c.startTick),
                  preview: c.preview,
                  current: c.id === currentId,
                  // Read straight off the tracked channel (see
                  // TrackedChannel.awaitingResponse's own doc comment) —
                  // not derived from `type` — so a freshly-started outbound
                  // channel never renders red just for being SMS/chat/
                  // email/WhatsApp instead of voice.
                  awaitingResponse: c.awaitingResponse ?? false,
                }));
                const earliestStart = Math.min(...interaction.channels.map((c) => c.startTick));
                return (
                  <InteractionNavItem
                    key={interaction.id}
                    customerName={interaction.customerName}
                    active={activeInteractionId === interaction.id}
                    onClick={() => setActiveInteractionId(interaction.id)}
                    awaitingResponse={channels.some((c) => c.awaitingResponse)}
                    elapsed={formatElapsedTime(clockTick - earliestStart)}
                    expanded={navOpen}
                    channels={channels}
                    onDismiss={() => handleDismissInteraction(interaction.id)}
                    onDismissChannel={(channel) => handleDismissChannel(interaction.id, channel)}
                    headerAction={getHeaderAction(interaction.id)}
                    // Kept in sync with the ChannelToggle bar in this
                    // interaction's record-header PageHeader — see
                    // ActiveInteraction.currentChannelId's own doc comment.
                    currentChannelKey={currentId}
                    onCurrentChannelChange={(key) => handleChannelSelect(interaction.id, key)}
                  />
                );
              })}
            </>
          }
        />

        {/* Content area — flex-1 shrinks to give space to docked panels.
            ref used to position float panels. */}
        <div ref={containerRef} className="relative flex flex-1 min-w-0 overflow-hidden pr-3 pb-3">

          {/* Main Container — flex row; PageHeader + content is the sole
              flex child now that the Customer Information panel moved to
              an `InteriorPanel` docked right *inside* the interaction body
              below, instead of a `SidePanel` docked left out here. */}
          <Container className="flex flex-1 overflow-hidden relative">

            {/* Content column: PageHeader + page body */}
            <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
              {showSettings ? (
                // ── Settings — a blank page for now (real settings content
                // isn't built yet), same "just the header, blank body below"
                // placeholder pattern the interaction record view below
                // uses. Takes priority over both Desk and an active
                // interaction — see the `showSettings` state's own doc
                // comment for how the three views stay mutually exclusive.
                <>
                  {showPageHeader && <PageHeader title="Settings" />}
                  <div className="flex-1 overflow-y-auto" />
                </>
              ) : activeInteraction ? (
                // ── Active interaction's detail page — replaces the Desk
                // dashboard the moment a new assignment is started/quick-
                // dialed/redialed (see `activeInteraction` above). Just the
                // record header for now; the blank body below is where a
                // real case/contact detail view will go. Reverts back to
                // the dashboard automatically once the interaction is
                // dismissed (`activeInteractionId` clears).
                <>
                  {showPageHeader && (
                    <PageHeader
                      title={activeInteraction.customerName ?? "Customer"}
                      subtitle={activeInteraction.recordId}
                      // One toggle per open channel, to the right of the
                      // customer name — back to `ChannelToggle`/
                      // `ChannelToggleGroup` (`ToggleGroup`-style segmented
                      // pill) per explicit request, reverting the brief
                      // `ChannelTab`/`TabList` detour: `Tab`'s 48px-tall
                      // row/bottom-border design never sat right embedded in
                      // a single-line header row (screenshots showed it
                      // rendering as a squished/disjointed fragment even
                      // after widening its available space via
                      // `titleSuffixGrow` and dropping its border) —
                      // `ChannelToggle` was already purpose-built to sit
                      // compactly inline here, which is why it's the one
                      // going back in, not a third alternative. `titleSuffix`
                      // stays at its default `shrink-0` (snug against the
                      // name) — no `titleSuffixGrow` needed for a compact
                      // pill cluster, only for `Tab`'s own row-based sizing.
                      // Same per-channel behavior as always (kebab menu,
                      // address + message-count/id tooltip, kept in sync
                      // with the matching `InteractionNavItem` card via
                      // currentChannelId/handleChannelSelect — see that
                      // field's own doc comment). Shown even with just one
                      // channel open — the toggle still surfaces that
                      // channel's kebab actions (Unassign & Dismiss/Consult/
                      // Transfer/etc.), not just a way to switch between
                      // multiple. A plain vertical divider (matching
                      // `panelToggle`'s own left-side divider elsewhere in
                      // this component) separates the title from the toggle
                      // cluster so the two don't visually run together.
                      //
                      // The trailing "+" after the toggle group is the exact
                      // same Add Channel control every `InteractionNavItem`
                      // card already has (`headerAction={getHeaderAction(
                      // interaction.id)}` a few hundred lines up) — reusing
                      // `getHeaderAction` here (not a second hand-built
                      // button) means it's the identical dropdown: the same
                      // `OutboundAddButton`, scoped to this same contact's
                      // own supported channels, feeding the same
                      // `launchRequest` state into the LeftNav's "New
                      // Outbound" `CreateNew` instance a picked channel
                      // already deep-links through — see
                      // `useOutboundAddButton`'s own doc comment in
                      // create-new.tsx. No new plumbing needed; this is
                      // just a second place the hook's existing result gets
                      // rendered.
                      titleSuffix={
                        activeInteraction.channels.length > 0 && (
                          <div className="flex items-center gap-3">
                            <div className="h-6 w-px bg-lyra-border-subtle" aria-hidden="true" />
                            <ChannelToggleGroup>
                              {activeInteraction.channels.map((c) => {
                                const key = c.id ?? c.type;
                                return (
                                  <ChannelToggle
                                    key={key}
                                    type={c.type}
                                    address={c.addressLabel}
                                    messageCount={c.messageCount}
                                    interactionId={c.interactionId}
                                    active={(activeInteraction.currentChannelId ?? activeInteraction.channels[activeInteraction.channels.length - 1]?.id) === key}
                                    onClick={() => handleChannelSelect(activeInteraction.id, key)}
                                    onDismiss={() => {
                                      if (activeInteraction.channels.length > 1) handleDismissChannel(activeInteraction.id, c);
                                      else handleDismissInteraction(activeInteraction.id);
                                    }}
                                  />
                                );
                              })}
                            </ChannelToggleGroup>
                            {getHeaderAction(activeInteraction.id)}
                          </div>
                        )
                      }
                      // Toggle for the Customer Information `InteriorPanel`
                      // below — lyra-ui's own documented pattern for an
                      // InteriorPanel's open/close trigger (see
                      // InteriorPanel.stories.tsx): a plain `Button` sitting
                      // in the page header's `actions` slot (which renders
                      // on the header's right side), not a dedicated toggle
                      // component — InteriorPanel has no pin/hover concept
                      // of its own to compose a fancier trigger around, the
                      // way the old `SidePanel`-based version's
                      // `PanelPinButton` did.
                      // `aria-pressed` (not `aria-expanded`) — this reads as
                      // a genuine toggle button with a persistent on/off
                      // state, not a disclosure revealing adjacent content.
                      // The pressed look reuses the same "active" treatment
                      // CONTRIBUTING.md documents for `Menu`'s current-item
                      // row (bg-lyra-bg-active-subtle, escalating on hover/
                      // press) rather than inventing a one-off toggled color.
                      // Icon-only now (`size="icon-md"`, one of `Button`'s
                      // `ICON_SIZES` — see button.tsx) — that alone flips
                      // `isIconVariant` on even though `variant="outline"`,
                      // which is what makes `Button` auto-wrap it in a
                      // `Tooltip` off the `title` prop and swap in
                      // `aria-label` instead of visible text, no separate
                      // `Tooltip` needed here.
                      actions={
                        showPanelToggle && (
                          <Button
                            variant="outline"
                            size="icon-md"
                            title={sidePanelToggleLabel ?? "Toggle Customer Information"}
                            aria-pressed={customerPanelOpen}
                            onClick={handleCustomerPanelToggle}
                            className={
                              customerPanelOpen
                                ? "border-lyra-border-active bg-lyra-bg-active-subtle text-lyra-fg-active-strong hover:bg-lyra-state-hover-active-subtle active:bg-lyra-state-pressed-active-subtle"
                                : undefined
                            }
                          >
                            <User className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                          </Button>
                        )
                      }
                    />
                  )}
                  {/* Body row: transcript+composer column + Customer
                      Information interior panel — same "main content +
                      docked interior panel" flex-row shape as the Desk
                      dashboard's own right-docked InteriorPanel below. */}
                  <div className="relative flex flex-1 overflow-hidden">
                    <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
                      <InteractionTranscript />
                      <InteractionComposer />
                    </div>
                    {showPanelToggle && (
                      <CustomerInformationInteriorPanel
                        open={customerPanelOpen}
                        onClose={() => setCustomerPanelOpen(false)}
                        customerName={activeInteraction.customerName}
                        recordId={activeInteraction.recordId}
                        channels={activeInteraction.channels}
                        width={customerPanelWidth}
                        onWidthChange={setCustomerPanelWidth}
                      />
                    )}
                  </div>
                </>
              ) : (
                <>
                  {showPageHeader && (
                    <TabList overflowMenu className="px-6 bg-lyra-bg-surface-base shrink-0">
                      <Tab active={activeDeskTab === "home"} onClick={() => setActiveDeskTab("home")}>
                        Dashboard
                      </Tab>
                      <Tab active={activeDeskTab === "customers"} onClick={() => setActiveDeskTab("customers")}>
                        Customers
                      </Tab>
                      <Tab active={activeDeskTab === "accounts"} onClick={() => setActiveDeskTab("accounts")}>
                        Accounts
                      </Tab>
                      <Tab active={activeDeskTab === "tickets"} onClick={() => setActiveDeskTab("tickets")}>
                        Tickets
                      </Tab>
                      <Tab active={activeDeskTab === "interactions"} onClick={() => setActiveDeskTab("interactions")}>
                        Interactions
                      </Tab>
                      <Tab active={activeDeskTab === "wem"} onClick={() => setActiveDeskTab("wem")}>
                        WEM
                      </Tab>
                    </TabList>
                  )}
              {/* Body row: main content + interior panel */}
              <div className="relative flex flex-1 overflow-hidden">
                <div className="flex flex-1 flex-col min-w-0 overflow-y-auto px-6 py-6">
                  <div className="w-full max-w-[1200px] mx-auto lyra-container-grid-wrap">
                    {/* ── Greeting header toolbar ──
                        Title/subtitle on the left, action buttons pinned to
                        the right — same "title block + trailing actions row"
                        shape as `DashboardCard`/`ContainerHeader`'s own
                        `headerActions` slot elsewhere in this file, just
                        hand-built here rather than composed from those
                        (they're card headers, not a full-bleed page-level
                        toolbar; `PageHeader` renders its title at
                        `lyra-heading-lg`, a step down from this greeting's
                        intentionally larger `lyra-heading-2xl`, so reusing
                        it would shrink the greeting rather than just
                        toolbar-ing the actions).

                        `flex-wrap` — unlike `ContainerHeader`'s own
                        title/actions row (which needs an opt-in container
                        query, see that component's `actionsWrap` doc
                        comment), a plain CSS wrap works here with no extra
                        plumbing: this `h1`/`p` pair has no `truncate`/
                        `whitespace-nowrap` constraining it, so its real
                        (un-shrunk) content width is a genuine signal the
                        browser can wrap against, instead of the artificially
                        tiny "true" width truncated text reports. Without
                        this, the toolbar was squeezing "Good morning, John"
                        down word-by-word to make room for a pinned-right
                        button that never moved, confirmed from a screenshot —
                        `justify-between` naturally left-aligns the button
                        once it's alone on its own wrapped line, no extra
                        alignment override needed. */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h1 className="lyra-heading-2xl text-lyra-fg-default">
                          Good {getGreetingPeriod()}, {CURRENT_AGENT_FIRST_NAME}
                        </h1>
                        <p className="mt-1 lyra-body-md text-lyra-fg-secondary">Below is your team's queue for the day:</p>
                      </div>
                      {/* Actions toolbar — `inline-flex` (not a bare
                          fragment) so it shrinks to its own content width
                          instead of stretching, same reasoning as
                          `ContainerHeader`'s own `actions` wrapper. This
                          matters more than usual here: `CreateNew`'s root is
                          unconditionally `<span className="flex w-full
                          justify-center">` (see create-new.tsx's `trigger`
                          doc comment — built so its *expanded* button fills
                          a full-width LeftNav rail/footer). Nested directly
                          inside a `justify-between` row, that inner `w-full`
                          still resolves against (and stretches to fill)
                          whatever space `justify-between` leaves it, and
                          `justify-center` then centers the actual button
                          inside that oversized box — the button visibly
                          floated mid-row instead of hugging the true right
                          edge (confirmed via devtools: the flex item's own
                          box was hundreds of pixels wider than the button
                          it contained). Giving this wrapper `inline-flex`
                          makes it shrink-to-fit around `CreateNew`, so its
                          child span's `w-full` resolves against *that*
                          already-content-sized box instead — a plain,
                          standard "shrink-to-fit parent around a 100%-width
                          child" containment, no lyra-ui change needed. Also
                          the natural place to add more toolbar buttons
                          later (`gap-2` already spaces them). */}
                      <div className="inline-flex items-center gap-2 shrink-0">
                        {/* A second, independent `CreateNew` trigger — same
                            `outboundConfig`/`handleStartCall`/`handleQuickDial`
                            as the LeftNav's own "New Outbound" button (see
                            `pinnedHeader` below), so picking a contact+channel
                            here starts an interaction exactly the same way.
                            Deliberately omits `launchRequest`/
                            `onLaunchRequestHandled`: those wire the *other*
                            instance to every card's own "+" (Add Channel)
                            deep-link (`useOutboundAddButton`) — sharing that
                            same state here would make both instances react
                            (and try to open) to a single card's "+" click.
                            `expanded` (not the LeftNav's `navOpen`-driven
                            value) keeps this one always showing its
                            icon+label — it isn't inside a collapsible rail,
                            so there's no "compact" state for it to collapse
                            into. Already renders as a solid primary button
                            (`CreateNew`'s own trigger styling — see its
                            `trigger` doc comment in create-new.tsx), not a
                            one-off className here. */}
                        <CreateNew
                          title="New Outbound"
                          outbound={{
                            ...outboundConfig,
                            onStartCall: handleStartCall,
                            onQuickDial: handleQuickDial,
                          }}
                          expanded
                        />
                      </div>
                    </div>

                    {/* ── Queue widgets ──
                        `DashboardQueue` ("cards" variant, its default) —
                        the numbers come straight from `latestContacts`
                        (see the "Live queue simulation" state above), so
                        they'd stay in sync with the accordion presentation
                        of the same data if that's ever turned back on (see
                        the note below) — and Contacts/Wait Time visibly
                        tick/fluctuate in real time rather than sitting
                        frozen at the same numbers forever. Clicking a
                        widget opens the interior panel with that queue's
                        sub-queue breakdown; the selected widget gets the
                        "info-strong" (blue) treatment `DashboardQueue`
                        applies on selection, driven by the controlled
                        `selectedId`/`onSelect` pair kept in sync with the
                        panel state. */}
                    <DashboardQueue
                      className="mt-6"
                      items={latestContacts.map((contact) => ({
                        id: contact.id,
                        name: contact.name,
                        icon: contact.icon,
                        wait: contact.wait,
                        skillsCount: contact.skillsCount,
                        contactsCount: contact.contactsCount,
                        agentsCount: contact.agentsCount,
                      }))}
                      selectedId={selectedQueueId}
                      onSelect={setSelectedQueueId}
                    />

                    {/* ── Latest Cases ──
                        Removed for now (was `DashboardQueue`'s "accordion"
                        variant, showing the same data as expandable rows
                        with each queue's `InteractionsTable` as content) —
                        may come back later, so `latestContacts`,
                        `InteractionsTable`, and the rest of the data/markup
                        it depended on are left in place rather than deleted. */}

                    <div className="mt-6">
                      <ContactHistoryCard onRedial={handleRedial} />
                    </div>

                    {/* ── Summary cards ──
                        Was three cards (Activity/Performance/Productivity);
                        Activity's ring chart moved into the bottom of
                        PerformanceBreakdownCard (Productivity) and the
                        standalone Activity card was removed, since the ring
                        visualized the exact same Available/Working/
                        Unavailable data Productivity's own rows already
                        list — one card showing it twice added nothing a
                        single card + ring didn't already cover. */}
                    <div className="mt-6 lyra-container-grid">
                      <PerformanceSummaryCard />
                      <PerformanceBreakdownCard />
                    </div>
                  </div>
                </div>
                {showInteriorPanel && (
                  <InteriorPanel
                    side="right"
                    // Reuses this one docked slot for two different jobs —
                    // the pre-existing "Case Details" form and the new
                    // queue drill-down — rather than stacking a second
                    // right-side panel, since only one detail view is ever
                    // relevant at a time. `selectedQueueId` set takes
                    // priority in both the open condition and the content
                    // switch below.
                    open={interiorPanelOpen || Boolean(selectedQueueId)}
                    headerTitle={
                      selectedQueueId
                        ? latestContacts.find((c) => c.id === selectedQueueId)?.name ?? "Queue"
                        : "Case Details"
                    }
                    // "{n} Skills" — the same count as the queue widget's own
                    // Skills metric (`skillsCount`, derived from this exact
                    // `queueSubItems[selectedQueueId]` list), just surfaced
                    // in the drill-down panel's own header this time.
                    headerSubhead={
                      selectedQueueId
                        ? `${(queueSubItems[selectedQueueId] ?? []).length} Skills`
                        : undefined
                    }
                    onClose={() => {
                      setInteriorPanelOpen(false);
                      setSelectedQueueId(null);
                    }}
                  >
                    {selectedQueueId ? (
                      <div className="flex flex-col">
                        {(queueSubItems[selectedQueueId] ?? []).map((item, i) => (
                          <div
                            key={item.id}
                            className={cn(
                              "flex flex-col gap-2 px-4 py-4",
                              i > 0 && "border-t border-lyra-border-subtle"
                            )}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="inline-flex items-center gap-2 lyra-body-md-emphasis text-lyra-fg-default">
                                <item.icon className="h-4 w-4 text-lyra-fg-secondary" strokeWidth={1.5} />
                                {item.label}
                              </span>
                              <span className="lyra-body-sm text-lyra-fg-secondary whitespace-nowrap">
                                {item.inQueueCount} In Queue
                              </span>
                            </div>
                            <span className="inline-flex items-center gap-1 lyra-body-sm text-lyra-fg-secondary">
                              <Clock className="h-3 w-3" strokeWidth={1.5} />
                              Longest Wait Time: {item.wait}
                            </span>
                            {/* Available / Working / Unavailable agent counts for
                                this sub-queue — same icons, colors, and order as
                                PRODUCTIVITY_STATUS_META (Activity/Productivity
                                cards), just rendered as compact circular Icon
                                badges instead of a donut/bar. Each badge gets a
                                hover tooltip spelling out what the count means,
                                since the color/icon alone doesn't say "agents". */}
                            <div className="flex items-center gap-3">
                              <Tooltip content="Available Agents" placement="top">
                                <span className="inline-flex items-center gap-1.5">
                                  <Icon icon={CheckCircle2} size="sm" background="success" shape="circle" decorative />
                                  <span className="lyra-body-sm-emphasis text-lyra-fg-default">{item.available}</span>
                                </span>
                              </Tooltip>
                              <Tooltip content="Working Agents" placement="top">
                                <span className="inline-flex items-center gap-1.5">
                                  <Icon icon={CircleDot} size="sm" background="warning" shape="circle" decorative />
                                  <span className="lyra-body-sm-emphasis text-lyra-fg-default">{item.working}</span>
                                </span>
                              </Tooltip>
                              <Tooltip content="Unavailable Agents" placement="top">
                                <span className="inline-flex items-center gap-1.5">
                                  <Icon icon={MinusCircle} size="sm" background="critical" shape="circle" decorative />
                                  <span className="lyra-body-sm-emphasis text-lyra-fg-default">{item.unavailable}</span>
                                </span>
                              </Tooltip>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 px-4 py-4">
                        <Input label="Subject" placeholder="Enter subject" />
                        <Input label="Priority" placeholder="Select priority" />
                        <Input label="Assignee" placeholder="Search agents" />
                        <Input label="Tags" placeholder="Add tags" />
                      </div>
                    )}
                  </InteriorPanel>
                )}
              </div>
                </>
              )}
            </div>

          </Container>

          {/* Shared single-container panel — float (CSS transitions, not
              keyframe animations — avoids compositor fill-mode flash).
              Was five near-identical blocks (one per panel); with only one
              physical container now, there's only one. */}
          {panelVariant === "float" && panelMounted && (
            <div
              style={{
                ...getPanelFloatStyle(),
                pointerEvents: "none",
                visibility: panelState === "closed" ? "hidden" : "visible",
                opacity: panelState === "open" ? 1 : 0,
                transform: panelState === "open" ? "translateY(0)" : "translateY(-8px)",
                transition: panelState === "open"
                  ? "opacity 150ms ease, transform 150ms ease"
                  : "opacity 100ms ease, transform 100ms ease",
              }}
            >
              {sharedPanel}
            </div>
          )}

        </div>

        {/* Shared single-container panel — docked (sibling of containerRef
            so flex layout keeps it in-bounds). Was five near-identical
            blocks (one per panel); with only one physical container now,
            there's only one. */}
        {panelVariant === "docked" && (
          <div className="pb-3" style={{
            width: panelState === "open" ? panelWidth : 0,
            marginRight: panelState === "open" ? 12 : 0,
            overflow: "hidden",
            flexShrink: 0,
            transition: panelIsResizing ? "none" : "width 250ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}>
            <div
              className="h-full animate-in fade-in-0 duration-150"
              style={{
                width: panelWidth,
                display: panelState === "open" ? "block" : "none",
              }}
            >
              {sharedPanel}
            </div>
          </div>
        )}

      </div>

      {/* ── Welcome modal — shown once on page load. Uses the real lyra-ui
          `Modal` component (variant="light": frosted blur backdrop,
          portal-rendered via Radix Dialog, focus-trapped) rather than a
          hand-rolled backdrop div, so it actually dims/blurs the dashboard
          behind it like a real overlay instead of just painting over it.
          Not dismissible via backdrop click or Escape — only the two
          buttons close it. Previously composed by hand as `Overlay` +
          `AgentWelcomeMessage` (which itself rendered its own
          `Container variant="modal"` shell) — `Modal` now owns that
          Radix Dialog wiring directly, so `AgentWelcomeMessage` is passed
          `bare` to skip its own card chrome and avoid nesting two.

          `Modal`'s "light" variant is a fixed `bg-white/70` by design (see
          Overlay.stories.tsx — "light" vs. "dark" are two deliberately
          static, theme-independent overlay looks, not meant to react to
          dark mode). This page's backdrop needs to actually match the
          current theme, so we override just the background color via
          `overlayClassName` (twMerge drops the variant's `bg-white/70` for
          this `bg-[color-mix(...)]`, keeping `backdrop-blur-sm`). We use
          color-mix() instead of a plain `bg-lyra-bg-surface-shell/70`
          opacity modifier because Tailwind can't generate opacity-modified
          utilities for our `var(--lyra-color-*)` tokens (same root cause as
          the Tag border-color bug — see lyra-ui's PROJECT_SUMMARY.md).

          The card itself is still the shared `AgentWelcomeMessage` lyra-ui
          component (icon/title/lastLogin block + info-box slot + Separator +
          two-button footer) — `ariaTitle` gives screen readers the real
          dialog name since that title now renders inside `AgentWelcomeMessage`
          itself rather than through `Modal`'s own `headerTitle`. ── */}
      <Modal
        variant="light"
        overlayClassName="bg-[color-mix(in_srgb,var(--lyra-color-bg-surface-shell)_75%,transparent)]"
        open={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        closeOnBackdropClick={false}
        ariaTitle={`Good morning, ${CURRENT_AGENT_FIRST_NAME} ${CURRENT_AGENT_LAST_NAME}`}
      >
        <AgentWelcomeMessage
          bare
          icon={<img src={appIcon} alt="" className="h-8 w-8 shrink-0" />}
          title={`Good morning, ${CURRENT_AGENT_FIRST_NAME} ${CURRENT_AGENT_LAST_NAME}`}
          lastLogin={WELCOME_MODAL_LAST_LOGIN}
          onPrimaryClick={handleGoAvailable}
          onSecondaryClick={handleStartUnavailable}
        >
          <p className="lyra-body-md text-lyra-fg-default">
            You are currently assigned to {AGENT_SKILLS_COUNT} skills. {TEAMMATES_ONLINE_COUNT} teammates are
            online, {TEAMMATES_AVAILABLE_COUNT} are available. Select an option below to begin.
          </p>
        </AgentWelcomeMessage>
      </Modal>
    </div>
  );
}
