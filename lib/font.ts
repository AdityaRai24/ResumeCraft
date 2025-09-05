import {
  Inter,
  Montserrat,
  Open_Sans,
  Poppins,
  Raleway,
  Geologica,
  Roboto,
} from "next/font/google";

export type FontName =
  | "Inter"
  | "Montserrat"
  | "OpenSans"
  | "Poppins"
  | "Raleway"
  | "Geologica"
  | "TimesNewRoman";

export const interFont = Inter({ subsets: ["latin"] });
export const montserratFont = Montserrat({ subsets: ["latin"] });
export const openSansFont = Open_Sans({ subsets: ["latin"] });
export const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
export const ralewayFont = Raleway({ subsets: ["latin"] });
export const geologicaFont = Geologica({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
export const robotoFont = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});
export const fontOptions = [
  "Roboto",
  "Raleway",
  "Inter",
  "OpenSans",
  "Poppins",
  "Montserrat",
  "Geologica",
  "TimesNewRoman",
];

// Utility function to get font class based on font name
export const getFontClass = (fontName?: string): string => {
  switch (fontName) {
    case "Inter":
      return interFont.className;
    case "Montserrat":
      return montserratFont.className;
    case "OpenSans":
      return openSansFont.className;
    case "Poppins":
      return poppinsFont.className;
    case "Geologica":
      return geologicaFont.className;
    case "Raleway":
      return ralewayFont.className;
    case "Roboto":
      return robotoFont.className;
    case "TimesNewRoman":
      return "font-times-new-roman";
    default:
      return ""; // No font class applied
  }
};