import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Landing.css';

interface LandingVideoProps {
  src: string;  
  navigateTo: string;
}

const Landing: React.FC<LandingVideoProps> = ({ src, navigateTo }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((err) => console.error('Video autoplay failed:', err));
    }
  }, []);

  const handleClick = () => {
    navigate(navigateTo);
  };

  return (
    <div className="landing-video-container" onClick={handleClick}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="landing-video"
      />
    </div>
  );
};

export default Landing;
