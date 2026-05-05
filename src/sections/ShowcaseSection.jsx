import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const AppShowcase = ({ language }) => {
  const sectionRef = useRef(null);
  const flowFundsRef = useRef(null);
  const startupRef = useRef(null);
  const othersRef = useRef(null);

  useGSAP(() => {
    // Animation for the main section
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );

    // Animations for each app showcase
    const cards = [flowFundsRef.current, startupRef.current, othersRef.current];

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3 * (index + 1),
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
          },
        }
      );
    });
  }, [language]);

  return (
    <div id="work" ref={sectionRef} className="app-showcase">
      <div className="w-full">
        <div className="showcaselayout">
          <div ref={flowFundsRef} className="first-project-wrapper animated-card">
            <div className="image-wrapper">
              <img src="/images/project1.png" alt="FlowFunds" />
            </div>
            <div className="text-content">  
                <h2 style={{ fontSize: 30 }}>
                  <a
                    href="https://matchpointracketclub.com/"
                    className="group relative inline-block"
                  >
                    <span>Match Point Racket Club</span>
                    <span className="absolute left-0 -bottom-2 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
                  </a>
                </h2>
              
                <p className="text-white-50 md:text-xl">
                  A modern booking platform for managing court reservations, approvals, and scheduling with a streamlined, user-friendly interface. Enabling players and admins to easily view availability, reserve courts, and handle bookings in real time.
                </p>          
            </div>
          </div>

          <div className="project-list-wrapper">
            <div className="project animated-card" ref={startupRef}>
              <div className="image-wrapper bg-[#18181B]">
                <img
                  src="/images/project2.png"
                  alt="Campus Events Management App"
                />
              </div>
              <a href="https://eventera100.lovable.app/auth"
                 className="group relative inline-block"
              >
                <h2>Campus Events Management App</h2>
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            </div>

            <div className="project animated-card" ref={othersRef}>
              <div className="image-wrapper bg-[#18181B]">
                <img src="/images/project3.png" alt="Others" />
              </div>
              <a href="https://saas-nynq8nshv-cedricbandongs-projects.vercel.app/"
                 className="group relative inline-block"
              >
                  <h2>Learning Management System (LMS) SaaS platform</h2>
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppShowcase;
