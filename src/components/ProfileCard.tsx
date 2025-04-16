
import React from "react";
import { Profile } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import MeasurementDisplay from "./MeasurementDisplay";
import SocialLinks from "./SocialLinks";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatHeight } from "@/services/api";

interface ProfileCardProps {
  profile: Profile;
  onEdit?: (profile: Profile) => void;
  onDelete?: (profile: Profile) => void;
  onClick?: (profile: Profile) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  onEdit, 
  onDelete,
  onClick
}) => {
  const braSize = profile.braSize || profile.bra_size;
  const formattedHeight = formatHeight(profile.height, profile.isMetric);
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow animate-fade-in dark:bg-gray-800 dark:border-gray-700 h-full flex flex-col"
      onClick={() => onClick && onClick(profile)}
    >
      <div className="relative h-80 overflow-hidden bg-gray-100 dark:bg-gray-700">
        {profile.photo_url || profile.imageURL ? (
          <img 
            src={profile.photo_url || profile.imageURL} 
            alt={profile.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
            <span className="text-gray-400 dark:text-gray-500">No Image</span>
          </div>
        )}
        {braSize && (
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
            {braSize}
          </div>
        )}
        {profile.isFictional === 1 && (
          <div className="absolute top-2 left-2 bg-purple-600/90 text-white px-2 py-1 rounded text-sm">
            Fictional
          </div>
        )}
      </div>
      
      <CardContent className="p-4 dark:text-gray-100 flex-grow">
        <h3 className="font-semibold text-lg truncate">{profile.name}</h3>
        <MeasurementDisplay profile={profile} className="mt-2" />
        
        {formattedHeight && (
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Height:</span> {formattedHeight}
          </div>
        )}
        
        {profile.hairColor && (
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Hair:</span> {profile.hairColor}
          </div>
        )}
        
        {profile.traits && (
          <div className="mt-2 flex flex-wrap gap-1">
            {profile.traits.split(';').map((trait, index) => (
              <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded">
                {trait}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-4 py-3 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
        <SocialLinks profile={profile} />
        
        <div className="flex space-x-2">
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(profile);
              }}
              className="dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          
          {onDelete && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 dark:border-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(profile);
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
