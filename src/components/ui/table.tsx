import * as React from "react";
import { cn } from "@/lib/utils";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full flex flex-col overflow-hidden h-full">
    <table
      ref={ref}
      className={cn("w-full caption-bottom flex flex-col h-full", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-lyra-bg-surface-base flex-shrink-0", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("flex-1 overflow-y-auto [&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "flex w-full border-b border-lyra-border-subtle transition-colors",
      /* default row states */
      "hover:bg-lyra-state-hover active:bg-lyra-state-pressed",
      /* selected row states */
      "data-[state=selected]:bg-lyra-bg-active-subtle",
      "data-[state=selected]:hover:bg-lyra-state-hover-active-subtle",
      "data-[state=selected]:active:bg-lyra-state-pressed-active-subtle",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "flex items-center h-10 px-3 text-left text-[14px] font-medium text-lyra-fg-default border-b border-lyra-border-default whitespace-nowrap overflow-hidden text-ellipsis [&:has([role=checkbox])]:pr-0 [&:has([role=checkbox])]:w-[40px]",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "flex items-center h-10 px-3 lyra-body-md text-lyra-fg-default whitespace-nowrap overflow-hidden text-ellipsis [&:has([role=checkbox])]:pr-0 [&:has([role=checkbox])]:w-[40px]",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
