
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortDirection, SortField, FilterOptions } from "@/types";
import { Label } from "@/components/ui/label";
import { ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface SortFilterControlsProps {
  sortField: SortField;
  sortDirection: SortDirection;
  filterOptions: FilterOptions;
  onSortFieldChange: (field: SortField) => void;
  onSortDirectionChange: (direction: SortDirection) => void;
  onFilterChange: (filters: FilterOptions) => void;
  onResetFilters: () => void;
  availableTraits: string[];
  availableHairColors: string[];
}

const SortFilterControls: React.FC<SortFilterControlsProps> = ({
  sortField,
  sortDirection,
  filterOptions,
  onSortFieldChange,
  onSortDirectionChange,
  onFilterChange,
  onResetFilters,
  availableTraits,
  availableHairColors,
}) => {
  const handleToggleSortDirection = () => {
    onSortDirectionChange(sortDirection === "asc" ? "desc" : "asc");
  };

  const handleTraitFilterChange = (trait: string) => {
    onFilterChange({
      ...filterOptions,
      traits: trait
    });
  };

  const handleHairColorFilterChange = (color: string) => {
    onFilterChange({
      ...filterOptions,
      hairColor: color
    });
  };

  const handleFictionalStatusChange = (status: number | undefined) => {
    onFilterChange({
      ...filterOptions,
      isFictional: status
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 items-center">
      <div className="flex items-center gap-2">
        <Label htmlFor="sort-field" className="whitespace-nowrap">Sort by:</Label>
        <Select
          value={sortField}
          onValueChange={(value) => onSortFieldChange(value as SortField)}
        >
          <SelectTrigger id="sort-field" className="w-[160px]">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="braSize">Bra Size</SelectItem>
            <SelectItem value="bust">Bust</SelectItem>
            <SelectItem value="height">Height</SelectItem>
            <SelectItem value="traits">Traits</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleToggleSortDirection}
          className="min-w-8 h-8"
        >
          <ArrowDownUp className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
          <span className="sr-only">
            {sortDirection === "asc" ? "Sort ascending" : "Sort descending"}
          </span>
        </Button>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            Filters
            {Object.values(filterOptions).some(val => val !== undefined) && (
              <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
                {Object.values(filterOptions).filter(val => val !== undefined).length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Filter Options</h4>
            
            <div className="space-y-2">
              <Label>Character Type</Label>
              <div className="flex gap-2">
                <Button 
                  variant={filterOptions.isFictional === 0 ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleFictionalStatusChange(0)}
                >
                  Real
                </Button>
                <Button 
                  variant={filterOptions.isFictional === 1 ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleFictionalStatusChange(1)}
                >
                  Fictional
                </Button>
                <Button 
                  variant={filterOptions.isFictional === undefined ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleFictionalStatusChange(undefined)}
                >
                  All
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Traits</Label>
              <Select
                value={filterOptions.traits || ""}
                onValueChange={(value) => handleTraitFilterChange(value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trait" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All traits</SelectItem>
                  {availableTraits.map(trait => (
                    <SelectItem key={trait} value={trait}>{trait}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Hair Color</Label>
              <Select
                value={filterOptions.hairColor || ""}
                onValueChange={(value) => handleHairColorFilterChange(value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hair color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All colors</SelectItem>
                  {availableHairColors.map(color => (
                    <SelectItem key={color} value={color}>{color}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm" onClick={onResetFilters} className="w-full">
              Reset Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SortFilterControls;
