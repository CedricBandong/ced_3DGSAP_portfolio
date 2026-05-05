import { useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import AnimatedCounter from "../components/AnimatedCounter";
import Button from "../components/Button";
import { enWords, jpWords } from "../constants";
import HeroExperience from "../components/models/hero_models/HeroExperience";

const Hero = ({ language }) => {
  const [words, setWords] = useState(enWords);
  const [showHeroModel, setShowHeroModel] = useState(true);

  useGSAP(() => {
    gsap.fromTo(
      ".hero-text h1",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power2.inOut" }
    );

    // Optimize: Unmount the 3D model when it leaves the viewport to save GPU resources
    ScrollTrigger.create({
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      onLeave: () => setShowHeroModel(false),
      onEnterBack: () => setShowHeroModel(true),
    });
  });

  useEffect(() => {
    if (language === 'en') {
      setWords(enWords)
    } else {
      setWords(jpWords)
    }
  }, [language])

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute top-0 left-0 z-10">
        <img src="/images/bg.png" alt="" />
      </div>

      <div className="hero-layout">
        {/* LEFT: Hero Content */}
        <header className="flex flex-col justify-center md:w-full w-screen md:px-20 px-5">
          <div className="flex flex-col gap-7">
            {language === 'en'
              ? <div className="hero-text">
                  <h1>
                    Weaving
                    <span className="slide">
                      <span className="wrapper">
                        {words.map((word, index) => (
                          <span
                            key={index}
                            className="flex items-center md:gap-3 gap-1 pb-2"
                          >
                            <img
                              src={word.imgPath}
                              alt="person"
                              className="xl:size-12 md:size-10 size-7 md:p-2 p-1 rounded-full bg-white-50"
                            />
                            <span style={{ color: '#B7A2F7' }}>{word.text}</span>
                          </span>
                        ))}
                      </span>
                    </span>
                  </h1>
                  
                  <h1>into Real Tools</h1>
                  <h1>that Help People</h1>
                </div>
              : <div className="hero-text">
                  <h1>
                    人々を支える <br /> 実用的なツールに、<br />
                    <span className="slide">
                      <span className="wrapper">
                        {words.map((word, index) => (
                          <span
                            key={index}
                            className="flex items-center md:gap-3 gap-1 pb-2"
                          >
                            <img
                              src={word.imgPath}
                              alt="person"
                              className="xl:size-12 md:size-10 size-7 md:p-2 p-1 rounded-full bg-white-50"
                            />
                            <span style={{ color: '#B7A2F7' }}>{word.text}</span>
                          </span>
                        ))}
                      </span>
                    </span>
                  </h1>
                  <br />
                  <h1>を織り込む</h1>
                </div>
            }

            {language === 'en'
              ? <p className="text-white-50 md:text-xl relative z-10 pointer-events-none">
                  Hi, I’m Cedric, a developer based in Manila <br />
                  with a passion for building apps <br />
                  that I believe can have a positive impact on well-being.
                </p>
              : <p className="text-white-50 md:text-xl relative z-10 pointer-events-none">
                  東京を拠点に活動する開発者、ジェリックです。<br />
                  ウェルビーイングに貢献できるアプリを作っています。
                </p>
            }

            <Button
              text={language === 'en' ? 'A Few Things I’ve Built' : 'いくつかの制作物'}
              className="md:w-90 md:h-16 w-90 h-12"
              id="counter"
            />
          </div>
        </header>

        <div id="counterTrigger"></div>

        {/* RIGHT: 3D Model or Visual */}
        <figure>
          <div className="hero-3d-layout">
            {showHeroModel && <HeroExperience />}
          </div>
        </figure>
      </div>

      <AnimatedCounter
        language={language}
      />
    </section>
  );
};

export default Hero;
