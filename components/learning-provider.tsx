"use client";

import { useEffect, useRef } from "react";
import { createBrowserLearningRepository } from "@/lib/learning/local-learning-repository";
import { useLearningStore } from "@/lib/learning/store";

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);
  const configure = useLearningStore((store) => store.configure);
  const hydrate = useLearningStore((store) => store.hydrate);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    configure(createBrowserLearningRepository());
    void hydrate();
  }, [configure, hydrate]);
  return children;
}
