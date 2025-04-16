
import React from "react";
import { Profile, GridSize } from "@/types";
import ProfileCard from "./ProfileCard";

interface ProfileListProps {
  profiles: Profile[];
  gridSize: GridSize;
  onProfileEdit?: (profile: Profile) => void;
  onProfileDelete?: (profile: Profile) => void;
  onProfileClick?: (profile: Profile) => void;
}

const ProfileList: React.FC<ProfileListProps> = ({
  profiles,
  gridSize,
  onProfileEdit,
  onProfileDelete,
  onProfileClick,
}) => {
  // Map grid size to tailwind class
  const getGridClass = () => {
    switch (gridSize) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      case 5:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
      case 6:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6";
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    }
  };

  if (profiles.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        No profiles found
      </div>
    );
  }

  return (
    <div className={`grid ${getGridClass()} gap-4 md:gap-6`}>
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          onEdit={onProfileEdit}
          onDelete={onProfileDelete}
          onClick={onProfileClick}
        />
      ))}
    </div>
  );
};

export default ProfileList;
