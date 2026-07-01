import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "select",
      options: [true, false, "indeterminate"],
    },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

/* ── Individual states ── */

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Indeterminate: Story = {
  args: { checked: "indeterminate" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true },
};

export const DisabledIndeterminate: Story = {
  args: { disabled: true, checked: "indeterminate" },
};

/* ── State Matrix (matches Figma) ── */

export const StateMatrix: Story = {
  name: "State Matrix",
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="lyra-body-sm-emphasis text-lyra-fg-secondary mb-4">
          All States (hover and click to see interactive states)
        </h3>
        <div className="grid grid-cols-4 gap-x-8 gap-y-4 items-center">
          {/* Headers */}
          <span className="lyra-body-sm text-lyra-fg-secondary">State</span>
          <span className="lyra-body-sm text-lyra-fg-secondary">Unchecked</span>
          <span className="lyra-body-sm text-lyra-fg-secondary">Checked</span>
          <span className="lyra-body-sm text-lyra-fg-secondary">Indeterminate</span>

          {/* Default */}
          <span className="lyra-body-sm text-lyra-fg-secondary">Default</span>
          <div className="flex items-center gap-2">
            <Checkbox id="d-unc" />
            <label htmlFor="d-unc" className="lyra-body-md text-lyra-fg-default">Checkbox label</label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="d-chk" defaultChecked />
            <label htmlFor="d-chk" className="lyra-body-md text-lyra-fg-default">Checkbox label</label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="d-ind" checked="indeterminate" />
            <label htmlFor="d-ind" className="lyra-body-md text-lyra-fg-default">Checkbox label</label>
          </div>

          {/* Disabled */}
          <span className="lyra-body-sm text-lyra-fg-secondary">Disabled</span>
          <div className="flex items-center gap-2">
            <Checkbox id="dis-unc" disabled />
            <label htmlFor="dis-unc" className="lyra-body-md text-lyra-fg-disabled">Checkbox label</label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="dis-chk" disabled checked />
            <label htmlFor="dis-chk" className="lyra-body-md text-lyra-fg-disabled">Checkbox label</label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="dis-ind" disabled checked="indeterminate" />
            <label htmlFor="dis-ind" className="lyra-body-md text-lyra-fg-disabled">Checkbox label</label>
          </div>
        </div>
      </div>
    </div>
  ),
};

/* ── Interactive Demo ── */

export const Interactive: Story = {
  name: "Interactive",
  render: () => {
    const [items, setItems] = useState([
      { id: "a", label: "Option A", checked: false },
      { id: "b", label: "Option B", checked: true },
      { id: "c", label: "Option C", checked: false },
    ]);

    const allChecked = items.every((i) => i.checked);
    const someChecked = !allChecked && items.some((i) => i.checked);

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={allChecked ? true : someChecked ? "indeterminate" : false}
            onCheckedChange={(checked) =>
              setItems((prev) => prev.map((i) => ({ ...i, checked: !!checked })))
            }
          />
          <label htmlFor="select-all" className="lyra-body-md-emphasis text-lyra-fg-default">
            Select all
          </label>
        </div>
        <div className="ml-6 space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Checkbox
                id={item.id}
                checked={item.checked}
                onCheckedChange={(checked) =>
                  setItems((prev) =>
                    prev.map((i) =>
                      i.id === item.id ? { ...i, checked: !!checked } : i
                    )
                  )
                }
              />
              <label htmlFor={item.id} className="lyra-body-md text-lyra-fg-default">
                {item.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/* ── Checkbox Group — Vertical ── */

export const GroupVertical: Story = {
  name: "Group / Vertical",
  render: () => (
    <div className="space-y-8">
      <fieldset className="space-y-2">
        <legend className="lyra-label text-lyra-fg-default mb-1">Input Label</legend>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Checkbox id={`vg-${i}`} />
            <label htmlFor={`vg-${i}`} className="lyra-body-md text-lyra-fg-default">Checkbox label</label>
          </div>
        ))}
      </fieldset>

      <fieldset className="space-y-2" disabled>
        <legend className="lyra-label text-lyra-fg-disabled mb-1">Input Label</legend>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Checkbox id={`vg-dis-${i}`} disabled />
            <label htmlFor={`vg-dis-${i}`} className="lyra-body-md text-lyra-fg-disabled">Checkbox label</label>
          </div>
        ))}
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="lyra-label text-lyra-fg-default mb-1">Input Label</legend>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Checkbox id={`vg-err-${i}`} error defaultChecked />
            <label htmlFor={`vg-err-${i}`} className="lyra-body-md text-lyra-fg-default">Checkbox label</label>
          </div>
        ))}
        <p className="lyra-body-sm text-lyra-status-critical-strong">This field is required</p>
      </fieldset>
    </div>
  ),
};

/* ── Checkbox Group — Horizontal ── */

export const GroupHorizontal: Story = {
  name: "Group / Horizontal",
  render: () => (
    <div className="space-y-8">
      <fieldset className="space-y-2">
        <legend className="lyra-label text-lyra-fg-default mb-1">Input Label</legend>
        <div className="flex items-center gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Checkbox id={`hg-${i}`} />
              <label htmlFor={`hg-${i}`} className="lyra-body-md text-lyra-fg-default">Checkbox label</label>
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2" disabled>
        <legend className="lyra-label text-lyra-fg-disabled mb-1">Input Label</legend>
        <div className="flex items-center gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Checkbox id={`hg-dis-${i}`} disabled />
              <label htmlFor={`hg-dis-${i}`} className="lyra-body-md text-lyra-fg-disabled">Checkbox label</label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  ),
};

/* ── With Secondary Text ── */

export const WithSecondaryText: Story = {
  name: "With Secondary Text",
  render: () => (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <Checkbox id="sec-1" className="mt-0.5" />
        <label htmlFor="sec-1">
          <span className="lyra-body-md text-lyra-fg-default block">Checkbox label</span>
        </label>
      </div>
      <div className="flex items-start gap-2">
        <Checkbox id="sec-2" className="mt-0.5" />
        <label htmlFor="sec-2">
          <span className="lyra-body-md text-lyra-fg-default block">Checkbox label</span>
          <span className="lyra-body-sm text-lyra-fg-secondary block">Secondary Text</span>
        </label>
      </div>
    </div>
  ),
};
