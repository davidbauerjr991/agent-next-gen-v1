import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import { Sparkles, MoreVertical, ChevronDown, RefreshCw, Trash2 } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "ghost", "icon"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/* ── Individual variant stories ── */

export const Primary: Story = {
  args: {
    children: "Button",
    variant: "default",
  },
};

export const Destructive: Story = {
  args: {
    children: "Button",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "Button",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "Button",
    variant: "ghost",
  },
};

export const IconButton: Story = {
  args: {
    variant: "icon",
    size: "icon",
    children: <MoreVertical className="h-4 w-4" strokeWidth={1.5} />,
  },
};

export const Disabled: Story = {
  args: {
    children: "Button",
    disabled: true,
  },
};

/* ── Size variants ── */

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button variant="icon" size="icon">
        <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
      </Button>
    </div>
  ),
};

/* ── Lyra Button Matrix (matches Figma) ── */

export const AllVariants: Story = {
  name: "Variant Matrix",
  render: () => (
    <div className="space-y-8">
      {/* Text buttons */}
      <div>
        <h3 className="lyra-body-sm-emphasis text-lyra-fg-secondary mb-4">Text Buttons</h3>
        <div className="grid grid-cols-5 gap-x-6 gap-y-3 items-center">
          {/* Header row */}
          <span className="lyra-body-sm text-lyra-fg-secondary">State</span>
          <span className="lyra-body-sm text-lyra-fg-secondary">Outline</span>
          <span className="lyra-body-sm text-lyra-fg-secondary">Primary</span>
          <span className="lyra-body-sm text-lyra-fg-secondary">Destructive</span>
          <span className="lyra-body-sm text-lyra-fg-secondary">Ghost</span>

          {/* Default */}
          <span className="lyra-body-sm text-lyra-fg-secondary">Default</span>
          <Button variant="outline">Button</Button>
          <Button variant="default">Button</Button>
          <Button variant="destructive">Button</Button>
          <Button variant="ghost">Button</Button>

          {/* Disabled */}
          <span className="lyra-body-sm text-lyra-fg-secondary">Disabled</span>
          <Button variant="outline" disabled>Button</Button>
          <Button variant="default" disabled>Button</Button>
          <Button variant="destructive" disabled>Button</Button>
          <Button variant="ghost" disabled>Button</Button>
        </div>
      </div>

      {/* Icon buttons */}
      <div>
        <h3 className="lyra-body-sm-emphasis text-lyra-fg-secondary mb-4">Icon Buttons</h3>
        <div className="grid grid-cols-5 gap-x-6 gap-y-3 items-center">
          <span className="lyra-body-sm text-lyra-fg-secondary">State</span>
          <span className="lyra-body-sm text-lyra-fg-secondary">Outline</span>
          <span className="lyra-body-sm text-lyra-fg-secondary">Primary</span>
          <span className="lyra-body-sm text-lyra-fg-secondary">Destructive</span>
          <span className="lyra-body-sm text-lyra-fg-secondary">Ghost</span>

          <span className="lyra-body-sm text-lyra-fg-secondary">Default</span>
          <Button variant="outline" size="icon">
            <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
          </Button>
          <Button variant="default" size="icon">
            <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
          </Button>
          <Button variant="destructive" size="icon">
            <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
          </Button>
          <Button variant="icon" size="icon">
            <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
          </Button>

          <span className="lyra-body-sm text-lyra-fg-secondary">Disabled</span>
          <Button variant="outline" size="icon" disabled>
            <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
          </Button>
          <Button variant="default" size="icon" disabled>
            <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
          </Button>
          <Button variant="destructive" size="icon" disabled>
            <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
          </Button>
          <Button variant="icon" size="icon" disabled>
            <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      {/* Base: with leading icon + trailing chevron */}
      <div>
        <h3 className="lyra-body-sm-emphasis text-lyra-fg-secondary mb-4">With Icons</h3>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Sparkles className="h-4 w-4" strokeWidth={1.5} />
            Button
            <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Button>
          <Button variant="default">
            <Sparkles className="h-4 w-4" strokeWidth={1.5} />
            Button
            <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            Delete
          </Button>
          <Button variant="ghost">
            <RefreshCw className="h-4 w-4" strokeWidth={1.5} />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  ),
};
