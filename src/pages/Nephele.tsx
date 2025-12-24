import React, { useRef, useState } from "react";
import { Bot, Users, Settings, Zap } from "lucide-react";

const Nephele: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const enableSound = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = false;
    videoRef.current.volume = 1;
    videoRef.current.play();
    setMuted(false);
  };

  const features = [
    { label: "Intelligent Interaction", description: "Nephele talks, listens, and understands users.", icon: Bot },
    { label: "User Analytics", description: "Track engagement and optimize experiences in real-time.", icon: Users },
    { label: "Automation Engine", description: "Seamless workflow automation for daily tasks.", icon: Settings },
    { label: "Fast & Responsive", description: "High-speed operations with low latency.", icon: Zap },
  ];

  return (
    <div className="space-y" style={{ padding: "2rem" }}>
      {/* Hero Heading */}
      <h1 className="heading fade-in" style={{ fontSize: "3rem", textAlign: "center" }}>
        Meet Nephele 3.0 🤖
      </h1>

      <p
        className="fade-in"
        style={{
          textAlign: "center",
          color: "#E0E0E0",
          fontSize: "1.25rem",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        Your intelligent assistant designed to enhance productivity, engage users, and simplify everyday tasks.
      </p>

      {/* Feature Cards */}
      <div className="metrics-grid" style={{ marginTop: "2rem" }}>
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div key={idx} className="card hover-lift fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="card-header">
                <span className="metric-label">{feature.label}</span>
                <div className="metric-icon">
                  <Icon className="metric-icon-inner" size={24} />
                </div>
              </div>
              <p style={{ color: "#E0E0E0", marginTop: "0.5rem" }}>
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Nephele in Action */}
      <div
        className="card fade-in"
        style={{
          animationDelay: "0.4s",
          marginTop: "2rem",
          padding: "1rem",
        }}
      >
        <h3 className="metric-label" style={{ marginBottom: "1rem" }}>
          Nephele in Action
        </h3>

        <div
          className="nephele-video-wrapper"
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: "1rem",
            overflow: "hidden",
            background: "black",
          }}
        >
          <video
            ref={videoRef}
            src="https://res.cloudinary.com/dc1bw2x0t/video/upload/f_auto,q_auto/nephele-demo_1_qrmd5q.mp4"
            autoPlay
            loop
            muted={muted}
            playsInline
            preload="auto"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Sound Button */}
          {muted && (
            <button
              onClick={enableSound}
              style={{
                position: "absolute",
                bottom: "1rem",
                right: "1rem",
                background: "rgba(0,0,0,0.7)",
                color: "#fff",
                border: "none",
                borderRadius: "999px",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              🔊 Enable Sound
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nephele;
