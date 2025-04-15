
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
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, X, Save, Link as LinkIcon } from "lucide-react";
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
  const [cropperOpen, setCropperOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(profile?.photo_url || profile?.imageURL || "");
  const [tempImageUrl, setTempImageUrl] = useState<string>("");
  const [imageSource, setImageSource] = useState<"upload" | "url">("upload");

  // Reset form when dialog opens/closes or profile changes
  React.useEffect(() => {
    if (profile) {
      setFormData({ ...profile });
      setPreviewUrl(profile.photo_url || profile.imageURL || "");
      // Determine if the image is from URL or upload
      if (profile.imageURL && !profile.photo_url) {
        setImageSource("url");
      } else {
        setImageSource("upload");
      }
    } else {
      setFormData({ ...defaultFormData });
      setPreviewUrl("");
      setImageSource("upload");
    }
  }, [profile, open]);

  const handleInputChange = (field: keyof ProfileFormData, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update both photo_url and imageURL fields for image URL
    if (field === "imageURL" && imageSource === "url") {
      setFormData(prev => ({ ...prev, photo_url: value as string }));
      setPreviewUrl(value as string);
    }
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
    setFormData(prev => ({ 
      ...prev, 
      photo_url: croppedImageUrl,
      imageURL: croppedImageUrl
    }));
  };

  const handleImageSourceChange = (source: "upload" | "url") => {
    setImageSource(source);
    if (source === "url" && formData.imageURL) {
      setPreviewUrl(formData.imageURL);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setFormData(prev => ({ 
      ...prev, 
      imageURL: url,
      photo_url: url
    }));
    
    if (imageSource === "url") {
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
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
              <Tabs 
                defaultValue={imageSource} 
                onValueChange={(val) => handleImageSourceChange(val as "upload" | "url")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="url">URL</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="pt-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-24 w-24 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
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
                </TabsContent>
                
                <TabsContent value="url" className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <div className="h-24 w-24 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                        {previewUrl ? (
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x450?text=Error";
                            }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex">
                          <Input
                            value={formData.imageURL || ""}
                            onChange={(e) => handleImageUrlChange(e.target.value)}
                            placeholder="Image URL"
                            className="flex-1"
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Enter a valid image URL
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fictional">Type</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={formData.isFictional === 0 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange("isFictional", 0)}
                  >
                    Real
                  </Button>
                  <Button
                    type="button"
                    variant={formData.isFictional === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange("isFictional", 1)}
                  >
                    Fictional
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bra_size">Bra Size</Label>
                <Input
                  id="bra_size"
                  value={formData.braSize || formData.bra_size || ""}
                  onChange={(e) => {
                    handleInputChange("braSize", e.target.value);
                    handleInputChange("bra_size", e.target.value);
                  }}
                  placeholder="e.g. 32B"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Measurements</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Input
                    value={formData.measurement_1 !== undefined ? formData.measurement_1 : formData.bust || ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : undefined;
                      handleInputChange("measurement_1", value);
                      handleInputChange("bust", value);
                    }}
                    placeholder="Bust"
                    type="number"
                    step="0.01"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">Bust</p>
                </div>
                <div>
                  <Input
                    value={formData.measurement_2 !== undefined ? formData.measurement_2 : formData.waist || ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : undefined;
                      handleInputChange("measurement_2", value);
                      handleInputChange("waist", value);
                    }}
                    placeholder="Waist"
                    type="number"
                    step="0.01"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">Waist</p>
                </div>
                <div>
                  <Input
                    value={formData.measurement_3 !== undefined ? formData.measurement_3 : formData.hips || ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : undefined;
                      handleInputChange("measurement_3", value);
                      handleInputChange("hips", value);
                    }}
                    placeholder="Hips"
                    type="number"
                    step="0.01"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">Hips</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="underbust">Underbust</Label>
                <Input
                  id="underbust"
                  value={formData.underbust || ""}
                  onChange={(e) => handleInputChange("underbust", e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Underbust"
                  type="number"
                  step="0.01"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  value={formData.height || ""}
                  onChange={(e) => handleInputChange("height", e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Height"
                  type="number"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hairColor">Hair Color</Label>
                <Input
                  id="hairColor"
                  value={formData.hairColor || ""}
                  onChange={(e) => handleInputChange("hairColor", e.target.value)}
                  placeholder="Hair Color"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="traits">Traits</Label>
                <Input
                  id="traits"
                  value={formData.traits || ""}
                  onChange={(e) => handleInputChange("traits", e.target.value)}
                  placeholder="Traits (separated by ;)"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="work">Work/Origin</Label>
              <Input
                id="work"
                value={formData.work || ""}
                onChange={(e) => handleInputChange("work", e.target.value)}
                placeholder="Work or Origin"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Social Media</Label>
              <div className="space-y-2">
                <Input
                  value={formData.instagram_url || formData.instagram || ""}
                  onChange={(e) => {
                    handleInputChange("instagram_url", e.target.value);
                    handleInputChange("instagram", e.target.value);
                  }}
                  placeholder="Instagram URL or username"
                />
                <Input
                  value={formData.twitter_url || formData.twitter || ""}
                  onChange={(e) => {
                    handleInputChange("twitter_url", e.target.value);
                    handleInputChange("twitter", e.target.value);
                  }}
                  placeholder="Twitter URL or username"
                />
                <Input
                  value={formData.tiktok_url || formData.tiktok || ""}
                  onChange={(e) => {
                    handleInputChange("tiktok_url", e.target.value);
                    handleInputChange("tiktok", e.target.value);
                  }}
                  placeholder="TikTok URL or username"
                />
                <Input
                  value={formData.threads || ""}
                  onChange={(e) => handleInputChange("threads", e.target.value)}
                  placeholder="Threads URL or username"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="babepedia">Babepedia URL</Label>
              <Input
                id="babepedia"
                value={formData.babepedia || ""}
                onChange={(e) => handleInputChange("babepedia", e.target.value)}
                placeholder="Babepedia URL"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="wikiURL">Wiki URL</Label>
              <Input
                id="wikiURL"
                value={formData.wikiURL || ""}
                onChange={(e) => handleInputChange("wikiURL", e.target.value)}
                placeholder="Wiki URL"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional notes"
              />
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
