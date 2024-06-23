import { Poppins, Montserrat, Paytone_One } from "next/font/google";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const montserrat = Montserrat({
  subsets: ["latin"],
});

export const partyone = Paytone_One({
  subsets: ["latin"],
  weight: "400",
})