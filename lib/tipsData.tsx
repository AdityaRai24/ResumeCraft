interface TipsType {
  sec: string;
  topText: string;
  mainText: string;
  bottomMainText?: string;
  bottomText?: string;
}

export const tipsData: TipsType[] = [
  {
    sec: "introduction",
    topText: "Ready to begin?",
    mainText: "Craft your standout resume",
    bottomMainText: "Our AI-powered tools streamline the writing process!",
  },
  {
    sec: "header",
    topText: "Welcome aboard! Let's dive in",
    mainText: "Your journey to a stellar resume starts now",
    bottomMainText: "Our intuitive tools will navigate you through each phase.",
    bottomText:
      "Begin with your core details, and let our AI assistant enhance your content along the way.",
  },
  {
    sec: "experience",
    topText: "Excellent progress! Next stop → Work Experience",
    mainText: "Showcase your professional journey",
    bottomMainText: "Our AI simplifies the writing process!",
    bottomText:
      "Leverage our writing assistance to refine and tailor your experience descriptions for maximum impact.",
  },
  {
    sec: "education",
    topText: "Well done! Moving on to → Education",
    mainText: "Time to highlight your academic path",
    bottomMainText: "Showcase your educational milestones!",
    bottomText:
      "Feature your degrees, certifications, and any standout academic achievements.",
  },
  {
    sec: "skills",
    topText: "Fantastic progress! Next up → Skills",
    mainText: "Let's spotlight your unique abilities",
    bottomMainText: "Craft a skills section that truly stands out.",
    bottomText:
      "Utilize our curated suggestions to emphasize your strengths and boost your resume's visibility to potential employers.",
  },
  {
    sec: "projects",
    topText: "Final stretch! Last stop → Projects",
    mainText: "Showcase projects that define your expertise",
    bottomMainText:
      "Featuring projects demonstrates your hands-on experience.",
    bottomText:
      "Include personal, academic, or professional projects to illustrate your skills in real-world scenarios.",
  },
  {
    sec: "custom",
    topText: "Tailor your resume with a custom section",
    mainText: "Add any additional details to personalize your resume",
    bottomMainText: "Whether it's achievements, hackathons, certifications, or any unique experience—make your resume truly yours.",
    bottomText: "Highlight what sets you apart by adding specialized sections that showcase your unique qualifications."
  }
];