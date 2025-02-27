import { TableWithColumnFilters } from "@/registry/block/data-table/data-table";
import { SearchButton } from "@/registry/ui/search-button";
import React from "react";

const PreviewPage = () => {
  return (
    <div className="h-fullscreen w-full flex justify-center items-center p-10">
      <div className="mx-auto w-[1200px]">
        <SearchButton />
        <TableWithColumnFilters />
      </div>
    </div>
  );
};

export default PreviewPage;
