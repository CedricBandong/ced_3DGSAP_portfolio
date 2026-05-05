import { useState, useEffect } from "react";

import { enNavLinks, jpNavLinks } from "../constants";

const NavBar = ({ language, setLanguage }) => {
  // track if the user has scrolled down the page
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    // create an event listener for when the user scrolls
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 10;
          setScrolled(isScrolled);
          ticking = false;
        });
        ticking = true;
      }
    };

    // add the event listener to the window
    window.addEventListener("scroll", handleScroll);

    // cleanup the event listener when the component is unmounted
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
      <div className="inner">
        <a href="#hero" className="logo">
          {
            language === 'en'
              ? "Cedric's 3D Portfolio Site"
              : "ジェリック 個人 3D ポートフォリオサイト"
          }
        </a>

        <nav className="desktop">
          <ul>
            {language === 'en'
              ? enNavLinks.map(({ link, name }) => (
                  <li key={name} className="group">
                    <a href={link}>
                      <span>{name}</span>
                      <span className="underline" />
                    </a>
                  </li>
                ))
              : jpNavLinks.map(({ link, name }) => (
                  <li key={name} className="group">
                    <a href={link}>
                      <span>{name}</span>
                      <span className="underline" />
                    </a>
                  </li>
                ))
            }
          </ul>
        </nav>

        <div style={{ display: 'flex', gap: 30 }}>
          <a href="#contact" className="contact-btn group">
            <div className="inner">
              <span>{language === 'en' ? 'Contact me' : 'お問い合わせ'}</span>
            </div>
          </a>

        </div>
      </div>
    </header>
  );
}

export default NavBar;
