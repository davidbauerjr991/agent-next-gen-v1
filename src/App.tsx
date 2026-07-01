import { useState, useCallback, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DesktopDesignsPage } from "@/components/DesktopDesignsPage";
import { AgentNextGenPage } from "@/components/AgentNextGenPage";
import { OutboundEngagementPage } from "@/components/OutboundEngagementPage";

type Page = "agent-workspace" | "agent" | "outbound";

/* ── Hash-based routing ── */
const PAGE_HASH: Record<Page, string> = {
  "agent":           "",
  "agent-workspace": "#/agentworkspacepremium",
  "outbound":        "#/outboundengagement",
};

function pageFromHash(): Page {
  const hash = window.location.hash;
  if (hash === "#/agentworkspacepremium") return "agent-workspace";
  if (hash === "#/outboundengagement") return "outbound";
  return "agent";
}

function useHashRouter(): [Page, (page: Page) => void] {
  const [page, setPageState] = useState<Page>(pageFromHash);

  useEffect(() => {
    const onPop = () => setPageState(pageFromHash());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((next: Page) => {
    const hash = PAGE_HASH[next];
    window.history.pushState(null, "", hash === "" ? window.location.pathname : hash);
    setPageState(next);
  }, []);

  return [page, navigate];
}

import {
  ContentArea,
  Container,
  AiPanel,
  ConversationMessage,
  AIProcess,
  type AIProcessStep,
  type AiPanelSuggestion,
} from "@nicecxone/lyra-ui";

/* ── Session cookie helpers ── */
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

/* ── Simulated AI responses ── */
interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  steps?: AIProcessStep[];
}

const RESPONSES: Record<string, { steps: AIProcessStep[]; text: string }> = {
  default: {
    steps: [
      { id: "1", label: "Searching documentation",    status: "done" },
      { id: "2", label: "Reviewing configuration",    status: "done" },
      { id: "3", label: "Composing response",         status: "done" },
    ],
    text: "I've reviewed the available documentation and configuration options. Here's what I found based on your question.",
  },
  "Create an AI Agent": {
    steps: [
      { id: "1", label: "Checking agent templates",   status: "done" },
      { id: "2", label: "Reviewing permissions",      status: "done" },
      { id: "3", label: "Generating setup guide",     status: "done" },
    ],
    text: "To create an AI Agent, navigate to Admin → AI Agents → New Agent. Choose a model (GPT-4o, Claude 3.5, or Gemini 1.5), configure skills and routing rules, then save and activate.",
  },
  "See what has changed since yesterday": {
    steps: [
      { id: "1", label: "Pulling change log",         status: "done" },
      { id: "2", label: "Comparing configurations",   status: "done" },
      { id: "3", label: "Summarising differences",    status: "done" },
    ],
    text: "Since yesterday there were 3 configuration changes: (1) Billing queue SLA threshold updated from 90s to 60s, (2) AI Agent #4 routing rules modified, (3) New desktop template 'Healthcare v2' published by Jim Smith.",
  },
  "How can I manually configure AI Agents?": {
    steps: [
      { id: "1", label: "Locating configuration docs", status: "done" },
      { id: "2", label: "Identifying key settings",    status: "done" },
      { id: "3", label: "Building step-by-step guide", status: "done" },
    ],
    text: "Manual configuration is available under Admin → AI Agents → select agent → Configure. Key settings include: Model selection, Confidence threshold, Fallback behaviour, Skill assignments, and Escalation rules.",
  },
};

function getResponse(text: string) {
  return RESPONSES[text] ?? RESPONSES.default;
}

/* ── Animated slide-in panel wrapper ── */
function SlidingPanel({ open, children }: { open: boolean; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timer.current);
    if (open) {
      setMounted(true);
      timer.current = setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
      timer.current = setTimeout(() => setMounted(false), 300);
    }
    return () => clearTimeout(timer.current);
  }, [open]);

  if (!mounted) return null;

  return (
    <div style={{
      width: visible ? 432 : 0,
      overflow: "hidden",
      flexShrink: 0,
      transition: "width 250ms cubic-bezier(0.4, 0, 0.2, 1)",
    }}>
      <div className="flex h-full pr-3 pb-3" style={{ width: 432 }}>
        {children}
      </div>
    </div>
  );
}

/* ── App ── */
function App() {
  const [page, setPage] = useHashRouter();
  const [sidebarOpen, setSidebarOpen] = useState(() => readBoolCookie("lyra_sidebar_open", false));
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [messages,   setMessages]   = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [thinking,   setThinking]   = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen((prev) => {
      const next = !prev;
      setCookie("lyra_sidebar_open", String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", text }]);
    setInputValue("");
    setThinking(true);
    setTimeout(() => {
      const { steps, text: responseText } = getResponse(text);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "ai", text: responseText, steps }]);
      setThinking(false);
    }, 1800);
  }, []);

  const handleSuggestion = useCallback((s: AiPanelSuggestion) => {
    setAiPanelOpen(true);
    sendMessage(s.label);
  }, [sendMessage]);

  const handleNewConversation = useCallback(() => {
    setMessages([]); setInputValue(""); setThinking(false);
  }, []);

  const SUGGESTIONS: AiPanelSuggestion[] = [
    { id: "1", label: "Create an AI Agent" },
    { id: "2", label: "See what has changed since yesterday" },
    { id: "3", label: "How can I manually configure AI Agents?" },
  ];

  const conversationContent = messages.length > 0 || thinking ? (
    <div className="flex flex-col gap-4">
      {messages.map((msg) =>
        msg.role === "user" ? (
          <ConversationMessage key={msg.id} variant="user">{msg.text}</ConversationMessage>
        ) : (
          <ConversationMessage key={msg.id} variant="ai" process={msg.steps} processExpanded={false}>
            {msg.text}
          </ConversationMessage>
        )
      )}
      {thinking && (
        <ConversationMessage variant="ai">
          <AIProcess label="Thinking…" defaultExpanded steps={[
            { id: "1", label: "Searching documentation", status: "active" },
            { id: "2", label: "Reviewing configuration",  status: "pending" },
            { id: "3", label: "Composing response",       status: "pending" },
          ]} />
        </ConversationMessage>
      )}
      <div ref={messagesEndRef} />
    </div>
  ) : undefined;

  if (page === "agent") {
    return <AgentNextGenPage showPageHeader showPanelToggle showInteriorPanel onNavigate={setPage} />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header onNavigate={setPage} currentPage={page} />
      <div className="flex flex-1 overflow-hidden bg-lyra-bg-surface-shell">
        <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />
        <ContentArea className="min-w-0">
          <Container className="relative flex flex-1 overflow-hidden">
            {page === "outbound"
              ? <OutboundEngagementPage onAiPanelToggle={() => setAiPanelOpen((v) => !v)} />
              : <DesktopDesignsPage onAiPanelToggle={() => setAiPanelOpen((v) => !v)} />
            }
          </Container>
        </ContentArea>
        <SlidingPanel open={aiPanelOpen}>
          <AiPanel
            userName="John"
            className="h-full w-full"
            suggestions={SUGGESTIONS}
            onSuggestion={handleSuggestion}
            onClose={() => setAiPanelOpen(false)}
            onNewConversation={handleNewConversation}
            inputProps={{ value: inputValue, onChange: setInputValue, onSubmit: sendMessage }}
          >
            {conversationContent}
          </AiPanel>
        </SlidingPanel>
      </div>
    </div>
  );
}

export default App;
