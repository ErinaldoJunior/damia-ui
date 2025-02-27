import { Registry } from "./schema";

export const ui: Registry = [
  {
    name: "data-table",
    type: "registry:block",
    registryDependencies: [
      "button",
      "checkbox",
      "dropdown-menu",
      "avatar",
      "command",
      "calendar",
      "select",
      "popover",
      "separator",
      "input",
      "table",
      "skeleton",
    ],
    dependencies: ["lucide-react", "@tanstack/react-table"],
    files: [
      "block/data-table/data-table.tsx",
      "block/data-table/columns.tsx",
      "block/data-table/column-filter.tsx",
      "block/data-table/multi-select.tsx",
      "block/data-table/table-input.tsx",
      "block/data-table/popover-skeleton.tsx",
    ],
  },

  {
    name: "search-button",
    type: "registry:block",
    registryDependencies: ["input"],
    dependencies: ["lucide-react"],
    files: ["ui/search-button.tsx"],
  },
];
