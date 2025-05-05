"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { Typewriter } from "react-simple-typewriter";

import GitHubIcon from "../icons/GitHubIcon";
import LinkedInIcon from "../icons/LinkedInIcon";
import EmailIcon from "../icons/EmailIcon";
import useAudio from "@/hooks/useAudio";

gsap.registerPlugin(useGSAP);

const HomePage = ({ transitionStatus }) => {
  const container = useRef(null);
  const headingRef = useRef();
  const aboutRef = useRef();
  const avatarContainer = useRef();
  const avatarRef = useRef();
  const nameRef = useRef();
  const titleRef = useRef();
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

  const { playAudio: playBackgroundAudio } = useAudio({
    src: '/sounds/background.aac',
    loop: true,
    volume: 0.4,
  });
  const { playAudio: playLogoAudio } = useAudio({ src: '/sounds/logo-reveal.aac', loop: false });
  const { playAudio: playButtonAudio } = useAudio({ src: '/sounds/button.aac', loop: false });

  useGSAP(() => {
    if (transitionStatus === 'entering') {
      playButtonAudio();
      playBackgroundAudio();

      const splitName = new SplitType(nameRef.current, {
        charClass: 'opacity-0 blur-sm',
      });
      const splitHeading = new SplitType(headingRef.current, {
        charClass: 'opacity-0 blur-sm',
      });

      gsap.timeline({ delay: 4.0 })
        .fromTo(
          avatarContainer.current,
          { opacity: 0, scale: 0.3 },
          {
            opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out', onStart: () => {
              playLogoAudio();
            }
          },
        )
        .to(
          avatarRef.current,
          { opacity: 1, duration: 0.6, ease: 'power1.in' },
          0.7
        )
        .fromTo(
          splitName.chars,
          { opacity: 0 },
          {
            keyframes: [
              { opacity: 0.6, filter: 'blur(4px)', ease: 'power1.out' },
              { opacity: 1, filter: 'blur(0px)', ease: 'power1.out' },
            ],
            duration: 1.2,
            stagger: 0.07,
            ease: 'power2.out',
          }
        )
        .fromTo(
          titleRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.2, ease: 'power2.out' },
          "-=0.8"
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
            stagger: 0.03,
            ease: 'power2.out',
          },
          "-=0.8"
        )
        .fromTo(
          aboutRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.2, ease: 'power2.out' },
          "-=0.2"
        )
        .fromTo(
          socialLinks.current,
          { opacity: 0, scale: 0.3 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'power1.in' },
          "-=0.9"
        );
    }

    if (transitionStatus === 'exiting') {
      gsap.to(container.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power1.out',
      });
    }
  }, { dependencies: [transitionStatus], scope: container });


  return (
    <section
      ref={container}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 p-6 text-white overflow-auto"
      aria-label="Homepage main content"
    >
      <div className="w-full flex flex-col items-center justify-center gap-4 text-center">
        <h2 ref={headingRef} className="text-xl font-semibold sm:text-3xl">
          Building the Future of Interactive Web
        </h2>
        <p ref={aboutRef} className="max-w-2xl text-sm sm:text-base font-light leading-relaxed">
          I specialize in building dynamic, visually immersive interfaces using modern web technologies like React, Next.js, Three.js, and GLSL shaders.
          Pushing the boundaries of frontend development through creative code and interactive design.
        </p>
      </div>

      <div className="w-full flex flex-col items-center justify-center gap-4">
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
        <h1 ref={nameRef} className="text-3xl sm:text-5xl font-bold tracking-tight">
          Varun Patel
        </h1>
        <p ref={titleRef} className="text-xl sm:text-2xl font-light text-white">
          <Typewriter
            words={['Creative Coder', 'Frontend Developer', '3D Web Artist', 'Shader Enthusiast']}
            loop={true}
            cursor
            cursorStyle="|"
            typeSpeed={80}
            deleteSpeed={50}
            delaySpeed={2000}
          />
        </p>
      </div>

      <div className="w-full flex items-start justify-center pt-2">
        <nav ref={socialLinks} className="flex gap-5" aria-label="Social links">
          {socials.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="size-9 sm:size-10 rounded-full p-2 sm:p-[10px] text-white transition glass-bg"
              aria-label={`Visit ${social.name}`}
              title={social.name}
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
