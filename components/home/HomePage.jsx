"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

import GitHubIcon from "../icons/GitHubIcon";
import LinkedInIcon from "../icons/LinkedInIcon";
import EmailIcon from "../icons/EmailIcon";
import useAudio from "@/hooks/useAudio";

const HomePage = ({ transitionStatus }) => {
  const container = useRef(null);
  const headingRef = useRef();
  const aboutRef = useRef();
  const avatarContainer = useRef();
  const avatarRef = useRef();
  const socialLinks = useRef();
  const socials = [
    {
      name: "GitHub",
      href: "https://github.com/dv192",
      icon: <GitHubIcon />,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/varun-patel-3660ab233",
      icon: <LinkedInIcon />,
    },
    {
      name: "Email",
      href: "mailto:varunvarshil111@gmail.com",
      icon: <EmailIcon />,
    },
  ];

  // Load all the sounds
  const { playAudio: playBackgroundAudio } = useAudio({
    src: '/sounds/background.aac',
    loop: true,
    volume: 0.4,
  });
  const { playAudio: playLogoAudio } = useAudio({ src: '/sounds/logo-reveal.aac', loop: false });
  const { playAudio: playButtonAudio } = useAudio({ src: '/sounds/button.aac', loop: false });

  useGSAP(() => {
    if (transitionStatus === 'entering') {
      playBackgroundAudio();
      playButtonAudio();

      const splitHeading = new SplitType(headingRef.current, {
        charClass: 'opacity-0 blur-sm',
      });

      gsap
        .timeline({ delay: 4.0, })
        .fromTo(
          avatarContainer.current,
          { opacity: 0, scale: 0.3 },
          { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out', onStart: () => { playLogoAudio(); } },
        )
        .to(avatarRef.current, { opacity: 1, duration: 0.6, ease: 'power2.in' }, 0.7)
        .fromTo(
          socialLinks.current,
          { opacity: 0, scale: 0.3, },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'power1.in', },
        )
        .fromTo(
          splitHeading.chars,
          { opacity: 0 },
          {
            keyframes: [
              { opacity: 0.6, filter: 'blur(4px)', ease: 'power1.out' },
              { opacity: 1, filter: 'blur(0px)', ease: 'power1.out' },
            ],
            duration: 0.6,
            stagger: 0.032,
            ease: 'power2.out',
          },
        )
        .fromTo(
          aboutRef.current,
          { opacity: 0, },
          { opacity: 1, duration: 1.4, ease: 'power1.out', },
        );
    }

    if (transitionStatus === 'exiting') {
      gsap.to(container.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power1.out',
      })
    }
  }, { dependencies: [transitionStatus], scope: container },)

  return (
    <section
      ref={container}
      className="absolute inset-0 z-20 flex flex-col sm:grid grid-rows-[14rem_14rem_14rem] items-center justify-center gap-8 sm:gap-10 px-4 text-white"
      aria-label="Homepage main content"
    >
      <header className="w-full h-full flex flex-col items-center justify-end gap-4 text-center">
        <h1 ref={headingRef} className="text-2xl font-semibold tracking-tight sm:text-4xl">
          Building the Future of Interactive Web
        </h1>
        <p ref={aboutRef} className="max-w-xl text-sm font-light leading-relaxed text-white/90 sm:text-base">
          I specialize in building dynamic, visually immersive interfaces using modern web technologies like React, Three.js, and GLSL shaders. Pushing the boundaries of frontend development through creative code and interactive design.
        </p>
      </header>

      <div className="w-full h-full flex flex-col items-center justify-center">
        <figure
          ref={avatarContainer}
          className="rounded-full border-2 border-white p-2 shadow-[0_0_6px_rgba(255,255,255,0.33),_inset_0_0_6px_rgba(255,255,255,0.33)] opacity-0 glass-bg-figure"
          aria-label="Avatar image"
        >
          <img
            ref={avatarRef}
            src="/avatar.jpg"
            alt="Avatar"
            className="aspect-square w-44 sm:w-56 rounded-full object-cover opacity-0"
          />
        </figure>
      </div>

      <div className="w-full h-full flex items-start justify-center">
        <nav ref={socialLinks} className="flex gap-6 opacity-0 scale-[0.3]" aria-label="Social links">
          {socials.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="size-12 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 glass-bg"
              aria-label={`Visit ${social.name}`}
            >
              {social.icon}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default HomePage;
