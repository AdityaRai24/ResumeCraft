import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Linkedin, Globe, Twitter, Instagram, Link } from 'lucide-react';

interface SocialLinkFieldProps {
  value: { type: string; url: string };
  onChange: (value: { type: string; url: string }) => void;
  onRemove: () => void;
}

const socialOptions = [
  { value: 'github', label: 'GitHub', icon: Github },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'portfolio', label: 'Portfolio', icon: Globe },
  { value: 'twitter', label: 'Twitter', icon: Twitter },
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'other', label: 'Other', icon: Link },
];

const SocialLinkField: React.FC<SocialLinkFieldProps> = ({ value, onChange, onRemove }) => {
  const handleTypeChange = (newType: string) => {
    onChange({ ...value, type: newType });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, url: e.target.value });
  };

  const selectedOption = socialOptions.find(option => option.value === value.type) || socialOptions[socialOptions.length - 1];
  const Icon = selectedOption.icon;

  return (
    <div className="flex items-end space-x-2">
      <div className="flex-1">
        <Label htmlFor="socialType">Social Link</Label>
        <Select value={value.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select social link type" />
          </SelectTrigger>
          <SelectContent>
            {socialOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center">
                  <option.icon className="mr-2 h-4 w-4" />
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-[2]">
        <Label htmlFor="socialUrl">URL</Label>
        <div className="flex items-center">
          <Icon className="mr-2 h-4 w-4" />
          <Input
            id="socialUrl"
            value={value.url}
            onChange={handleUrlChange}
            placeholder={`Enter your ${selectedOption.label} URL`}
            className="flex-1"
          />
        </div>
      </div>
      <button type="button" onClick={onRemove} className="text-red-500 hover:text-red-700">
        Remove
      </button>
    </div>
  );
};

export default SocialLinkField;