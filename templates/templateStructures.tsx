import { ResumeTemplate } from "@/types/templateTypes";
import Template1 from "@/templates/template1/Template1";
import Template2 from "@/templates/template2/Template2";
import Template3 from "./template3/Template3";
import Template4 from "./template4/Template4";
import temp1EmptyObj from "./template1/temp1EmptyObj";
import temp2EmptyObj from "./template2/temp2EmptyObj";
import temp3EmptyObj from "./template3/temp3EmptyObj";
import temp4EmptyObj from "./template4/temp4EmptyObj";


export type TemplateComponentType = React.ComponentType<{
  obj: ResumeTemplate;
  isPreview: boolean;
  size: "sm" | "md" | "lg";
}>;

export const templateComponents: Record<string, TemplateComponentType> = {
  Template1: Template1,
  Template2: Template2,
  Template3: Template3,
  Template4: Template4,
};

export const templateEmptyComponents: Record<string, any> = {
  Template1: temp1EmptyObj,
  Template2: temp2EmptyObj,
  Template3: temp3EmptyObj,
  Template4: temp4EmptyObj,
};

export const premiumTemplates = ["Template2","Template4"];
