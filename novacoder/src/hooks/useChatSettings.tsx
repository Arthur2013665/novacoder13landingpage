import { useState } from "react";
import type { ModelId } from "@/lib/chat";

export function useChatSettings() {
  const [model, setModel] = useState<ModelId>(() =>
    (localStorage.getItem("nova-model") as ModelId) || "google/gemini-3-flash-preview"
  );
  const [customInstructions, setCustomInstructionsState] = useState<string>(() =>
    localStorage.getItem("nova-custom-instructions") || ""
  );
  const [showTimestamps, setShowTimestampsState] = useState<boolean>(() =>
    localStorage.getItem("nova-timestamps") !== "false"
  );
  const [autoScroll, setAutoScrollState] = useState<boolean>(() =>
    localStorage.getItem("nova-autoscroll") !== "false"
  );
  const [compactMode, setCompactModeState] = useState<boolean>(() =>
    localStorage.getItem("nova-compact") === "true"
  );

  const setModelPref = (m: ModelId) => {
    setModel(m);
    localStorage.setItem("nova-model", m);
  };

  const setCustomInstructions = (v: string) => {
    setCustomInstructionsState(v);
    localStorage.setItem("nova-custom-instructions", v);
  };

  const setShowTimestamps = (v: boolean) => {
    setShowTimestampsState(v);
    localStorage.setItem("nova-timestamps", String(v));
  };

  const setAutoScroll = (v: boolean) => {
    setAutoScrollState(v);
    localStorage.setItem("nova-autoscroll", String(v));
  };

  const setCompactMode = (v: boolean) => {
    setCompactModeState(v);
    localStorage.setItem("nova-compact", String(v));
  };

  return {
    model, setModel: setModelPref,
    customInstructions, setCustomInstructions,
    showTimestamps, setShowTimestamps,
    autoScroll, setAutoScroll,
    compactMode, setCompactMode,
  };
}
