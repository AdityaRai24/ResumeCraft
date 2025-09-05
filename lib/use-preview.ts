import { ResumeTemplate } from '@/types/templateTypes';
import {create} from 'zustand'

type previewStore = {
    isOpen : boolean;
    currentTemplate: ResumeTemplate | null;
    sourceContext: 'templates' | 'live-preview' | 'my-resumes' | null;
    onOpen : (template : ResumeTemplate, sourceContext?: 'templates' | 'live-preview' | 'my-resumes')=>void;
    onClose: ()=>void;
    toggle : ()=>void;
}

export const usePreview = create<previewStore>((set,get)=>({
    isOpen: false,
    currentTemplate : null,
    sourceContext: null,
    onOpen: (template, sourceContext = 'templates')=>set({isOpen : true,currentTemplate: template, sourceContext}),
    onClose: ()=>set({isOpen : false,currentTemplate: null, sourceContext: null}),
    toggle : ()=>set({isOpen: !get().isOpen}),
}))