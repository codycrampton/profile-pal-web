
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Grid, 
  Grid2X2, 
  Grid3X3, 
  LayoutGrid
} from "lucide-react";
import { GridSize } from "@/types";

interface GridSizeControlProps {
  value: GridSize;
  onChange: (size: GridSize) => void;
}

const GridSizeControl: React.FC<GridSizeControlProps> = ({ value, onChange }) => {
  return (
    <div className="flex space-x-1">
      <Button
        variant={value === 1 ? "default" : "outline"}
        size="icon"
        className="w-8 h-8"
        onClick={() => onChange(1)}
        title="Single column"
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant={value === 2 ? "default" : "outline"}
        size="icon"
        className="w-8 h-8"
        onClick={() => onChange(2)}
        title="Two columns"
      >
        <Grid2X2 className="h-4 w-4" />
      </Button>
      <Button
        variant={value === 3 ? "default" : "outline"}
        size="icon"
        className="w-8 h-8"
        onClick={() => onChange(3)}
        title="Three columns"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      <Button
        variant={value === 4 ? "default" : "outline"}
        size="icon"
        className="w-8 h-8"
        onClick={() => onChange(4)}
        title="Four columns"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default GridSizeControl;
