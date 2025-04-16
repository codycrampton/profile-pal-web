
import React from "react";
import { Profile } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Instagram, 
  Twitter, 
  ExternalLink, 
  FileText,
  User,
  Ruler,
  Scissors,
  Scale,
  Heart,
  Link,
  Sparkles
} from "lucide-react";
import { formatHeight } from "@/services/api";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ProfileDetailProps {
  profile: Profile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({ profile, open, onOpenChange }) => {
  const braSize = profile.braSize || profile.bra_size;
  const formattedHeight = formatHeight(profile.height, profile.isMetric);
  
  const hasMeasurements = (
    (profile.measurement_1 || profile.bust) && 
    (profile.measurement_2 || profile.waist) && 
    (profile.measurement_3 || profile.hips)
  );
  
  const instagramUrl = profile.instagram_url || (profile.instagram ? `https://instagram.com/${profile.instagram}` : "");
  const twitterUrl = profile.twitter_url || (profile.twitter ? `https://twitter.com/${profile.twitter}` : "");
  const tiktokUrl = profile.tiktok_url || (profile.tiktok ? `https://tiktok.com/@${profile.tiktok}` : "");
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {profile.name}
            {profile.isFictional === 1 && (
              <Badge variant="outline" className="ml-2 bg-purple-500/10 text-purple-500 border-purple-500/20">
                Fictional
              </Badge>
            )}
          </DialogTitle>
          {profile.work && (
            <DialogDescription className="text-sm">
              {profile.work}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4 overflow-hidden rounded-lg border dark:border-gray-700">
            {profile.photo_url || profile.imageURL ? (
              <img 
                src={profile.photo_url || profile.imageURL} 
                alt={profile.name}
                className="w-full object-cover h-[300px]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            ) : (
              <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {/* Physical details */}
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                <h3 className="text-sm font-semibold">Physical Details</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-1">
                {braSize && (
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Bra Size:</span><br />
                    <span className="font-semibold">{braSize}</span>
                  </div>
                )}
                
                {hasMeasurements && (
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Measurements:</span><br />
                    <span className="font-semibold">
                      {profile.measurement_1 || profile.bust}-
                      {profile.measurement_2 || profile.waist}-
                      {profile.measurement_3 || profile.hips}
                      {profile.isMetric === 1 ? " cm" : " in"}
                    </span>
                  </div>
                )}
                
                {formattedHeight && (
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Height:</span><br />
                    <span className="font-semibold">{formattedHeight}</span>
                  </div>
                )}
                
                {profile.weight && (
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Weight:</span><br />
                    <span className="font-semibold">
                      {profile.weight} {profile.isMetric === 1 ? "kg" : "lbs"}
                    </span>
                  </div>
                )}
                
                {profile.hairColor && (
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Hair Color:</span><br />
                    <span className="font-semibold">{profile.hairColor}</span>
                  </div>
                )}
              </div>
              
              {profile.traits && (
                <div className="pt-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Traits:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.traits.split(';').map((trait, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Separator />
            
            {/* Social Links */}
            <div className="space-y-2">
              <div className="flex items-center">
                <Link className="w-4 h-4 mr-2 text-gray-500" />
                <h3 className="text-sm font-semibold">Links</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {instagramUrl && (
                  <a 
                    href={instagramUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-blue-500 hover:underline hover:text-blue-600 transition-colors"
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    {profile.instagram || "Instagram"}
                  </a>
                )}
                
                {twitterUrl && (
                  <a 
                    href={twitterUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-blue-500 hover:underline hover:text-blue-600 transition-colors"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    {profile.twitter || "Twitter"}
                  </a>
                )}
                
                {tiktokUrl && (
                  <a 
                    href={tiktokUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-blue-500 hover:underline hover:text-blue-600 transition-colors"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {profile.tiktok || "TikTok"}
                  </a>
                )}
                
                {profile.threads && (
                  <a 
                    href={profile.threads} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-blue-500 hover:underline hover:text-blue-600 transition-colors"
                  >
                    <Scissors className="h-4 w-4 mr-2" />
                    Threads
                  </a>
                )}
                
                {profile.babepedia && (
                  <a 
                    href={profile.babepedia} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-blue-500 hover:underline hover:text-blue-600 transition-colors"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Babepedia
                  </a>
                )}
                
                {profile.wikiURL && (
                  <a 
                    href={profile.wikiURL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-blue-500 hover:underline hover:text-blue-600 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Wiki
                  </a>
                )}
              </div>
            </div>
            
            {/* Notes */}
            {profile.notes && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-gray-500" />
                    <h3 className="text-sm font-semibold">Notes</h3>
                  </div>
                  <p className="text-sm whitespace-pre-line bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                    {profile.notes}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDetail;
