interface TipsType {
  sec: string;
  topText: string;
  mainText: string;
  bottomMainText?: string;
  bottomText?: string;
}

export const tipsData: TipsType[] = [
  {
    sec: "header",
    topText: "Welcome! Let's Get Started",
    mainText: "You're ready to create your resume",
    bottomMainText: "Our tools will guide you through each step.",
    bottomText:
      "Start by filling in your basic information and let our AI assist you along the way.",
  },

  {
    sec: "experience",
    topText: "Great progress! Next up → Experience",
    mainText: "Add details about your work experience",
    bottomMainText: "Our AI now makes writing easier!",
    bottomText:
      "With writing help you can fix mistakes or rephrase sentences to suit your needs",
  },
  {
    sec: "education",
    topText: "Great Job !! Next up → Education",
    mainText: "Now let's add your education",
    bottomMainText: "Highlight your academic achievements!",
    bottomText:
      "Include your degrees, certifications, and any relevant coursework.",
  },
  {
    sec: "skills",
    topText: "Great progress! Next up → Skills",
    mainText: "Time to showcase your skills",
    bottomMainText: "Optimize your skills section for maximum impact.",
    bottomText:
      "Use our pre-written suggestions to highlight your strengths and get your resume to the top of the pile.",
  },
  {
    sec: "projects",
    topText: "Almost there! Next up → Projects",
    mainText: "Highlight the projects you've worked on",
    bottomMainText:
      "Including projects helps demonstrate your practical experience.",
    bottomText:
      "You can add personal, academic, or professional projects to show your skills in action.",
  },
];
