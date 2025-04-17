
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MeasurementsInputProps {
  bust: number | string | undefined;
  waist: number | string | undefined;
  hips: number | string | undefined;
  measurement1: number | string | undefined;
  measurement2: number | string | undefined;
  measurement3: number | string | undefined;
  onChange: (field: string, value: number | undefined) => void;
}

const MeasurementsInput: React.FC<MeasurementsInputProps> = ({
  bust,
  waist,
  hips,
  measurement1,
  measurement2,
  measurement3,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <Label>Measurements</Label>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Input
            value={measurement1 !== undefined ? measurement1 : bust || ""}
            onChange={(e) => {
              const value = e.target.value ? parseFloat(e.target.value) : undefined;
              onChange("measurement_1", value);
              onChange("bust", value);
            }}
            placeholder="Bust"
            type="number"
            step="0.01"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">Bust</p>
        </div>
        <div>
          <Input
            value={measurement2 !== undefined ? measurement2 : waist || ""}
            onChange={(e) => {
              const value = e.target.value ? parseFloat(e.target.value) : undefined;
              onChange("measurement_2", value);
              onChange("waist", value);
            }}
            placeholder="Waist"
            type="number"
            step="0.01"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">Waist</p>
        </div>
        <div>
          <Input
            value={measurement3 !== undefined ? measurement3 : hips || ""}
            onChange={(e) => {
              const value = e.target.value ? parseFloat(e.target.value) : undefined;
              onChange("measurement_3", value);
              onChange("hips", value);
            }}
            placeholder="Hips"
            type="number"
            step="0.01"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">Hips</p>
        </div>
      </div>
    </div>
  );
};

export default MeasurementsInput;
