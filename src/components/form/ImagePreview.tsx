
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImagePreviewProps {
  previewUrl: string;
  imageURL: string;
  onImageUrlChange: (url: string) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  previewUrl,
  imageURL,
  onImageUrlChange,
}) => {
  return (
    <div className="space-y-2">
      <Label>Profile Image URL</Label>
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
              value={imageURL || ""}
              onChange={(e) => onImageUrlChange(e.target.value)}
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
  );
};

export default ImagePreview;
