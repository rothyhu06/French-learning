"use client";
import { create } from "zustand";

type SyncStatus = "idle" | "syncing" | "synced" | "error";
type LearningState = {
  activeLessonId: string | null;
  activeSectionId: string | null;
  sessionStartedAt: number | null;
  syncStatus: SyncStatus;
  setActiveLesson: (lessonId:string, sectionId?:string) => void;
  setActiveSection: (sectionId:string) => void;
  setSyncStatus: (status:SyncStatus) => void;
  finishSession: () => number;
};

export const useLearningStore = create<LearningState>((set,get)=>({
  activeLessonId:null, activeSectionId:null, sessionStartedAt:null, syncStatus:"idle",
  setActiveLesson:(activeLessonId,activeSectionId)=>set({activeLessonId,activeSectionId:activeSectionId??null,sessionStartedAt:Date.now()}),
  setActiveSection:(activeSectionId)=>set({activeSectionId}),
  setSyncStatus:(syncStatus)=>set({syncStatus}),
  finishSession:()=>{ const started=get().sessionStartedAt; const seconds=started?Math.max(1,Math.round((Date.now()-started)/1000)):0; set({sessionStartedAt:null}); return seconds; },
}));
