import { useRef, useCallback } from "react";

export function useSoundEffect() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  const play = useCallback((src: string, volume: number = 0.5) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(src);
    audio.volume = Math.min(Math.max(volume, 0), 1); // Ensure volume is between 0 and 1
    audioRef.current = audio;

    audio.addEventListener('error', (e) => {
      console.error("Audio load error:", e);
    });

    audio.play().catch((error) => {
      console.error("Failed to play sound effect:", error);
    });
  }, []);

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  const fadeOut = (duration: number = 1000) => {
    if (!audioRef.current || fadeIntervalRef.current) return;

    const audio = audioRef.current;
    const startVolume = audio.volume;
    const steps = 50;
    const stepDuration = duration / steps;
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

  return { play, stop, fadeOut };
}