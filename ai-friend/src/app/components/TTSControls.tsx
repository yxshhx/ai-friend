"use client";
import { useEffect, useState } from "react";
import { speak } from "@/utils/textToSpeech";

const TTSControls = ({ text }: { text: string }) => {
  const [femaleVoiceIndex, setFemaleVoiceIndex] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const synth = window.speechSynthesis;
      const updateVoices = () => {
        const voices = synth.getVoices();
        const femaleVoice = voices.find((voice) =>
          voice.name.toLowerCase().includes("female") || voice.name.toLowerCase().includes("woman")
        );

        if (femaleVoice) {
          setFemaleVoiceIndex(voices.indexOf(femaleVoice));
        } else if (voices.length > 0) {
          // Default to first voice if no female voice is found
          setFemaleVoiceIndex(0);
        }
      };

      synth.onvoiceschanged = updateVoices;
      updateVoices();
    }
  }, []);

  useEffect(() => {
    if (text && femaleVoiceIndex !== null) {
      speak(text, 1, 1, femaleVoiceIndex);
    }
  }, [text, femaleVoiceIndex]);

  return null; // No UI elements, auto-plays when text updates
};

export default TTSControls;
