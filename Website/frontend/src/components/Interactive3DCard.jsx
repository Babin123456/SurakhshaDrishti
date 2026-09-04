import React, { useRef, useState } from 'react';

/**
 * Interactive 3D Card with mouse tilt & specular reflection
 * Apple-style tactile depth without heavy canvas/3D dependencies
 */
export default function Interactive3DCard({ 
  children, 
  className = '', 
  intensity = 12,
  glare = true 
}) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0, px: 50, py: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize -0.5 to 0.5
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;

    // Percentages 0-100%
    const px = Math.round((x / rect.width) * 100);
    const py = Math.round((y / rect.height) * 100);

    setCoords({
      x: normX * intensity,
      y: -normY * intensity,
      px,
      py
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0, px: 50, py: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-all duration-300 ease-out will-change-transform ${className}`}
      style={{
        perspective: 1200,
        transform: isHovered
          ? `perspective(1200px) rotateY(${coords.x}deg) rotateX(${coords.y}deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)`
          : 'perspective(1200px) rotateY(0deg) rotateX(0deg) translateY(0px) scale3d(1, 1, 1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Dynamic Specular Light Glare & Border Sheen */}
      {glare && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300 z-30"
          style={{
            opacity: isHovered ? 0.45 : 0,
            background: `radial-gradient(circle 360px at ${coords.px}% ${coords.py}%, rgba(255, 255, 255, 0.95), transparent 70%)`,
          }}
        />
      )}
      
      {children}
    </div>
  );
}
