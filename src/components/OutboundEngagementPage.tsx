import { useState, useCallback, useRef, useEffect } from "react";
import { Plus } from "lucide-react";

import {
  Button,
  AiIcon,
  PageHeader,
  Panel,
  TreeMenu,
  type TreeMenuItem,
} from "@nicecxone/lyra-ui";

/* ── Navigation items ── */
const panelItems: TreeMenuItem[] = [
  { label: "Campaigns", active: true },
  { label: "Contact Lists" },
  { label: "Do Not Call" },
  { label: "Call Results" },
  { label: "Scripts" },
  { label: "Schedules" },
  { label: "Reports" },
  { label: "Settings" },
];

/* ── Cookie helpers ── */
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;
}
function readBoolCookie(name: string, fallback: boolean): boolean {
  const val = getCookie(name);
  if (val === "true") return true;
  if (val === "false") return false;
  return fallback;
}

export function OutboundEngagementPage({
  showChip = false,
  onAiPanelToggle,
}: {
  showChip?: boolean;
  onAiPanelToggle?: () => void;
}) {

  /* ── Left side panel ── */
  const [leftPanelPinned, setLeftPanelPinned] = useState(() => readBoolCookie("lyra_outbound_panel_pinned", true));
  const [leftPanelOpen, setLeftPanelOpen] = useState(() => readBoolCookie("lyra_outbound_panel_pinned", true));
  const leftHoverTimeout = useRef<ReturnType<typeof setTimeout>>();

  const handleLeftToggle = useCallback(() => {
    if (leftPanelPinned) setLeftPanelOpen((v) => !v);
  }, [leftPanelPinned]);

  const handleLeftHoverStart = useCallback(() => {
    if (!leftPanelPinned) { clearTimeout(leftHoverTimeout.current); setLeftPanelOpen(true); }
  }, [leftPanelPinned]);

  const handleLeftHoverEnd = useCallback(() => {
    if (!leftPanelPinned) { leftHoverTimeout.current = setTimeout(() => setLeftPanelOpen(false), 300); }
  }, [leftPanelPinned]);

  const handleLeftPinToggle = useCallback(() => {
    setLeftPanelPinned((prev) => {
      const next = !prev;
      setCookie("lyra_outbound_panel_pinned", String(next));
      setLeftPanelOpen(next);
      return next;
    });
  }, []);

  /* ── Right side panel ── */
  const [rightSidePanelOpen, setRightSidePanelOpen] = useState(false);
  const [rightSidePanelPinned, setRightSidePanelPinned] = useState(false);
  const rightHoverTimeout = useRef<ReturnType<typeof setTimeout>>();

  /* ── Viewport pin guard ── */
  const [canPin, setCanPin] = useState(() => window.innerWidth >= 1024);
  useEffect(() => {
    const check = () => {
      const wide = window.innerWidth >= 1024;
      setCanPin(wide);
      if (!wide) {
        setLeftPanelPinned(false);
        setRightSidePanelPinned(false);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleRightHoverStart = useCallback(() => {
    if (!rightSidePanelPinned) { clearTimeout(rightHoverTimeout.current); setRightSidePanelOpen(true); }
  }, [rightSidePanelPinned]);

  const handleRightHoverEnd = useCallback(() => {
    if (!rightSidePanelPinned) { rightHoverTimeout.current = setTimeout(() => setRightSidePanelOpen(false), 300); }
  }, [rightSidePanelPinned]);

  const handleRightPinToggle = useCallback(() => {
    if (!canPin) return;
    setRightSidePanelPinned((prev) => { const next = !prev; setRightSidePanelOpen(next); return next; });
  }, [canPin]);

  /* ── Interior panel ── */
  const [interiorPanelOpen, setInteriorPanelOpen] = useState(false);

  return (
    <main className="flex flex-1 overflow-hidden bg-lyra-bg-surface-base relative">

      {/* ════ Left side panel ════ */}
      <Panel
        variant="side"
        side="left"
        open={leftPanelOpen}
        pinned={leftPanelPinned}
        headerTitle="Outbound"
        onPinToggle={canPin ? handleLeftPinToggle : undefined}
        onMouseEnter={!leftPanelPinned ? handleLeftHoverStart : undefined}
        onMouseLeave={!leftPanelPinned ? handleLeftHoverEnd : undefined}
      >
        <TreeMenu className="px-2" items={panelItems} />
      </Panel>

      {/* ════ Main content column ════ */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">

        {/* ════ Page Header ════ */}
        <PageHeader
          title="Campaigns"
          panelToggle="left"
          chip={showChip ? "Active" : undefined}
          panelPinned={leftPanelPinned}
          onPanelToggle={handleLeftToggle}
          onPanelHoverStart={!leftPanelPinned ? handleLeftHoverStart : undefined}
          onPanelHoverEnd={!leftPanelPinned ? handleLeftHoverEnd : undefined}
          onInnerPanelHoverStart={!rightSidePanelPinned ? handleRightHoverStart : undefined}
          onInnerPanelHoverEnd={!rightSidePanelPinned ? handleRightHoverEnd : undefined}
          actions={
            <>
              <Button variant="outline">Secondary</Button>
              <Button>
                <Plus className="h-4 w-4 mr-1" strokeWidth={1.5} />
                New Campaign
              </Button>
              <div className="mx-1 h-6 w-px bg-lyra-border-subtle" />
              <Button variant="outline" onClick={onAiPanelToggle}>
                <AiIcon className="h-4 w-4" />
                Ask AI
              </Button>
            </>
          }
        />

        {/* ════ Interior panels row ════ */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* ════ Main content column ════ */}
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex-1" />
          </div>

          {/* Interior right panel */}
          <Panel
            variant="interior"
            side="right"
            open={interiorPanelOpen}
            headerTitle="Details"
            onClose={() => setInteriorPanelOpen(false)}
          >
            <div className="p-4">
              <p className="lyra-body-md text-lyra-fg-secondary">Panel content goes here.</p>
            </div>
          </Panel>

        </div>
      </div>

      {/* ════ Right side panel ════ */}
      <Panel
        variant="side"
        side="right"
        open={rightSidePanelOpen}
        pinned={rightSidePanelPinned}
        headerTitle="Outbound"
        onPinToggle={canPin ? handleRightPinToggle : undefined}
        onMouseEnter={!rightSidePanelPinned ? handleRightHoverStart : undefined}
        onMouseLeave={!rightSidePanelPinned ? handleRightHoverEnd : undefined}
      >
        <div className="p-4">
          <p className="lyra-body-md text-lyra-fg-secondary">Side panel content.</p>
        </div>
      </Panel>

    </main>
  );
}
