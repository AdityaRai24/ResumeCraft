import { Inter, Montserrat, Open_Sans, Poppins, Raleway, Geologica } from 'next/font/google';

export type FontName = 'Inter' | 'Montserrat' | 'OpenSans' | 'Poppins' | 'Raleway' | 'Geologica';

const interFont = Inter({ subsets: ["latin"] });
const montserratFont = Montserrat({ subsets: ["latin"] });
const openSansFont = Open_Sans({ subsets: ["latin"] });
const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const ralewayFont = Raleway({ subsets: ["latin"] });
const geologicaFont = Geologica({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});


export const fontMap: Record<FontName, { className: string }> = {
  Inter: interFont,
  Montserrat: montserratFont,
  OpenSans: openSansFont,
  Poppins: poppinsFont,
  Raleway: ralewayFont,
  Geologica: geologicaFont
};