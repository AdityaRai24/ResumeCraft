import useMobile from "@/lib/useMobile";
import { cn } from "@/lib/utils";

const TemplateWrapper = ({
  children,
  size,
}: {
  children: React.ReactNode;
  size: "sm" | "md" | "lg";
}) => {
  const isMobile = useMobile();

  return (
    <div
      className={cn(
        "transform origin-top-left",
        isMobile
          ? size === "sm"
            ? "scale-[0.2]"
            : size === "md"
              ? "scale-[0.5]"
              : "scale-[0.42] print:scale-100"
          : size === "sm"
            ? "scale-[0.37]"
            : size === "md"
              ? "scale-[0.5]"
              : "scale-[1]"
      )}
    >
      {children}
    </div>
  );
};

export default TemplateWrapper;
