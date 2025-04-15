
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Profile, ProfileFormData } from "@/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Upload, X, Save } from "lucide-react";
import ImageCropper from "./ImageCropper";

interface ProfileFormProps {
  profile?: Profile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProfileFormData) => void;
}

const defaultFormData: ProfileFormData = {
  name: "",
  photo_url: "",
  bra_size: "",
  measurement_1: undefined,
  measurement_2: undefined,
  measurement_3: undefined,
  instagram_url: "",
  twitter_url: "",
  tiktok_url: "",
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
  const [cropperOpen, setCropperOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(profile?.photo_url || "");
  const [tempImageUrl, setTempImageUrl] = useState<string>("");

  // Reset form when dialog opens/closes or profile changes
  React.useEffect(() => {
    if (profile) {
      setFormData({ ...profile });
      setPreviewUrl(profile.photo_url);
    } else {
      setFormData({ ...defaultFormData });
      setPreviewUrl("");
    }
  }, [profile, open]);

  const handleInputChange = (field: keyof ProfileFormData, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        setTempImageUrl(reader.result as string);
        setCropperOpen(true);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setPreviewUrl(croppedImageUrl);
    setFormData(prev => ({ ...prev, photo_url: croppedImageUrl }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {profile ? "Edit Profile" : "Create New Profile"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Profile name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Photo</Label>
              <div className="flex items-center space-x-4">
                <div className="h-24 w-24 bg-gray-100 rounded-md overflow-hidden">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                
                <div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    className="mb-2"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bra_size">Bra Size (Optional)</Label>
                <Input
                  id="bra_size"
                  value={formData.bra_size || ""}
                  onChange={(e) => handleInputChange("bra_size", e.target.value)}
                  placeholder="e.g. 32B"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Measurements (Optional)</Label>
                <div className="flex space-x-2">
                  <Input
                    value={formData.measurement_1 || ""}
                    onChange={(e) => handleInputChange("measurement_1", e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Bust"
                    type="number"
                  />
                  <Input
                    value={formData.measurement_2 || ""}
                    onChange={(e) => handleInputChange("measurement_2", e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Waist"
                    type="number"
                  />
                  <Input
                    value={formData.measurement_3 || ""}
                    onChange={(e) => handleInputChange("measurement_3", e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Hips"
                    type="number"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Social Media (Optional)</Label>
              <div className="space-y-2">
                <Input
                  value={formData.instagram_url || ""}
                  onChange={(e) => handleInputChange("instagram_url", e.target.value)}
                  placeholder="Instagram URL"
                />
                <Input
                  value={formData.twitter_url || ""}
                  onChange={(e) => handleInputChange("twitter_url", e.target.value)}
                  placeholder="Twitter URL"
                />
                <Input
                  value={formData.tiktok_url || ""}
                  onChange={(e) => handleInputChange("tiktok_url", e.target.value)}
                  placeholder="TikTok URL"
                />
              </div>
            </div>
            
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
      
      <ImageCropper
        imageUrl={tempImageUrl}
        onCropComplete={handleCropComplete}
        open={cropperOpen}
        onOpenChange={setCropperOpen}
      />
    </>
  );
};

export default ProfileForm;
