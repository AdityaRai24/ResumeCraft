import React from "react";
import { Button } from "./ui/button";
import { 
  GraduationCap, 
  Trophy, 
  Award, 
  FileText, 
  Heart, 
  Plus,
  BookOpen,
  Star,
  Users,
  Briefcase
} from "lucide-react";

interface CustomSectionTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
  onClose: () => void;
}

const sectionTypes = [
  {
    id: "courses",
    label: "Courses",
    icon: GraduationCap,
    description: "Online courses, workshops, training programs"
  },
  {
    id: "achievements",
    label: "Achievements",
    icon: Trophy,
    description: "Personal or professional accomplishments"
  },
  {
    id: "certifications",
    label: "Certifications",
    icon: FileText,
    description: "Professional certifications and licenses"
  },
  {
    id: "awards",
    label: "Awards",
    icon: Award,
    description: "Recognition, honors, and awards"
  },
  {
    id: "volunteer",
    label: "Volunteer Work",
    icon: Heart,
    description: "Community service and volunteer activities"
  },
  {
    id: "publications",
    label: "Publications",
    icon: BookOpen,
    description: "Articles, papers, blogs, or research"
  },
  {
    id: "languages",
    label: "Languages",
    icon: Users,
    description: "Language skills and proficiency"
  },
  {
    id: "interests",
    label: "Interests",
    icon: Star,
    description: "Hobbies, interests, and activities"
  },
  {
    id: "other",
    label: "Other",
    icon: Plus,
    description: "Any other custom section"
  }
];

const CustomSectionTypeSelector: React.FC<CustomSectionTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Select Section Type</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </Button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Choose the type of section to help generate more relevant content:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectionTypes.map((type) => {
            const IconComponent = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <button
                key={type.id}
                onClick={() => {
                  onTypeSelect(type.id);
                  onClose();
                }}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                  isSelected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <IconComponent 
                    className={`w-6 h-6 mt-1 ${
                      isSelected ? "text-primary" : "text-gray-500"
                    }`} 
                  />
                  <div>
                    <h3 className={`font-medium ${
                      isSelected ? "text-primary" : "text-gray-900"
                    }`}>
                      {type.label}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      isSelected ? "text-primary/70" : "text-gray-500"
                    }`}>
                      {type.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="mr-2"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomSectionTypeSelector; 