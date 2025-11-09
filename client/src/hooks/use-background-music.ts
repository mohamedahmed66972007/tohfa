import { useEffect, useRef } from "react";

interface UseBackgroundMusicOptions {
  src: string;
  volume?: number;
  fadeOutDuration?: number;
}

export function useBackgroundMusic({ 
  src, 
  volume = 0.3,
  fadeOutDuration = 2000
}: UseBackgroundMusicOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(src);
    audioRef.current.volume = volume;
    audioRef.current.loop = true;
    
    audioRef.current.play().catch((error) => {
      console.log("Audio play prevented:", error);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, [src, volume]);

  const fadeOut = () => {
    if (!audioRef.current || fadeIntervalRef.current) return;

    const audio = audioRef.current;
    const startVolume = audio.volume;
    const steps = 50;
    const stepDuration = fadeOutDuration / steps;
    const volumeStep = startVolume / steps;
    let currentStep = 0;

    fadeIntervalRef.current = window.setInterval(() => {
      currentStep++;
      const newVolume = Math.max(0, startVolume - (volumeStep * currentStep));
      
      if (audio) {
        audio.volume = newVolume;
      }

      if (currentStep >= steps || newVolume <= 0) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
        if (audio) {
          audio.pause();
        }
      }
    }, stepDuration);
  };

  return { fadeOut };
}
