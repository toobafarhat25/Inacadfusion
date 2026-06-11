import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Box, Typography } from "@mui/material";
import { RocketLaunch, TrendingUp, KeyboardArrowUp } from "@mui/icons-material";

// Register ScrollTrigger safely for React
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES using MUI Standard Mustard theme
// -------------------------------------------------------------------------
const STYLES = `

.cinematic-footer-wrapper {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  
  --pill-bg-1: rgba(255, 193, 7, 0.08);
  --pill-bg-2: rgba(255, 255, 255, 0.02);
  --pill-shadow: rgba(0, 0, 0, 0.5);
  --pill-highlight: rgba(255, 255, 255, 0.1);
  --pill-inset-shadow: rgba(0, 0, 0, 0.2);
  --pill-border: rgba(255, 193, 7, 0.15);
  
  --pill-bg-1-hover: rgba(255, 193, 7, 0.15);
  --pill-bg-2-hover: rgba(255, 255, 255, 0.05);
  --pill-border-hover: rgba(255, 193, 7, 0.4);
  --pill-shadow-hover: rgba(0, 0, 0, 0.7);
  --pill-highlight-hover: rgba(255, 255, 255, 0.2);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(255, 82, 82, 0.5)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 10px rgba(255, 82, 82, 0.8)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

/* Theme-adaptive Grid Background */
.footer-bg-grid {
  background-size: 60px 60px;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

/* Theme-adaptive Aurora Glow */
.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    rgba(255, 193, 7, 0.12) 0%, 
    rgba(255, 160, 0, 0.08) 40%, 
    transparent 70%
  );
}

/* Glass Pill Theming */
.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow: 
      0 10px 30px -10px var(--pill-shadow), 
      inset 0 1px 1px var(--pill-highlight), 
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  cursor: pointer;
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow: 
      0 20px 40px -10px var(--pill-shadow-hover), 
      inset 0 1px 1px var(--pill-highlight-hover);
  color: #FFC107;
  transform: translateY(-2px);
}

/* Giant Background Text Masking */
.footer-giant-bg-text {
  font-size: 22vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.05);
  background: linear-gradient(180deg, rgba(255, 193, 7, 0.08) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Metallic Text Glow */
.footer-text-glow {
  background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.5) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px rgba(255, 193, 7, 0.2));
}

.group:hover .group-hover\\:text-white {
  color: #FFFFFF;
}
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE (Native React implementation)
// -------------------------------------------------------------------------
const MagneticButton = React.forwardRef(({ className, children, onClick, ...props }, forwardedRef) => {
  const localRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const element = localRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      const handleMouseMove = (e) => {
        const rect = element.getBoundingClientRect();
        const h = rect.width / 2;
        const w = rect.height / 2;
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - w;

        gsap.to(element, {
          x: x * 0.4,
          y: y * 0.4,
          rotationX: -y * 0.15,
          rotationY: x * 0.15,
          scale: 1.05,
          ease: "power2.out",
          duration: 0.4,
        });
      };

      const handleMouseLeave = () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          ease: "elastic.out(1, 0.3)",
          duration: 1.2,
        });
      };

      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, element);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      component="button"
      onClick={onClick}
      ref={(node) => {
        localRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
      className={className}
      sx={{ background: 'transparent', outline: 'none', appearance: 'none', border: 'none', fontFamily: 'inherit' }}
      {...props}
    >
      {children}
    </Box>
  );
});
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// 3. MAIN COMPONENT
// -------------------------------------------------------------------------
const MarqueeItem = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', px: { xs: 3, md: 6 } }}>
    <span style={{ marginRight: '48px' }}>Empowering Innovation</span> <span style={{ color: 'rgba(255, 193, 7, 0.6)', marginRight: '48px' }}>✦</span>
    <span style={{ marginRight: '48px' }}>Bridging Academia</span> <span style={{ color: 'rgba(255, 255, 255, 0.4)', marginRight: '48px' }}>✦</span>
    <span style={{ marginRight: '48px' }}>Real-world Projects</span> <span style={{ color: 'rgba(255, 193, 7, 0.6)', marginRight: '48px' }}>✦</span>
    <span style={{ marginRight: '48px' }}>Global Networking</span> <span style={{ color: 'rgba(255, 255, 255, 0.4)', marginRight: '48px' }}>✦</span>
    <span style={{ marginRight: '48px' }}>Career Acceleration</span> <span style={{ color: 'rgba(255, 193, 7, 0.6)', marginRight: '48px' }}>✦</span>
  </Box>
);

export function CinematicFooter() {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const giantTextRef = useRef(null);
  const headingRef = useRef(null);
  const linksRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    // React strict mode compatible GSAP context cleanup
    const ctx = gsap.context(() => {
      // Background Parallax
      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      // Staggered Content Reveal
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      {/* 
        The "Curtain Reveal" Wrapper:
        It sits in standard flow. Because it has clip-path, its contents
        are ONLY visible within its bounding box. 
      */}
      <Box
        ref={wrapperRef}
        sx={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)',
        }}
        className="cinematic-footer-wrapper"
      >
        {/* The actual footer stays fixed to the viewport underneath everything */}
        <Box
          component="footer"
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            display: 'flex',
            height: '100vh',
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
            backgroundColor: '#0A0A0A',
            color: '#FFFFFF',
            // Let scroll wheel pass through the fixed backdrop to the document
            pointerEvents: 'none',
          }}
        >
          
          {/* Ambient Light & Grid Background */}
          <Box className="footer-aurora animate-footer-breathe" sx={{ position: 'absolute', left: '50%', top: '50%', height: '60vh', width: '80vw', transform: 'translate(-50%, -50%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
          <Box className="footer-bg-grid" sx={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

          {/* Giant background text */}
          <Box
            ref={giantTextRef}
            className="footer-giant-bg-text"
            sx={{
              position: 'absolute',
              bottom: '-5vh',
              left: '50%',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
              zIndex: 0,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            FUSION
          </Box>

          {/* 1. Diagonal Sleek Marquee (Top of footer) */}
          <Box
            sx={{
              position: 'absolute',
              top: '3rem',
              left: 0,
              width: '100%',
              pointerEvents: 'auto',
              overflow: 'hidden',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              backgroundColor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(12px)',
              py: 2,
              zIndex: 10,
              transform: 'rotate(-2deg) scale(1.1)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            }}
          >
            <Box
              className="animate-footer-scroll-marquee"
              sx={{
                display: 'flex',
                width: 'max-content',
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                fontWeight: 700,
                letterSpacing: '0.3em',
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
              }}
            >
              <MarqueeItem />
              <MarqueeItem />
            </Box>
          </Box>

          {/* 2. Main Center Content */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              px: 3,
              mt: 10,
              width: '100%',
              maxWidth: '1024px',
              mx: 'auto',
              pointerEvents: 'auto',
            }}
          >
            <Typography
              ref={headingRef}
              variant="h2"
              className="footer-text-glow"
              sx={{
                fontSize: { xs: '3rem', md: '5rem', lg: '6rem' },
                fontWeight: 900,
                letterSpacing: '-0.05em',
                mb: 6,
                textAlign: 'center',
              }}
            >
              Ready to begin?
            </Typography>

            {/* Interactive Magnetic Pills Layout */}
            <Box ref={linksRef} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, width: '100%' }}>
              {/* Primary Call to Action Buttons */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, width: '100%' }}>
                <MagneticButton 
                  onClick={() => navigate('/login')} 
                  className="footer-glass-pill group"
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 40px', borderRadius: '50px', fontSize: '1rem', fontWeight: 700 }}
                >
                  <RocketLaunch sx={{ fontSize: 24, color: 'rgba(255,255,255,0.5)', transition: 'color 0.3s' }} className="group-hover:text-white" />
                  Get Started Today
                </MagneticButton>
                
                <MagneticButton 
                  onClick={() => navigate('/projects')} 
                  className="footer-glass-pill group"
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 40px', borderRadius: '50px', fontSize: '1rem', fontWeight: 700 }}
                >
                  <TrendingUp sx={{ fontSize: 24, color: 'rgba(255,255,255,0.5)', transition: 'color 0.3s' }} className="group-hover:text-white" />
                  Explore Projects
                </MagneticButton>
              </Box>



            </Box>
          </Box>

          {/* 3. Bottom Bar / Credits */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 20,
              width: '100%',
              pb: 4,
              px: { xs: 3, md: 6 },
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 3,
              pointerEvents: 'auto',
            }}
          >
            {/* Copyright */}
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: { xs: '0.65rem', md: '0.75rem' },
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                order: { xs: 2, md: 1 },
              }}
            >
              © 2026 InAcadFusion. All rights reserved.
            </Typography>

            {/* Back to top */}
            <MagneticButton
              onClick={scrollToTop}
              className="footer-glass-pill group"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                order: 3,
              }}
            >
              <KeyboardArrowUp sx={{ fontSize: 24, color: 'rgba(255,255,255,0.5)', transition: 'all 0.3s' }} className="group-hover:text-white" />
            </MagneticButton>

          </Box>
        </Box>
      </Box>
    </>
  );
}

export default CinematicFooter;
