import type { Meta, StoryObj } from "@storybook/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../table";
import { Checkbox } from "../checkbox";
import { CircleCheck, Minus, MoreVertical } from "lucide-react";

const meta: Meta<typeof Table> = {
  title: "UI/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

const sampleData = [
  { id: 1, name: "Agent Desktop #1", published: true, description: "Back office", createdBy: "Jim Smith" },
  { id: 2, name: "Agent Desktop #2", published: true, description: "Custom", createdBy: "Jim Smith" },
  { id: 3, name: "Agent Desktop #3", published: false, description: "Knowledge Worker", createdBy: "Jim Smith" },
  { id: 4, name: "Agent Desktop #4", published: true, description: "BPO", createdBy: "Jim Smith" },
  { id: 5, name: "Agent Desktop #5", published: true, description: "Collections", createdBy: "Jim Smith" },
];

export const Default: Story = {
  render: () => (
    <div className="h-[400px]">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[40px] shrink-0"><Checkbox /></TableHead>
            <TableHead className="flex-[2]">Name</TableHead>
            <TableHead className="flex-1">Published</TableHead>
            <TableHead className="flex-[2]">Description</TableHead>
            <TableHead className="flex-[1.3]">Created By</TableHead>
            <TableHead className="w-[48px] shrink-0"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleData.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="w-[40px] shrink-0"><Checkbox /></TableCell>
              <TableCell className="flex-[2] text-lyra-fg-link cursor-pointer hover:underline">{row.name}</TableCell>
              <TableCell className="flex-1">
                {row.published ? (
                  <CircleCheck className="h-5 w-5 text-lyra-status-success-strong" strokeWidth={1.5} />
                ) : (
                  <Minus className="h-5 w-5 text-lyra-fg-disabled" strokeWidth={1.5} />
                )}
              </TableCell>
              <TableCell className="flex-[2]">{row.description}</TableCell>
              <TableCell className="flex-[1.3]">{row.createdBy}</TableCell>
              <TableCell className="w-[48px] shrink-0">
                <button className="flex h-7 w-7 items-center justify-center rounded-lyra-sm text-lyra-fg-secondary hover:bg-lyra-bg-surface-shell transition-colors">
                  <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

export const WithSelectedRows: Story = {
  render: () => (
    <div className="h-[400px]">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[40px] shrink-0"><Checkbox checked="indeterminate" /></TableHead>
            <TableHead className="flex-[2]">Name</TableHead>
            <TableHead className="flex-1">Published</TableHead>
            <TableHead className="flex-[2]">Description</TableHead>
            <TableHead className="flex-[1.3]">Created By</TableHead>
            <TableHead className="w-[48px] shrink-0"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleData.map((row) => (
            <TableRow key={row.id} data-state={row.id <= 2 ? "selected" : undefined}>
              <TableCell className="w-[40px] shrink-0"><Checkbox checked={row.id <= 2} /></TableCell>
              <TableCell className="flex-[2] text-lyra-fg-link cursor-pointer hover:underline">{row.name}</TableCell>
              <TableCell className="flex-1">
                {row.published ? (
                  <CircleCheck className="h-5 w-5 text-lyra-status-success-strong" strokeWidth={1.5} />
                ) : (
                  <Minus className="h-5 w-5 text-lyra-fg-disabled" strokeWidth={1.5} />
                )}
              </TableCell>
              <TableCell className="flex-[2]">{row.description}</TableCell>
              <TableCell className="flex-[1.3]">{row.createdBy}</TableCell>
              <TableCell className="w-[48px] shrink-0">
                <button className="flex h-7 w-7 items-center justify-center rounded-lyra-sm text-lyra-fg-secondary hover:bg-lyra-bg-surface-shell transition-colors">
                  <MoreVertical className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};
