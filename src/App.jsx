import { useState, useEffect, useRef } from "react";

import Footer from "./sections/Footer";
import Contact from "./sections/Contact";
import TechStack from "./sections/TechStack";
import Experience from "./sections/Experience";
import Hero from "./sections/Hero";
import ShowcaseSection from "./sections/ShowcaseSection";
import LogoShowcase from "./sections/LogoShowcase";
import FeatureCards from "./sections/FeatureCards";
import Navbar from "./components/NavBar";
import ChatBubble from "./components/ChatBubble";

const App = () => {
  const [language, setLanguage] = useState('en');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const audioRef = useRef(null);

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.volume = 0.33;
      audioRef.current.play().catch((error) => {
        console.log("Audio play failed:", error);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <>
      <audio ref={audioRef} loop>
        <source src="/audio/itsmylifedontyouforget.mp3" type="audio/mpeg" />
      </audio>

      <div
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 9999,
        }}
      >
        {showTooltip && (
          <div
            style={{
              position: 'absolute',
              right: '60px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              padding: '5px 10px',
              borderRadius: '5px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            {language === 'en' ? 'Original Music' : 'オリジナル楽曲'}
          </div>
        )}
        <button
          onClick={toggleAudio}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(5px)',
            cursor: 'pointer',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isPlaying ? '🔊' : '🔇'}
        </button>
      </div>

      <ChatBubble language={language} />
      <Navbar language={language} setLanguage={setLanguage} />
      <Hero language={language} />
      <ShowcaseSection language={language} />
      <LogoShowcase />
      <FeatureCards language={language} />
      <Experience language={language} />
      <TechStack language={language} />
      <Contact language={language} />
      <Footer language={language} />
    </>
  )
};

export default App;
