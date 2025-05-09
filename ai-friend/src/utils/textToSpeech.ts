export const speak = (text: string, pitch = 1, rate = 1, voiceIndex = 0) => {
    if (typeof window !== "undefined") {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
  
      // Set pitch & speed
      utterance.pitch = pitch; // Range: 0 (low) to 2 (high)
      utterance.rate = rate;   // Range: 0.1 (slow) to 10 (fast)
  
      // Get available voices
      const voices = synth.getVoices();
      if (voices.length > 0) {
        utterance.voice = voices[voiceIndex] || voices[0];
      }
  
      synth.speak(utterance);
    }
  };
  