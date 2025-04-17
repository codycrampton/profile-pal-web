
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhysicalAttributesInputProps {
  underbust: number | string | undefined;
  height: number | string | undefined;
  hairColor: string | null | undefined;
  traits: string | undefined;
  onChange: (field: string, value: string | number | undefined) => void;
}

const PhysicalAttributesInput: React.FC<PhysicalAttributesInputProps> = ({
  underbust,
  height,
  hairColor,
  traits,
  onChange,
}) => {
  return (
    <React.Fragment>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="underbust">Underbust</Label>
          <Input
            id="underbust"
            value={underbust || ""}
            onChange={(e) => onChange("underbust", e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="Underbust"
            type="number"
            step="0.01"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            value={height || ""}
            onChange={(e) => onChange("height", e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="Height (decimal, eg. 5.8 for 5'8\")"
            type="number"
            step="0.01"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hairColor">Hair Color</Label>
          <Input
            id="hairColor"
            value={hairColor || ""}
            onChange={(e) => onChange("hairColor", e.target.value)}
            placeholder="Hair Color"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="traits">Traits</Label>
          <Input
            id="traits"
            value={traits || ""}
            onChange={(e) => onChange("traits", e.target.value)}
            placeholder="Traits (separated by ;)"
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default PhysicalAttributesInput;
