import "./background.css";

export default function HomeBackground() {
  return (
    <div className="ollivere-bg">
      {/* Animated gradient orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      
      {/* Floating geometric shapes */}
      <div className="geometric-grid">
        <div className="geo-shape triangle-1"></div>
        <div className="geo-shape triangle-2"></div>
        <div className="geo-shape circle-1"></div>
        <div className="geo-shape circle-2"></div>
        <div className="geo-shape hexagon-1"></div>
      </div>
      
      {/* Dynamic mesh gradient overlay */}
      <div className="mesh-gradient">
        <svg width="100%" height="100%" viewBox="0 0 1200 800" className="mesh-svg">
          <defs>
            <radialGradient id="mesh1" cx="30%" cy="30%">
              <stop offset="0%" stopColor="rgba(255, 165, 0, 0.3)" />
              <stop offset="100%" stopColor="rgba(255, 165, 0, 0)" />
            </radialGradient>
            <radialGradient id="mesh2" cx="70%" cy="60%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.2)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </radialGradient>
            <radialGradient id="mesh3" cx="20%" cy="80%">
              <stop offset="0%" stopColor="rgba(128, 128, 128, 0.25)" />
              <stop offset="100%" stopColor="rgba(128, 128, 128, 0)" />
            </radialGradient>
          </defs>
          <circle cx="360" cy="240" r="200" fill="url(#mesh1)" className="mesh-blob mesh-blob-1" />
          <circle cx="840" cy="480" r="250" fill="url(#mesh2)" className="mesh-blob mesh-blob-2" />
          <circle cx="240" cy="640" r="180" fill="url(#mesh3)" className="mesh-blob mesh-blob-3" />
        </svg>
      </div>
      
      {/* Particle system */}
      <div className="particles">
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} className={`particle particle-${(i % 3) + 1}`}></div>
        ))}
      </div>
      
      {/* Neural network connections */}
      <svg className="neural-network" width="100%" height="100%" viewBox="0 0 1200 800">
        <g className="connections" opacity="0.4">
          <line x1="100" y1="150" x2="300" y2="200" stroke="rgba(255,255,255,0.1)" strokeWidth="1" className="neural-line" />
          <line x1="300" y1="200" x2="500" y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="1" className="neural-line" />
          <line x1="500" y1="180" x2="700" y2="220" stroke="rgba(255,255,255,0.1)" strokeWidth="1" className="neural-line" />
          <line x1="200" y1="400" x2="400" y2="380" stroke="rgba(255,255,255,0.08)" strokeWidth="1" className="neural-line" />
          <line x1="400" y1="380" x2="600" y2="420" stroke="rgba(255,255,255,0.08)" strokeWidth="1" className="neural-line" />
          <line x1="600" y1="420" x2="800" y2="400" stroke="rgba(255,255,255,0.08)" strokeWidth="1" className="neural-line" />
          <line x1="150" y1="600" x2="350" y2="580" stroke="rgba(255,255,255,0.06)" strokeWidth="1" className="neural-line" />
          <line x1="350" y1="580" x2="550" y2="620" stroke="rgba(255,255,255,0.06)" strokeWidth="1" className="neural-line" />
        </g>
        <g className="nodes">
          <circle cx="100" cy="150" r="3" fill="rgba(255, 165, 0, 0.6)" className="neural-node" />
          <circle cx="300" cy="200" r="3" fill="rgba(255, 255, 255, 0.6)" className="neural-node" />
          <circle cx="500" cy="180" r="3" fill="rgba(128, 128, 128, 0.6)" className="neural-node" />
          <circle cx="700" cy="220" r="3" fill="rgba(255, 165, 0, 0.6)" className="neural-node" />
          <circle cx="200" cy="400" r="3" fill="rgba(0, 0, 0, 0.6)" className="neural-node" />
          <circle cx="400" cy="380" r="3" fill="rgba(255, 165, 0, 0.6)" className="neural-node" />
          <circle cx="600" cy="420" r="3" fill="rgba(255, 255, 255, 0.6)" className="neural-node" />
          <circle cx="800" cy="400" r="3" fill="rgba(128, 128, 128, 0.6)" className="neural-node" />
          <circle cx="150" cy="600" r="3" fill="rgba(255, 165, 0, 0.6)" className="neural-node" />
          <circle cx="350" cy="580" r="3" fill="rgba(0, 0, 0, 0.6)" className="neural-node" />
          <circle cx="550" cy="620" r="3" fill="rgba(255, 165, 0, 0.6)" className="neural-node" />
        </g>
      </svg>
    </div>
  );
}
