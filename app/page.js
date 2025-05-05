"use client";

import { useRef } from "react";
import { SwitchTransition, Transition } from "react-transition-group";

import CanvasRenderer from "@/components/home/CanvasRenderer";
import EntryUI from "@/components/home/EntryUI";
import HomePage from "@/components/home/HomePage";
import useEnterState from "@/hooks/useEnterState";

export default function Home() {
  const wrapper = useRef(null);
  const hasEntered = useEnterState(state => state.hasEntered);

  return (
    <main className="w-full h-[100dvh] flex flex-col items-center justify-center text-center bg-[#12141F]">
      <SwitchTransition mode="in-out">
        <Transition key={hasEntered} timeout={{ enter: 0, exit: 800 }} nodeRef={wrapper} appear={true}>
          {((transitionStatus) => (
            <div ref={wrapper} className="w-full h-full flex flex-col items-center justify-center">
              {!hasEntered && <EntryUI transitionStatus={transitionStatus} />}
              {hasEntered && <HomePage transitionStatus={transitionStatus} />}
            </div>
          ))}
        </Transition>
      </SwitchTransition>
      <CanvasRenderer />
    </main>
  );
}
