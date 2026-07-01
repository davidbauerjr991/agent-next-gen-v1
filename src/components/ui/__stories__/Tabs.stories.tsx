import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TabList, Tab, TabPanel } from "../tabs";
import { LayoutGrid, Settings, FileText } from "lucide-react";

const meta: Meta<typeof TabList> = {
  title: "UI/Tabs",
  component: TabList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TabList>;

/* ── Auto-width tabs ── */

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState("tab1");
    return (
      <div>
        <TabList>
          <Tab active={active === "tab1"} onClick={() => setActive("tab1")}>
            Tab Section
          </Tab>
          <Tab active={active === "tab2"} onClick={() => setActive("tab2")}>
            Tab Section
          </Tab>
          <Tab active={active === "tab3"} onClick={() => setActive("tab3")}>
            Tab Section
          </Tab>
        </TabList>
        <TabPanel active={active === "tab1"}>
          <div className="p-4 lyra-body-md text-lyra-fg-default">
            Content for tab 1
          </div>
        </TabPanel>
        <TabPanel active={active === "tab2"}>
          <div className="p-4 lyra-body-md text-lyra-fg-default">
            Content for tab 2
          </div>
        </TabPanel>
        <TabPanel active={active === "tab3"}>
          <div className="p-4 lyra-body-md text-lyra-fg-default">
            Content for tab 3
          </div>
        </TabPanel>
      </div>
    );
  },
};

/* ── Full-width tabs ── */

export const FullWidth: Story = {
  name: "Full Width",
  render: () => {
    const [active, setActive] = useState("tab1");
    return (
      <TabList fullWidth>
        <Tab active={active === "tab1"} onClick={() => setActive("tab1")}>
          Tab Section
        </Tab>
        <Tab active={active === "tab2"} onClick={() => setActive("tab2")}>
          Tab Section
        </Tab>
        <Tab active={active === "tab3"} onClick={() => setActive("tab3")}>
          Tab Section
        </Tab>
      </TabList>
    );
  },
};

/* ── With Icons ── */

export const WithIcons: Story = {
  name: "With Icons",
  render: () => {
    const [active, setActive] = useState("tab1");
    return (
      <TabList>
        <Tab
          active={active === "tab1"}
          onClick={() => setActive("tab1")}
          icon={<LayoutGrid className="h-4 w-4" strokeWidth={1.5} />}
        >
          Tab Section
        </Tab>
        <Tab
          active={active === "tab2"}
          onClick={() => setActive("tab2")}
          icon={<Settings className="h-4 w-4" strokeWidth={1.5} />}
        >
          Tab Section
        </Tab>
        <Tab
          active={active === "tab3"}
          onClick={() => setActive("tab3")}
          icon={<FileText className="h-4 w-4" strokeWidth={1.5} />}
        >
          Tab Section
        </Tab>
      </TabList>
    );
  },
};

/* ── With Icons Full Width ── */

export const WithIconsFullWidth: Story = {
  name: "With Icons / Full Width",
  render: () => {
    const [active, setActive] = useState("tab1");
    return (
      <TabList fullWidth>
        <Tab
          active={active === "tab1"}
          onClick={() => setActive("tab1")}
          icon={<LayoutGrid className="h-4 w-4" strokeWidth={1.5} />}
        >
          Tab Section
        </Tab>
        <Tab
          active={active === "tab2"}
          onClick={() => setActive("tab2")}
          icon={<Settings className="h-4 w-4" strokeWidth={1.5} />}
        >
          Tab Section
        </Tab>
        <Tab
          active={active === "tab3"}
          onClick={() => setActive("tab3")}
          icon={<FileText className="h-4 w-4" strokeWidth={1.5} />}
        >
          Tab Section
        </Tab>
      </TabList>
    );
  },
};

/* ── Tab States (Base section from Figma) ── */

export const States: Story = {
  name: "Tab States",
  render: () => (
    <div className="space-y-6">
      <div>
        <span className="lyra-body-sm text-lyra-fg-secondary mb-2 block">
          Default
        </span>
        <div className="inline-flex border-b border-lyra-border-subtle">
          <Tab>Tab Section</Tab>
        </div>
      </div>
      <div>
        <span className="lyra-body-sm text-lyra-fg-secondary mb-2 block">
          Hover (hover over to see)
        </span>
        <div className="inline-flex border-b border-lyra-border-subtle">
          <Tab>Tab Section</Tab>
        </div>
      </div>
      <div>
        <span className="lyra-body-sm text-lyra-fg-secondary mb-2 block">
          Active
        </span>
        <div className="inline-flex border-b border-lyra-border-subtle">
          <Tab active>Tab Section</Tab>
        </div>
      </div>
    </div>
  ),
};
