
import React from "react";
import { Profile } from "@/types";

interface MeasurementDisplayProps {
  profile: Profile;
  className?: string;
}

const MeasurementDisplay: React.FC<MeasurementDisplayProps> = ({ profile, className = "" }) => {
  const hasBraSize = !!profile.bra_size;
  const hasMeasurements = 
    profile.measurement_1 !== undefined && 
    profile.measurement_2 !== undefined && 
    profile.measurement_3 !== undefined;

  if (!hasBraSize && !hasMeasurements) {
    return null;
  }

  return (
    <div className={`text-sm ${className}`}>
      {hasBraSize && (
        <div className="mb-1">
          <span className="font-semibold">Bra Size:</span> {profile.bra_size}
        </div>
      )}
      
      {hasMeasurements && (
        <div className="flex items-center space-x-1">
          <span className="font-semibold">Measurements:</span>
          <span>{profile.measurement_1}-{profile.measurement_2}-{profile.measurement_3}</span>
        </div>
      )}
    </div>
  );
};

export default MeasurementDisplay;
