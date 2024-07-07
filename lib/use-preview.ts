import { ResumeTemplate } from '@/types/templateTypes';
import {create} from 'zustand'

type previewStore = {
    isOpen : boolean;
    currentTemplate: ResumeTemplate | null;
    onOpen : (template : ResumeTemplate)=>void;
    onClose: ()=>void;
    toggle : ()=>void;
}

export const usePreview = create<previewStore>((set,get)=>({
    isOpen: false,
    currentTemplate : null,
    onOpen: (template)=>set({isOpen : true,currentTemplate: template}),
    onClose: ()=>set({isOpen : false,currentTemplate: null}),
    toggle : ()=>set({isOpen: !get().isOpen}),
}))