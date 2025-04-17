
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Profile, ProfileFormData } from "@/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { X, Save } from "lucide-react";

// Import the sub-components
import FormField from "./form/FormField";
import ImagePreview from "./form/ImagePreview";
import ProfileTypeSelector from "./form/ProfileTypeSelector";
import MeasurementsInput from "./form/MeasurementsInput";
import PhysicalAttributesInput from "./form/PhysicalAttributesInput";
import SocialMediaInput from "./form/SocialMediaInput";

interface ProfileFormProps {
  profile?: Profile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProfileFormData) => void;
}

const defaultFormData: ProfileFormData = {
  name: "",
  photo_url: "",
  braSize: "",
  bra_size: "",
  measurement_1: undefined,
  measurement_2: undefined,
  measurement_3: undefined,
  bust: undefined,
  waist: undefined,
  hips: undefined,
  instagram_url: "",
  instagram: "",
  twitter_url: "",
  twitter: "",
  tiktok_url: "",
  tiktok: "",
  babepedia: "",
  imageURL: "",
  isFictional: 0,
  work: "",
  wikiURL: "",
  notes: "",
  isMetric: 0,
  traits: "",
  hairColor: "",
  height: undefined,
  weight: undefined,
  underbust: undefined,
  threads: ""
};

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ProfileFormData>(
    profile ? { ...profile } : { ...defaultFormData }
  );
  const [previewUrl, setPreviewUrl] = useState<string>(profile?.photo_url || profile?.imageURL || "");

  // Reset form when dialog opens/closes or profile changes
  React.useEffect(() => {
    if (profile) {
      setFormData({ ...profile });
      setPreviewUrl(profile.photo_url || profile.imageURL || "");
    } else {
      setFormData({ ...defaultFormData });
      setPreviewUrl("");
    }
  }, [profile, open]);

  const handleInputChange = (field: keyof ProfileFormData, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update both photo_url and imageURL fields for image URL
    if (field === "imageURL") {
      setFormData(prev => ({ ...prev, photo_url: value as string }));
      setPreviewUrl(value as string);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setFormData(prev => ({ 
      ...prev, 
      imageURL: url,
      photo_url: url
    }));
    
    setPreviewUrl(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {profile ? "Edit Profile" : "Create New Profile"}
          </DialogTitle>
          <DialogDescription>
            Fill out the form to {profile ? "update" : "create"} a profile
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <FormField 
            id="name"
            label="Name"
            value={formData.name}
            onChange={(value) => handleInputChange("name", value)}
            placeholder="Profile name"
            required={true}
          />
          
          <ImagePreview 
            previewUrl={previewUrl}
            imageURL={formData.imageURL || ""}
            onImageUrlChange={handleImageUrlChange}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileTypeSelector 
              isFictional={formData.isFictional || 0}
              onChange={(value) => handleInputChange("isFictional", value)}
            />
            
            <FormField 
              id="bra_size"
              label="Bra Size"
              value={formData.braSize || formData.bra_size || ""}
              onChange={(value) => {
                handleInputChange("braSize", value);
                handleInputChange("bra_size", value);
              }}
              placeholder="e.g. 32B"
            />
          </div>
          
          <MeasurementsInput 
            bust={formData.bust}
            waist={formData.waist}
            hips={formData.hips}
            measurement1={formData.measurement_1}
            measurement2={formData.measurement_2}
            measurement3={formData.measurement_3}
            onChange={handleInputChange}
          />
          
          <PhysicalAttributesInput 
            underbust={formData.underbust}
            height={formData.height}
            hairColor={formData.hairColor}
            traits={formData.traits}
            onChange={handleInputChange}
          />
          
          <FormField 
            id="work"
            label="Work/Origin"
            value={formData.work}
            onChange={(value) => handleInputChange("work", value)}
            placeholder="Work or Origin"
          />
          
          <SocialMediaInput 
            instagram={formData.instagram_url || formData.instagram || ""}
            twitter={formData.twitter_url || formData.twitter || ""}
            tiktok={formData.tiktok_url || formData.tiktok || ""}
            threads={formData.threads || ""}
            onChange={handleInputChange}
          />
          
          <FormField 
            id="babepedia"
            label="Babepedia URL"
            value={formData.babepedia}
            onChange={(value) => handleInputChange("babepedia", value)}
            placeholder="Babepedia URL"
          />
          
          <FormField 
            id="wikiURL"
            label="Wiki URL"
            value={formData.wikiURL}
            onChange={(value) => handleInputChange("wikiURL", value)}
            placeholder="Wiki URL"
          />
          
          <FormField 
            id="notes"
            label="Notes"
            value={formData.notes}
            onChange={(value) => handleInputChange("notes", value)}
            placeholder="Additional notes"
          />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {profile ? "Update Profile" : "Create Profile"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileForm;
