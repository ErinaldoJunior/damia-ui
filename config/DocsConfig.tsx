import { MainNavItem, SidebarNavItem } from "@/types/nav";

export interface DocsConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
  mainNav: [],
  sidebarNav: [
    {
      title: "Blocks",
      items: [
        {
          title: "Data Table",
          href: "/docs/data-table",
          items: [],
        },
      ],
    },
    {
      title: "Components",
      items: [
        {
          title: "Search Button",
          href: "/docs/search-button",
          items: [],
        },
      ],
    },
  ],
};
