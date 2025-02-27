"use client";
import { Input } from "@/components/ui/input";

import { Search, X } from "lucide-react";
import * as React from "react";

export const SearchButton = () => {
  const [searchFocus, setSearchFocus] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [searchItem, setSearchItem] = React.useState<string>("");
  const [searchInput, setSearchInput] = React.useState("");
  const [hasSearchFilter, setHasSearchFilter] = React.useState(false);

  React.useEffect(() => {
    if (searchItem) {
      setHasSearchFilter(true);
    }
  }, [searchItem]);

  React.useEffect(() => {
    if (!hasSearchFilter) {
      setSearchItem("");
      setSearchInput("");
      setSearchFocus(false);
    }
  }, [hasSearchFilter]);

  return (
    <div
      className={`${
        searchFocus ? "bg-prim-surf-subtle" : "bg-input-foreground border"
      } flex border-none rounded p-input-field text-sm`}
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {searchItem !== "" && hasSearchFilter ? (
        <div className="flex items-center px-3 py-[0.45rem] w-fit gap-1 border border-input rounded-md bg-[#EFEFF1]">
          <Search className="w-4 h-4" />
          <p className="p-0">{searchItem}</p>
          <X
            className="remove w-4 h-4 cursor-pointer"
            onClick={() => {
              setSearchItem("");
              setSearchFocus(false);
            }}
          />
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
          <Input
            className="pl-8"
            ref={inputRef}
            value={searchInput}
            width={searchFocus ? "158px" : "100px"}
            onBlur={() => {
              setSearchItem(searchInput);
              if (searchInput === "") setSearchFocus(false);
            }}
            onFocus={() => setSearchFocus(true)}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (["Enter", ",", ";", " "].includes(e.key)) {
                e.preventDefault();
                setSearchItem(searchInput);
              }
            }}
            placeholder={searchItem === "" && !hasSearchFilter ? "Search" : ""}
          />
        </div>
      )}
    </div>
  );
};
