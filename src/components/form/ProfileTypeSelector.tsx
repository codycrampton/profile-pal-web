
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ProfileTypeSelectorProps {
  isFictional: number;
  onChange: (value: number) => void;
}

const ProfileTypeSelector: React.FC<ProfileTypeSelectorProps> = ({
  isFictional,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="fictional">Type</Label>
      <div className="flex space-x-2">
        <Button
          type="button"
          variant={isFictional === 0 ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(0)}
        >
          Real
        </Button>
        <Button
          type="button"
          variant={isFictional === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(1)}
        >
          Fictional
        </Button>
      </div>
    </div>
  );
};

export default ProfileTypeSelector;
