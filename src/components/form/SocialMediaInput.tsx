
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SocialMediaInputProps {
  instagram: string;
  twitter: string;
  tiktok: string;
  threads: string;
  onChange: (field: string, value: string) => void;
}

const SocialMediaInput: React.FC<SocialMediaInputProps> = ({
  instagram,
  twitter,
  tiktok,
  threads,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <Label>Social Media</Label>
      <div className="space-y-2">
        <Input
          value={instagram || ""}
          onChange={(e) => {
            onChange("instagram_url", e.target.value);
            onChange("instagram", e.target.value);
          }}
          placeholder="Instagram URL or username"
        />
        <Input
          value={twitter || ""}
          onChange={(e) => {
            onChange("twitter_url", e.target.value);
            onChange("twitter", e.target.value);
          }}
          placeholder="Twitter URL or username"
        />
        <Input
          value={tiktok || ""}
          onChange={(e) => {
            onChange("tiktok_url", e.target.value);
            onChange("tiktok", e.target.value);
          }}
          placeholder="TikTok URL or username"
        />
        <Input
          value={threads || ""}
          onChange={(e) => onChange("threads", e.target.value)}
          placeholder="Threads URL or username"
        />
      </div>
    </div>
  );
};

export default SocialMediaInput;
