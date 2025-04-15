
import React from "react";
import { Instagram, Twitter, MessageCircle } from "lucide-react";
import { Profile } from "@/types";

interface SocialLinksProps {
  profile: Profile;
  className?: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ profile, className = "" }) => {
  const hasSocialLinks = 
    !!profile.instagram_url || 
    !!profile.twitter_url || 
    !!profile.tiktok_url;

  if (!hasSocialLinks) {
    return null;
  }

  return (
    <div className={`flex space-x-4 ${className}`}>
      {profile.instagram_url && (
        <a 
          href={profile.instagram_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-profile-purple transition-colors"
        >
          <Instagram size={20} />
        </a>
      )}
      
      {profile.twitter_url && (
        <a 
          href={profile.twitter_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-profile-purple transition-colors"
        >
          <Twitter size={20} />
        </a>
      )}
      
      {profile.tiktok_url && (
        <a 
          href={profile.tiktok_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-profile-purple transition-colors"
        >
          <MessageCircle size={20} />
        </a>
      )}
    </div>
  );
};

export default SocialLinks;
