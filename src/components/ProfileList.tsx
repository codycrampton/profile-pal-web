
import React from "react";
import { Profile } from "@/types";
import ProfileCard from "./ProfileCard";

interface ProfileListProps {
  profiles: Profile[];
  onProfileEdit?: (profile: Profile) => void;
  onProfileDelete?: (profile: Profile) => void;
  onProfileClick?: (profile: Profile) => void;
}

const ProfileList: React.FC<ProfileListProps> = ({
  profiles,
  onProfileEdit,
  onProfileDelete,
  onProfileClick,
}) => {
  if (profiles.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No profiles found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
