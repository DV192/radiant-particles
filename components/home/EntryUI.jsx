import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import CirclePlayIcon from "../icons/CirclePlayIcon";
import MuteIcon from "../icons/MuteIcon";
import useEnterState from "@/hooks/useEnterState";
import useAudioStore from "@/hooks/useAudioStore";

const EntryUI = ({ transitionStatus }) => {
  const container = useRef(null);
  const circleTweens = useRef([]);
  const setIsMuted = useAudioStore(state => state.setIsMuted);
  const setHasEntered = useEnterState(state => state.setHasEntered);

  const handleEnter = (audioEnabled) => {
    setIsMuted(!audioEnabled);
    setHasEntered(true);
  };

  useGSAP(() => {
    if (transitionStatus === "entered") {
      const circles = gsap.utils.toArray(".circle-pulse");
      const animateCircles = () => {
        circleTweens.current = circles.map((circle, index) =>
          gsap.to(circle, {
            keyframes: {
              '0%': { opacity: 0, scale: 1, ease: 'none' },
              '25%': { opacity: 0.3, scale: 1.25, ease: 'none' },
              '75%': { opacity: 1, scale: 1.75, ease: 'none' },
              '100%': { opacity: 0, scale: 2, ease: 'none' },
            },
            duration: 2,
            repeat: -1,
            repeatDelay: 0.25,
            delay: index * 0.75,
          })
        );
      };

      gsap.fromTo(
        container.current,
        { opacity: 0, scale: 0.6 },
        {
          opacity: 1,
          scale: 1,
          delay: 1.0,
          duration: 0.5,
          ease: "power1.in",
          onComplete: animateCircles,
        }
      );
    }

    if (transitionStatus === "exiting") {
      gsap.to(container.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          circleTweens.current.forEach((tween) => tween.kill());
        },
      });
    }
  }, { dependencies: [transitionStatus], scope: container });

  return (
    <div
      ref={container}
      role="dialog"
      aria-modal="true"
      aria-labelledby="entry-heading"
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-24 bg-transparent text-white opacity-0"
    >
      <h2 id="entry-heading" className="sr-only">Choose Experience</h2>

      <div className="flex items-center justify-center text-5xl relative" aria-hidden="true">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="circle-pulse absolute aspect-square size-24 rounded-full border-2 border-white opacity-0"
            style={{
              boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.33), inset 0 0 6px 2px rgba(255, 255, 255, 0.33)',
            }}
          />
        ))}
        <span className="font-semibold">V</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <button
          type="button"
          onClick={() => handleEnter(true)}
          className="flex items-center gap-2 px-6 py-2 rounded-full transition cursor-pointer glass-bg"
          aria-label="Enter with Full Experience (Sound Enabled)"
        >
          <span className="w-6 flex" aria-hidden="true">
            <CirclePlayIcon />
          </span>
          Full Experience
        </button>

        <button
          type="button"
          onClick={() => handleEnter(false)}
          className="flex items-center gap-2 px-6 py-2 rounded-full transition cursor-pointer glass-bg"
          aria-label="Enter with Muted Experience (No Sound)"
        >
          <span className="w-6 flex" aria-hidden="true">
            <MuteIcon />
          </span>
          Muted Experience
        </button>
      </div>
    </div>
  );
};

export default EntryUI;
