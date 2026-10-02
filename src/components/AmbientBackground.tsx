import React, { useMemo } from 'react';

export const AmbientBackground: React.FC = () => {
  // Generate multi-colored stage rose petals (red, pink, white)
  const petals = useMemo(() => {
    const types = ['#e74c3c', '#ff5e7e', '#ffffff', '#e84393', '#ff7675'];
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.3) % 100}%`,
      animationDuration: `${10 + (i % 7) * 2.2}s`,
      animationDelay: `${(i * 0.9) % 8}s`,
      size: 14 + (i % 6) * 4,
      rotation: i * 42,
      opacity: 0.35 + (i % 4) * 0.15,
      color: types[i % types.length]
    }));
  }, []);

  // Generate warm golden bokeh sparkles
  const sparkles = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      left: `${5 + (i * 6.2) % 90}%`,
      top: `${15 + (i * 5.3) % 75}%`,
      size: 4 + (i % 5) * 3,
      animationDuration: `${3.5 + (i % 4) * 1.5}s`,
      animationDelay: `${(i * 0.7) % 5}s`,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      
      {/* 1. Deep Royal Purple / Violet Pleated Silk Drapery Backdrop */}
      <div className="absolute inset-0 stage-curtains opacity-95" />
      
      {/* 2. Drapery Shadow Gradients & Spotlight Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(94, 23, 148, 0.4) 0%, rgba(35, 6, 64, 0.75) 60%, rgba(15, 2, 28, 0.95) 100%)'
        }}
      />

      {/* 3. Iconic Luminous Neon Art-Deco Wing / Fan Structure Behind the Album */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-[1300px] h-[80vh] max-h-[850px] flex items-center justify-center opacity-85">
        <svg
          viewBox="0 0 1200 700"
          className="w-full h-full neon-glow"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Central Layered Geometric Fan Panels */}
          {/* Center Tall Wing */}
          <path
            d="M 600 680 L 460 260 L 600 130 L 740 260 Z"
            fill="rgba(194, 141, 245, 0.08)"
            stroke="#fff1b8"
            strokeWidth="4"
          />
          <line x1="500" y1="260" x2="570" y2="680" stroke="#ffd766" strokeWidth="1.5" strokeOpacity="0.4" />
          <line x1="550" y1="200" x2="590" y2="680" stroke="#ffd766" strokeWidth="1.5" strokeOpacity="0.4" />
          <line x1="650" y1="200" x2="610" y2="680" stroke="#ffd766" strokeWidth="1.5" strokeOpacity="0.4" />
          <line x1="700" y1="260" x2="630" y2="680" stroke="#ffd766" strokeWidth="1.5" strokeOpacity="0.4" />

          {/* Left Large Wing */}
          <path
            d="M 600 680 L 280 340 L 440 240 L 580 480 Z"
            fill="rgba(168, 95, 238, 0.08)"
            stroke="#fff1b8"
            strokeWidth="3.5"
          />
          <line x1="330" y1="310" x2="590" y2="680" stroke="#ffd766" strokeWidth="1.5" strokeOpacity="0.4" />
          <line x1="390" y1="270" x2="595" y2="680" stroke="#ffd766" strokeWidth="1.5" strokeOpacity="0.4" />

          {/* Right Large Wing */}
          <path
            d="M 600 680 L 920 340 L 760 240 L 620 480 Z"
            fill="rgba(168, 95, 238, 0.08)"
            stroke="#fff1b8"
            strokeWidth="3.5"
          />
          <line x1="870" y1="310" x2="610" y2="680" stroke="#ffd766" strokeWidth="1.5" strokeOpacity="0.4" />
          <line x1="810" y1="270" x2="605" y2="680" stroke="#ffd766" strokeWidth="1.5" strokeOpacity="0.4" />

          {/* Outer Left Petal Wing */}
          <path
            d="M 600 680 L 160 460 C 180 370, 260 360, 310 390 L 570 590 Z"
            fill="rgba(218, 185, 250, 0.06)"
            stroke="#ffeb99"
            strokeWidth="3"
          />
          <line x1="210" y1="410" x2="585" y2="680" stroke="#ffd766" strokeWidth="1.2" strokeOpacity="0.4" />
          <line x1="260" y1="380" x2="590" y2="680" stroke="#ffd766" strokeWidth="1.2" strokeOpacity="0.4" />

          {/* Outer Right Petal Wing */}
          <path
            d="M 600 680 L 1040 460 C 1020 370, 940 360, 890 390 L 630 590 Z"
            fill="rgba(218, 185, 250, 0.06)"
            stroke="#ffeb99"
            strokeWidth="3"
          />
          <line x1="990" y1="410" x2="615" y2="680" stroke="#ffd766" strokeWidth="1.2" strokeOpacity="0.4" />
          <line x1="940" y1="380" x2="610" y2="680" stroke="#ffd766" strokeWidth="1.2" strokeOpacity="0.4" />
        </svg>
      </div>

      {/* 4. Left & Right Stage Standing Glow Orb Light Clusters */}
      {/* Left Lamp Cluster */}
      <div className="absolute left-4 sm:left-12 bottom-20 flex flex-col items-center pointer-events-none opacity-90">
        <div className="relative w-16 h-36">
          <div className="stage-orb absolute top-0 left-4 w-6 h-6 rounded-full" />
          <div className="stage-orb absolute top-8 left-0 w-5 h-5 rounded-full" />
          <div className="stage-orb absolute top-10 right-0 w-5 h-5 rounded-full" />
          <div className="stage-orb absolute top-18 left-3 w-5 h-5 rounded-full" />
          {/* Golden stand stems */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-28 bg-gradient-to-t from-[#cea267] to-[#fff3d1]" />
        </div>
      </div>

      {/* Right Lamp Cluster */}
      <div className="absolute right-4 sm:right-12 bottom-20 flex flex-col items-center pointer-events-none opacity-90">
        <div className="relative w-16 h-36">
          <div className="stage-orb absolute top-0 right-4 w-6 h-6 rounded-full" />
          <div className="stage-orb absolute top-8 right-0 w-5 h-5 rounded-full" />
          <div className="stage-orb absolute top-10 left-0 w-5 h-5 rounded-full" />
          <div className="stage-orb absolute top-18 right-3 w-5 h-5 rounded-full" />
          {/* Golden stand stems */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-28 bg-gradient-to-t from-[#cea267] to-[#fff3d1]" />
        </div>
      </div>



      {/* 6. Glossy Stage Floor with Lavender & Gold Reflection */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 opacity-75 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(230, 220, 245, 0.25) 0%, rgba(107, 45, 158, 0.15) 50%, transparent 100%)',
          boxShadow: 'inset 0 20px 40px rgba(0, 0, 0, 0.4)'
        }}
      />

      {/* 7. Floating Stage Bokeh / Fairy Light Sparkles */}
      {sparkles.map((sp) => (
        <div
          key={sp.id}
          className="floating-sparkle bg-[#fff1b8] shadow-neon-wing"
          style={{
            left: sp.left,
            top: sp.top,
            width: `${sp.size}px`,
            height: `${sp.size}px`,
            animationDuration: sp.animationDuration,
            animationDelay: sp.animationDelay,
          }}
        />
      ))}

      {/* 8. Live Drifting Wedding Stage Rose Petals */}
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="drifting-petal"
          style={{
            left: petal.left,
            width: `${petal.size}px`,
            height: `${petal.size * 1.35}px`,
            animationDuration: petal.animationDuration,
            animationDelay: petal.animationDelay,
            opacity: petal.opacity,
          }}
        >
          <svg viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
            <path
              d="M15 0C26 12 32 26 22 36C12 46 0 36 6 22C12 8 15 0 15 0Z"
              fill={petal.color}
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
