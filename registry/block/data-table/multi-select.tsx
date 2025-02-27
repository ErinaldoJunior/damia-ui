// src/components/multi-select.tsx

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, Pin, Tag } from "lucide-react";
import { parseISO } from "date-fns";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./table-input";
import { PopoverSkeleton } from "./popover-skeleton";
import { Column } from "@tanstack/react-table";
import { Payment } from "./data-table";

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */

const multiSelectVariants = cva(
  "m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: {
    /** The text to display for the option. */
    label: string;
    /** The unique value associated with the option. */
    value: string;
    /** Optional icon component to display alongside the option. */
    icon?: React.ComponentType<{ className?: string }>;

    avatar?: string;
    color?: string;
    reason?: string;
    id: number;
    name: string;
  }[];

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange: (value: any) => void;

  /** The default selected values when the component mounts. */
  defaultValue?: string[];

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * Animation duration in seconds for the visual effects (e.g., bouncing badges).
   * Optional, defaults to 0 (no animation).
   */
  animation?: number;

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * If true, renders the multi-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;
  trigger?: React.ReactNode;

  handlePinColumn?: () => void;
  handleUnpinColumn?: () => void;
  handleSorting: any;
  column: Column<Payment>;
  handleDateSelect: (date: string) => void | null;
  clearFilter: () => void;
  handleTagSelect: (tag: any) => void;
  filters?: any;
  setSelectOptions: any;
}

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,

      trigger,
      handlePinColumn,
      handleUnpinColumn,
      handleDateSelect,
      handleSorting,
      clearFilter,
      column,
      filters,
    },
    ref
  ) => {
    // válidos para array de ids para as colunas do tipo customer, rhinos etc
    const [selectedValues, setSelectedValues] = React.useState<any[]>([]);
    const [selectedValuesTags, setSelectedValuesTags] = React.useState<any[]>(
      []
    );

    // válido para valores únicos, que não são arrays

    const [selectedValue, setSelectedValue] = React.useState<string>("");

    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isPinned, setIsPinned] = React.useState(false);

    const [minValue, setMinValue] = React.useState("");
    const [maxValue, setMaxValue] = React.useState("");

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setMinValue(e.target.value);
      toggleOptionForUniqueValues({ min: e.target.value, max: maxValue });
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setMaxValue(e.target.value);
      toggleOptionForUniqueValues({ min: minValue, max: e.target.value });
    };

    React.useEffect(() => {
      if (column) {
        setIsPinned(column.getIsPinned() as boolean);
      }
    }, [column]);

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const toggleOptionForArr = (option: { id: number; name: string }) => {
      const newSelectedValues = selectedValues.some(
        (value) => value.id === option.id
      )
        ? selectedValues.filter((value) => value.id !== option.id)
        : [...selectedValues, option];
      setSelectedValues(newSelectedValues);
    };

    const toggleOptionForTags = (option: { value: string; reason: string }) => {
      const newSelectedValues = selectedValuesTags.some(
        (item) => item.value === option.value
      )
        ? selectedValuesTags.filter((item) => item.value !== option.value)
        : [...selectedValuesTags, option];
      setSelectedValuesTags(newSelectedValues);
    };
    const toggleOptionForUniqueValues = (value: any) => {
      setSelectedValue(value);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    // ao fechar o popover eu faço o filtro
    const handleClosePopover = (open: boolean) => {
      setIsPopoverOpen(open);

      // se tiver valores selecionados chamo a função que faz o fetch com os filtros
      if (selectedValues.length > 0) {
        onValueChange(selectedValues);
      } else if (selectedValue) {
        onValueChange(selectedValue);
      } else if (minValue && maxValue) {
        onValueChange({ min: minValue, max: maxValue });
      } else if (selectedValuesTags.length > 0) {
        onValueChange(selectedValuesTags);
      }
    };

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={(open: boolean) => handleClosePopover(open)}
        modal={true}
      >
        <PopoverTrigger asChild onClick={handleTogglePopover} ref={ref}>
          {trigger}
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command>
            {(column.columnDef?.meta as { type?: string })?.type !==
              "actions" && (
              <div className="flex justify-start border-b">
                <Button
                  variant="ghost"
                  onClick={handleSorting}
                  className="w-full"
                >
                  <span className="text-grey-text-body">
                    Sort values {""}
                    {column.getIsSorted() !== false ? (
                      <span className="text-[#9797A5]">
                        {column.getIsSorted() === "asc"
                          ? "(ascending)"
                          : "(descending)"}
                      </span>
                    ) : null}
                  </span>

                  <span className="flex flex-col gap-0">
                    <ChevronUpIcon
                      className={`w-4 h-4 -mb-2.5 ${
                        column.getIsSorted() === "asc"
                          ? "text-grey-text-body font-bold"
                          : "text-grey-border-dis"
                      }`}
                    />
                    <ChevronDownIcon
                      className={`w-4 h-4 ${
                        column.getIsSorted() === "desc"
                          ? "text-grey-text-body font-bold"
                          : "text-grey-border-dis"
                      }`}
                    />
                  </span>
                </Button>
              </div>
            )}

            {(column.columnDef?.meta as { type?: string })?.type === "date" ? (
              <div>
                <Calendar
                  onDayClick={(day) => handleDateSelect(day.toISOString())}
                  selected={
                    column.getFilterValue()
                      ? parseISO(column.getFilterValue() as string)
                      : new Date()
                  }
                  defaultMonth={
                    column.getFilterValue()
                      ? parseISO(column.getFilterValue() as string)
                      : new Date()
                  }
                  className="button:bg-red-700"
                />
                <Separator />
                <div>
                  <div className="flex items-center justify-between">
                    {isPinned ? (
                      <Button
                        variant="ghost"
                        onClick={handleUnpinColumn}
                        className="flex-1 justify-start cursor-pointer max-w-full"
                      >
                        <Pin className="h-4 w-4 mr-2" /> Unpin
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        onClick={handlePinColumn}
                        className="flex-1 justify-start cursor-pointer max-w-full"
                      >
                        <Pin className="h-4 w-4 mr-2" /> Pin to left
                      </Button>
                    )}

                    {selectedValues.length > 0 && (
                      <>
                        <Separator
                          orientation="vertical"
                          className="flex min-h-6 h-full"
                        />
                        <Button
                          variant="ghost"
                          onClick={clearFilter}
                          className="flex-1 justify-center cursor-pointer"
                        >
                          Clear
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (column.columnDef?.meta as { type?: string })?.type ===
              "boolean" ? (
              <>
                <CommandInput
                  placeholder="Search"
                  onKeyDown={handleInputKeyDown}
                />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup className="max-h-[220px] max-w-[240px] overflow-y-auto">
                    {/* <CommandItem key='all' onSelect={toggleAll} className='cursor-pointer'>
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          selectedValues.length === options.length
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <CheckIcon className='h-4 w-4' />
                      </div>
                      <span className='text-body-small text-grey-text-body'>Select All</span>
                    </CommandItem> */}
                    <CommandItem
                      key="true"
                      onSelect={() => toggleOptionForUniqueValues("true")}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          selectedValue.includes("true")
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <span className="text-body-small text-grey-text-body">
                        Yes
                      </span>
                    </CommandItem>

                    <CommandItem
                      key="false"
                      onSelect={() => toggleOptionForUniqueValues("false")}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          selectedValue.includes("false")
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <span className="text-body-small text-grey-text-body">
                        No
                      </span>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup>
                    <div className="flex items-center justify-between">
                      {isPinned ? (
                        <CommandItem
                          onSelect={handleUnpinColumn}
                          className="flex-1 justify-start cursor-pointer max-w-full"
                        >
                          <Pin className="h-4 w-4 mr-2" /> Unpin
                        </CommandItem>
                      ) : (
                        <CommandItem
                          onSelect={handlePinColumn}
                          className="flex-1 justify-start cursor-pointer max-w-full"
                        >
                          <Pin className="h-4 w-4 mr-2" /> Pin to left
                        </CommandItem>
                      )}

                      {selectedValues.length > 0 && (
                        <>
                          <Separator
                            orientation="vertical"
                            className="flex min-h-6 h-full"
                          />
                          <CommandItem
                            onSelect={clearFilter}
                            className="flex-1 justify-center cursor-pointer"
                          >
                            Clear
                          </CommandItem>
                        </>
                      )}
                    </div>
                  </CommandGroup>
                </CommandList>
              </>
            ) : (column.columnDef?.meta as { type?: string })?.type ===
              "number" ? (
              <>
                <CommandList>
                  <CommandGroup className="max-h-[220px] max-w-[240px] overflow-y-auto">
                    <div className="flex items-center px-1 my-2">
                      <Select defaultValue="equal">
                        <SelectTrigger className="w-[60%] border-r-0 rounded-r-none">
                          <SelectValue placeholder="Operator" />
                        </SelectTrigger>
                        <SelectContent className="w-[60%]">
                          <SelectItem value="equal">Equal to</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        variant="inputWithSelect"
                        onChange={(e) =>
                          toggleOptionForUniqueValues(e.target.value)
                        }
                      />
                    </div>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup>
                    <div className="flex items-center justify-between">
                      {isPinned ? (
                        <CommandItem
                          onSelect={handleUnpinColumn}
                          className="flex-1 justify-start cursor-pointer max-w-full"
                        >
                          <Pin className="h-4 w-4 mr-2" /> Unpin
                        </CommandItem>
                      ) : (
                        <CommandItem
                          onSelect={handlePinColumn}
                          className="flex-1 justify-start cursor-pointer max-w-full"
                        >
                          <Pin className="h-4 w-4 mr-2" /> Pin to left
                        </CommandItem>
                      )}

                      {selectedValues.length > 0 && (
                        <>
                          <Separator
                            orientation="vertical"
                            className="flex min-h-6 h-full"
                          />
                          <CommandItem
                            onSelect={clearFilter}
                            className="flex-1 justify-center cursor-pointer"
                          >
                            Clear
                          </CommandItem>
                        </>
                      )}
                    </div>
                  </CommandGroup>
                </CommandList>
              </>
            ) : (column.columnDef?.meta as { type?: string })?.type ===
              "range" ? (
              <>
                <CommandList>
                  <CommandGroup className="max-h-[220px] max-w-[240px] overflow-y-auto">
                    <div className="flex items-center px-1 my-2">
                      <Select defaultValue="range">
                        <SelectTrigger className="w-[60%] border-r-0 rounded-r-none">
                          <SelectValue placeholder="Operator" />
                        </SelectTrigger>
                        <SelectContent className="w-[60%]">
                          <SelectItem value="range">Range</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center">
                        <Input
                          variant="inputWithSelect"
                          placeholder="Min"
                          value={minValue}
                          onChange={handleMinChange}
                          className="w-[50%] border-r-0 rounded-r-none"
                        />
                        <Input
                          variant="inputWithSelect"
                          placeholder="Max"
                          value={maxValue}
                          onChange={handleMaxChange}
                          className="w-[50%] rounded-l-none"
                        />
                      </div>
                    </div>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup>
                    <div className="flex items-center justify-between">
                      {isPinned ? (
                        <CommandItem
                          onSelect={handleUnpinColumn}
                          className="flex-1 justify-start cursor-pointer max-w-full"
                        >
                          <Pin className="h-4 w-4 mr-2" /> Unpin
                        </CommandItem>
                      ) : (
                        <CommandItem
                          onSelect={handlePinColumn}
                          className="flex-1 justify-start cursor-pointer max-w-full"
                        >
                          <Pin className="h-4 w-4 mr-2" /> Pin to left
                        </CommandItem>
                      )}

                      {selectedValues.length > 0 && (
                        <>
                          <Separator
                            orientation="vertical"
                            className="flex min-h-6 h-full"
                          />
                          <CommandItem
                            onSelect={clearFilter}
                            className="flex-1 justify-center cursor-pointer"
                          >
                            Clear
                          </CommandItem>
                        </>
                      )}
                    </div>
                  </CommandGroup>
                </CommandList>
              </>
            ) : (column.columnDef?.meta as { type?: string })?.type ===
              "string" ? (
              <>
                <CommandList>
                  <CommandGroup className="max-h-[220px] max-w-[240px] overflow-y-auto">
                    <div className="flex items-center px-1 my-2">
                      <Select defaultValue="contains">
                        <SelectTrigger className="w-[60%] border-r-0 rounded-r-none">
                          <SelectValue placeholder="Operator" />
                        </SelectTrigger>
                        <SelectContent className="w-[60%]">
                          <SelectItem value="contains">Contains</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        variant="inputWithSelect"
                        onChange={(e) =>
                          toggleOptionForUniqueValues(e.target.value)
                        }
                      />
                    </div>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup className="max-h-[220px] w-[240px] overflow-y-auto">
                    <div className="flex w-full items-center justify-between">
                      {isPinned ? (
                        <CommandItem
                          onSelect={handleUnpinColumn}
                          className="flex-1 justify-start cursor-pointer max-w-full"
                        >
                          <Pin className="h-4 w-4 mr-2" /> Unpin
                        </CommandItem>
                      ) : (
                        <CommandItem
                          onSelect={handlePinColumn}
                          className="flex-1 justify-start cursor-pointer max-w-full"
                        >
                          <Pin className="h-4 w-4 mr-2" /> Pin to left
                        </CommandItem>
                      )}

                      {selectedValues.length > 0 && (
                        <>
                          <Separator
                            orientation="vertical"
                            className="flex min-h-6 h-full"
                          />
                          <CommandItem
                            onSelect={clearFilter}
                            className="flex-1 justify-center cursor-pointer"
                          >
                            Clear
                          </CommandItem>
                        </>
                      )}
                    </div>
                  </CommandGroup>
                </CommandList>
              </>
            ) : (column.columnDef?.meta as { type?: string })?.type ===
              "actions" ? (
              <>
                <CommandInput
                  placeholder="Search"
                  onKeyDown={handleInputKeyDown}
                />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>

                  <CommandGroup className="max-h-[220px] max-w-[240px] overflow-y-auto">
                    {options.map((option, index) => {
                      const isSelected = selectedValuesTags.some(
                        (item: any) => item.value === option.value
                      );
                      // ||
                      // filters.some(
                      //   (filter: any) =>
                      //     filter.key === 'tags' && filter.value.some((item: any) => item.value === option.value)
                      // )

                      return (
                        <>
                          <CommandItem
                            key={index}
                            onSelect={() =>
                              toggleOptionForTags({
                                value: option.value,
                                reason: option.reason as string,
                              })
                            }
                            className="cursor-pointer"
                          >
                            <div
                              className={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50 [&_svg]:invisible"
                              )}
                            >
                              <CheckIcon className="h-4 w-4" />
                            </div>

                            <div className="flex items-center gap-3 w-full overflow-hidden">
                              <Tag className="h-4 w-4" color={option.color} />

                              <p
                                title={option.reason}
                                className="text-body-small text-grey-text-body truncate"
                              >
                                {option.reason}
                              </p>
                            </div>
                          </CommandItem>
                        </>
                      );
                    })}
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup>
                    <div className="flex items-center justify-between">
                      {isPinned ? (
                        <CommandItem
                          onSelect={handleUnpinColumn}
                          className="flex-1 justify-start cursor-pointer max-w-full"
                        >
                          <Pin className="h-4 w-4 mr-2" /> Unpin
                        </CommandItem>
                      ) : (
                        <CommandItem
                          onSelect={handlePinColumn}
                          className="flex-1 justify-start cursor-pointer max-w-full"
                        >
                          <Pin className="h-4 w-4 mr-2" /> Pin to left
                        </CommandItem>
                      )}

                      {selectedValues.length > 0 && (
                        <>
                          <Separator
                            orientation="vertical"
                            className="flex min-h-6 h-full"
                          />
                          <CommandItem
                            onSelect={clearFilter}
                            className="flex-1 justify-center cursor-pointer"
                          >
                            Clear
                          </CommandItem>
                        </>
                      )}
                    </div>
                  </CommandGroup>
                </CommandList>
              </>
            ) : (
              <>
                <CommandInput
                  placeholder="Search"
                  onKeyDown={handleInputKeyDown}
                />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup className="max-h-[220px] max-w-[240px] overflow-y-auto">
                    {options.length === 0 ? (
                      <PopoverSkeleton />
                    ) : (
                      options.map((option) => {
                        const isSelected =
                          (filters &&
                            filters.some(
                              (filter: any) =>
                                filter.key === column.id &&
                                filter.value.id === option.id
                            )) ||
                          selectedValues.some(
                            (value) => value.id === option.id
                          );

                        return (
                          <>
                            {option.avatar ? (
                              <CommandItem
                                key={option.id}
                                onSelect={() =>
                                  toggleOptionForArr({
                                    id: option.id,
                                    name: option.name,
                                  })
                                }
                                className="cursor-pointer"
                              >
                                <div
                                  className={cn(
                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                    isSelected
                                      ? "bg-primary text-primary-foreground"
                                      : "opacity-50 [&_svg]:invisible"
                                  )}
                                >
                                  <CheckIcon className="h-4 w-4" />
                                </div>

                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      className="object-cover"
                                      src={option.avatar}
                                      alt={option.name}
                                    />
                                    <AvatarFallback></AvatarFallback>
                                  </Avatar>
                                  <p className="text-body-small text-grey-text-body">
                                    {" "}
                                    {option.name}
                                  </p>
                                </div>
                              </CommandItem>
                            ) : (
                              <CommandItem
                                key={option.id}
                                onSelect={() =>
                                  toggleOptionForArr({
                                    id: option.id,
                                    name: option.name,
                                  })
                                }
                                className="cursor-pointer"
                              >
                                <div
                                  className={cn(
                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                    isSelected
                                      ? "bg-primary text-primary-foreground"
                                      : "opacity-50 [&_svg]:invisible"
                                  )}
                                >
                                  <CheckIcon className="h-4 w-4" />
                                </div>

                                <div className="flex items-center gap-3">
                                  <p className="text-body-small text-grey-text-body">
                                    {" "}
                                    {option.name}
                                  </p>
                                </div>
                              </CommandItem>
                            )}
                          </>
                        );
                      })
                    )}
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup>
                    <div className="flex items-center justify-between">
                      {isPinned ? (
                        <CommandItem
                          onSelect={handleUnpinColumn}
                          className="flex-1 justify-start cursor-pointer max-w-full"
                        >
                          <Pin className="h-4 w-4 mr-2" /> Unpin
                        </CommandItem>
                      ) : (
                        <CommandItem
                          onSelect={handlePinColumn}
                          className="flex-1 justify-start cursor-pointer max-w-full"
                        >
                          <Pin className="h-4 w-4 mr-2" /> Pin to left
                        </CommandItem>
                      )}

                      {selectedValues.length > 0 && (
                        <>
                          <Separator
                            orientation="vertical"
                            className="flex min-h-6 h-full"
                          />
                          <CommandItem
                            onSelect={clearFilter}
                            className="flex-1 justify-center cursor-pointer"
                          >
                            Clear
                          </CommandItem>
                        </>
                      )}
                    </div>
                  </CommandGroup>
                </CommandList>
              </>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = "MultiSelect";
