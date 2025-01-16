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
  | "Geologica";

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
];
