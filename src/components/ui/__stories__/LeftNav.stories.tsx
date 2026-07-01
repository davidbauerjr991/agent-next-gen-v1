import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LeftNav, type NavItem } from "../left-nav";
import {
  Monitor,
  LayoutGrid,
  Settings,
  PencilRuler,
  FileText,
} from "lucide-react";

const sampleItems: NavItem[] = [
  {
    icon: <Monitor className="h-4 w-4" strokeWidth={1.5} />,
    label: "Monitor",
  },
  {
    icon: <LayoutGrid className="h-4 w-4" strokeWidth={1.5} />,
    label: "Dashboard",
  },
  {
    icon: <Settings className="h-4 w-4" strokeWidth={1.5} />,
    label: "Configure",
    expandable: true,
    defaultOpen: false,
    children: [
      { label: "General" },
      { label: "Security" },
      { label: "Integrations" },
    ],
  },
  {
    icon: <PencilRuler className="h-4 w-4" strokeWidth={1.5} />,
    label: "Designer",
    expandable: true,
    defaultOpen: true,
    children: [
      { label: "Desktop Library", active: true },
      { label: "Templates" },
      { label: "Components" },
    ],
  },
  {
    icon: <FileText className="h-4 w-4" strokeWidth={1.5} />,
    label: "Examples",
  },
  {
    icon: <FileText className="h-4 w-4" strokeWidth={1.5} />,
    label: "Product Mockups",
  },
];

const meta: Meta<typeof LeftNav> = {
  title: "UI/LeftNav",
  component: LeftNav,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="flex h-[600px] bg-lyra-bg-surface-shell">
        <Story />
        <div className="flex-1 bg-lyra-bg-surface-base m-3 rounded-lyra-lg border border-lyra-border-subtle" />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LeftNav>;

/* ── Default (expanded) ── */

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <LeftNav
        items={sampleItems}
        open={open}
        onToggle={() => setOpen((v) => !v)}
      />
    );
  },
};

/* ── Collapsed ── */

export const Collapsed: Story = {
  name: "Collapsed",
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <LeftNav
        items={sampleItems}
        open={open}
        onToggle={() => setOpen((v) => !v)}
      />
    );
  },
};

/* ── No Toggle (always expanded) ── */

export const NoToggle: Story = {
  name: "No Toggle Button",
  render: () => (
    <LeftNav items={sampleItems} open={true} collapsible={false} />
  ),
};

/* ── Custom Items ── */

export const CustomItems: Story = {
  name: "Custom Items",
  render: () => {
    const [open, setOpen] = useState(true);
    const items: NavItem[] = [
      {
        icon: <LayoutGrid className="h-4 w-4" strokeWidth={1.5} />,
        label: "Overview",
        active: true,
      },
      {
        icon: <Settings className="h-4 w-4" strokeWidth={1.5} />,
        label: "Settings",
        expandable: true,
        defaultOpen: true,
        children: [
          { label: "Profile" },
          { label: "Notifications", active: true },
          { label: "Privacy" },
        ],
      },
      {
        icon: <FileText className="h-4 w-4" strokeWidth={1.5} />,
        label: "Reports",
      },
    ];
    return (
      <LeftNav
        items={items}
        open={open}
        onToggle={() => setOpen((v) => !v)}
      />
    );
  },
};
