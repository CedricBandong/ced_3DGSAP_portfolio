import { useState, useEffect, memo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import TitleHeader from "../components/TitleHeader";
import TechIconCardExperience from "../components/models/tech_logos/TechIconCardExperience";
import { techStackIcons, jpTechStackIcons } from "../constants";
// import { techStackImgs } from "../constants";

gsap.registerPlugin(ScrollTrigger);

// Memoized component to prevent re-renders of existing 3D models during staggering
const TechCardItem = memo(({ icon, showModel }) => {
  return (
    <div className="card-border tech-card overflow-hidden group xl:rounded-full rounded-lg">
      {/* The tech-card-animated-bg div is used to create a background animation when the 
          component is hovered. */}
      <div className="tech-card-animated-bg" />
      <div className="tech-card-content">
        {/* The tech-icon-wrapper div contains the TechIconCardExperience component, 
            which renders the 3D model of the tech stack icon. */}
        <div className="tech-icon-wrapper">
          {showModel && <TechIconCardExperience model={icon} />}
        </div>
        {/* The padding-x and w-full classes are used to add horizontal padding to the 
            text and make it take up the full width of the component. */}
        <div className="padding-x w-full">
          {/* The p tag contains the name of the tech stack icon. */}
          <p>{icon.name}</p>
        </div>
      </div>
    </div>
  );
});

const TechStack = ({ language }) => {
  const [showModels, setShowModels] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);

  // Animate the tech cards in the skills section
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: "#skills",
      start: "top 75%", // Start loading models when the section is approaching viewport
      once: true,
      onEnter: () => setShowModels(true),
    });

    // This animation is triggered when the user scrolls to the #skills wrapper
    // The animation starts when the top of the wrapper is at the center of the screen
    // The animation is staggered, meaning each card will animate in sequence
    // The animation ease is set to "power2.inOut", which is a slow-in fast-out ease
    gsap.fromTo(
      ".tech-card",
      {
        // Initial values
        y: 50, // Move the cards down by 50px
        opacity: 0, // Set the opacity to 0
      },
      {
        // Final values
        y: 0, // Move the cards back to the top
        opacity: 1, // Set the opacity to 1
        duration: 1, // Duration of the animation
        ease: "power2.inOut", // Ease of the animation
        stagger: 0.2, // Stagger the animation by 0.2 seconds
        scrollTrigger: {
          trigger: "#skills", // Trigger the animation when the user scrolls to the #skills wrapper
          start: "top center", // Start the animation when the top of the wrapper is at the center of the screen
        },
      }
    );
  }, [language]);

  const icons = language === 'en' ? techStackIcons : jpTechStackIcons;

  // Stagger the loading of 3D models to prevent main thread freezing
  useEffect(() => {
    if (showModels) {
      const interval = setInterval(() => {
        setVisibleCount((prev) => {
          if (prev >= icons.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [showModels, icons.length]);

  return (
    <div id="skills" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title={language === 'en' ? "How I Can Contribute & My Key Skills" : "私が貢献できることと主なスキル"}
          sub={language === 'en' ? "What I Bring to the Table" : "私が提供できる価値"}
        />
        <div className="tech-grid center-items mt-10">
          {/* Loop through the techStackIcons array and create a component for each item. 
              The key is set to the name of the tech stack icon, and the classnames are set to 
              card-border, tech-card, overflow-hidden, and group. The xl:rounded-full and rounded-lg 
              classes are only applied on larger screens. */}
          {icons.map((techStackIcon, index) => (
            <TechCardItem
              key={techStackIcon.name}
              icon={techStackIcon}
              showModel={showModels && index < visibleCount}
            />
          ))}

          {/* This is for the img part */}
          {/* {techStackImgs.map((techStackIcon, index) => (
            <div
              key={index}
              className="card-border tech-card overflow-hidden group xl:rounded-full rounded-lg"
            >
              <div className="tech-card-animated-bg" />
              <div className="tech-card-content">
                <div className="tech-icon-wrapper">
                  <img src={techStackIcon.imgPath} alt="" />
                </div>
                <div className="padding-x w-full">
                  <p>{techStackIcon.name}</p>
                </div>
              </div>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default TechStack;
