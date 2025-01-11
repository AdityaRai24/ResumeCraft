import React from "react";
import { Crown, Star } from "lucide-react";

const TemplateBadge = ({
  type,
  position = "left",
}: {
  type: "premium" | "popular";
  position?: "left" | "right";
}) => {
  const isPremium = type === "premium";
  return (
    <div
      className={`absolute -top-2 ${position === "left" ? "-left-2" : "-right-2"} z-10 
        ${isPremium ? "bg-primary" : "bg-amber-500"} 
        text-white px-2 py-1 rounded-md flex items-center gap-1.5 text-xs font-medium
        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2),0_2px_4px_-2px_rgba(0,0,0,0.1)]
        hover:shadow-[0_6px_8px_-1px_rgba(0,0,0,0.3),0_4px_6px_-2px_rgba(0,0,0,0.15)]
        transition-shadow duration-200`}
    >
      {isPremium ? (
        <>
          <Crown className="h-3 w-3" />
          Premium
        </>
      ) : (
        <>
          <Star className="h-3 w-3" />
          Popular
        </>
      )}
    </div>
  );
};

const TemplateContainer = ({
  premium,
  children,
}: {
  premium: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative group mx-auto w-[159px] h-[225px] md:w-[295px] md:h-[415px] transition-transform duration-300">
      {premium && (
        <>
          <TemplateBadge type="premium" position="right" />
        </>
      )}
      {children}
    </div>
  );
};

export default TemplateContainer;
