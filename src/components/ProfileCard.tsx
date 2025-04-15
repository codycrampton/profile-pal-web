
import React from "react";
import { Profile } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import MeasurementDisplay from "./MeasurementDisplay";
import SocialLinks from "./SocialLinks";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow animate-fade-in"
      onClick={() => onClick && onClick(profile)}
    >
      <div className="relative h-80 overflow-hidden bg-gray-100">
        <img 
          src={profile.photo_url} 
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        {profile.bra_size && (
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
            {profile.bra_size}
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate">{profile.name}</h3>
        <MeasurementDisplay profile={profile} className="mt-2" />
      </CardContent>
      
      <CardFooter className="px-4 py-3 bg-gray-50 flex justify-between items-center">
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
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          
          {onDelete && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
