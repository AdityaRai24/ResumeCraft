import {  LucideIcon, WandSparkles } from 'lucide-react';

interface TipsType {
    sec : string
    topText : string
    mainText : string
    bottomMainText? : string
    bottomText? : string
    bottomIcon? : LucideIcon
}

export const tipsData : TipsType[] = [
    {
        sec : "experience",
        topText : "Great progress! Next up → Experience",
        mainText : "Add details about your work experience",
        bottomMainText : "Our AI now makes writing easier!",
        bottomText: "With writing help you can fix mistakes or rephrase sentences to suit your needs",
        bottomIcon : WandSparkles,
    },
    {
        sec : "education",
        topText : "Great Job !!",
        mainText : "Now lets add your education",
    },
    {
        sec : "skills",
        topText : "Great progress! Next up → Skills",
        mainText : "Time to showcase your skills",
        bottomText :"Use our pre-written suggestions to optimize* your skills section, and get your resume to the top of the pile."
    },
]