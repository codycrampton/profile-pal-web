
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GridSize } from "@/types";
import { Grid2X2, Grid3X3, Grid4X4 } from "lucide-react";

interface GridSizeControlProps {
  value: GridSize;
  onChange: (size: GridSize) => void;
}

const GridSizeControl: React.FC<GridSizeControlProps> = ({ value, onChange }) => {
  return (
    <ToggleGroup type="single" value={value.toString()} onValueChange={(val) => {
      if (val) onChange(parseInt(val) as GridSize);
    }}>
      <ToggleGroupItem value="1" aria-label="One column">
        <Grid2X2 className="h-4 w-4" />
      </ToggleGroupItem>
      
      <ToggleGroupItem value="2" aria-label="Two columns">
        <Grid2X2 className="h-4 w-4" />
      </ToggleGroupItem>
      
      <ToggleGroupItem value="3" aria-label="Three columns">
        <Grid3X3 className="h-4 w-4" />
      </ToggleGroupItem>
      
      <ToggleGroupItem value="4" aria-label="Four columns">
        <Grid4X4 className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default GridSizeControl;
