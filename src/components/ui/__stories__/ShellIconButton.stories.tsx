import type { Meta, StoryObj } from "@storybook/react";
import { ActionIconButton } from "../actions";
import { CircleHelp, Bell, Settings, Search } from "lucide-react";

const meta: Meta<typeof ActionIconButton> = {
  title: "UI/ActionButtons/IconButton",
  component: ActionIconButton,
  tags: ["autodocs"],
  argTypes: {
    badge: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof ActionIconButton>;

export const Default: Story = {
  args: {
    children: <CircleHelp className="h-[18px] w-[18px]" strokeWidth={1.5} />,
  },
};

export const WithBadge: Story = {
  name: "With Badge",
  args: {
    badge: 5,
    children: <CircleHelp className="h-[18px] w-[18px]" strokeWidth={1.5} />,
  },
};

export const States: Story = {
  name: "States (Default / Hover / Pressed)",
  render: () => (
    <div className="space-y-6">
      <div>
        <span className="lyra-body-sm text-lyra-fg-secondary mb-2 block">
          Default
        </span>
        <ActionIconButton badge={5}>
          <CircleHelp className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </ActionIconButton>
      </div>
      <div>
        <span className="lyra-body-sm text-lyra-fg-secondary mb-2 block">
          Hover (hover to see)
        </span>
        <ActionIconButton badge={5}>
          <CircleHelp className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </ActionIconButton>
      </div>
      <div>
        <span className="lyra-body-sm text-lyra-fg-secondary mb-2 block">
          Pressed (click and hold)
        </span>
        <ActionIconButton badge={5}>
          <CircleHelp className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </ActionIconButton>
      </div>
    </div>
  ),
};

export const AllIcons: Story = {
  name: "Icon Variations",
  render: () => (
    <div className="flex items-center gap-2">
      <ActionIconButton title="Help">
        <CircleHelp className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </ActionIconButton>
      <ActionIconButton title="Notifications" badge={4}>
        <Bell className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </ActionIconButton>
      <ActionIconButton title="Settings">
        <Settings className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </ActionIconButton>
      <ActionIconButton title="Search">
        <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </ActionIconButton>
    </div>
  ),
};
