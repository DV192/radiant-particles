"use client";

import { useEffect, useState } from "react";

import useAudioStore from "@/hooks/useAudioStore";

const useAudio = ({ src, autoPlay = false, loop = false, volume = 1 }) => {
  const isMuted = useAudioStore(state => state.isMuted);
  const [audio, setAudio] = useState();

  useEffect(() => {
    if (!src) return;
    // Create audio element, set properties, and load
    const audioEl = new Audio(src);
    audioEl.loop = loop;
    audioEl.autoplay = autoPlay;
    audioEl.volume = volume;
    audioEl.addEventListener("error", (e) => console.error("audio error", e));
    audioEl.load();
    setAudio(audioEl);

    return () => {
      audioEl.remove();
      audioEl.pause();
    }
  }, [src, autoPlay, loop, volume]);

  useEffect(() => {
    if (!audio) return;
    audio.muted = isMuted;
  }, [audio, isMuted])

  const playAudio = () => {
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
  }

  const pauseAudio = () => {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }

  return { audio, playAudio, pauseAudio }
}

export default useAudio;