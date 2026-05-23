import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";

export function TubeLightNavbar({ items, children }) {
  const [activeTab, setActiveTab] = useState(items[0]?.name);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Automatically set active tab based on current URL path matching
    const currentItem = items.find(item => {
      if(item.url === '/') return location.pathname === '/';
      return location.pathname.startsWith(item.url);
    });
    if (currentItem) {
      setActiveTab(currentItem.name);
    }
  }, [location.pathname, items]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: { xs: 'auto', sm: scrolled ? 16 : 32 }, // Bottom on mobile, top on desktop
        bottom: { xs: scrolled ? 16 : 32, sm: 'auto' },
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1200,
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 0.5, md: 1 },
          backgroundColor: scrolled ? "rgba(18, 18, 18, 0.95)" : "rgba(18, 18, 18, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(24px) saturate(200%)",
          WebkitBackdropFilter: "blur(24px) saturate(200%)",
          py: scrolled ? 0.5 : 1.25,
          px: scrolled ? 0.5 : 1.5,
          borderRadius: "50px",
          boxShadow: scrolled ? "0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)" : "0 20px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <Box
              key={item.name}
              onClick={() => {
                setActiveTab(item.name);
                if(item.onClick) {
                   item.onClick();
                } else if(item.url) {
                   navigate(item.url);
                }
              }}
              sx={{
                position: "relative",
                cursor: "pointer",
                px: scrolled ? { xs: 1.5, md: 2 } : { xs: 2.5, md: 3 },
                py: scrolled ? 0.75 : 1.25,
                borderRadius: "50px",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                color: isActive ? "#FFC107" : "rgba(255, 255, 255, 0.6)",
                backgroundColor: isActive ? "rgba(255, 193, 7, 0.05)" : "transparent",
                "&:hover": {
                  color: "#FFC107",
                },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Text for larger screens */}
              <Typography
                sx={{
                  display: { xs: "none", md: "inline" },
                  fontSize: scrolled ? "0.8rem" : "0.875rem",
                  fontWeight: scrolled ? 700 : 600,
                  letterSpacing: "0.02em",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
              >
                {item.name}
              </Typography>

              {/* Icon for mobile screens */}
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                {Icon && <Icon sx={{ fontSize: 20 }} />}
              </Box>

              {/* Framer Motion Lamp Effect */}
              {isActive && (
                <Box
                  component={motion.div}
                  layoutId="lamp"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    borderRadius: "50px",
                    zIndex: -1,
                  }}
                >
                  {/* Glowing Top Edge Tube */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -6,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 32,
                      height: 4,
                      backgroundColor: "#FFC107",
                      borderRadius: "50px 50px 0 0",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        width: 48,
                        height: 24,
                        backgroundColor: "rgba(255, 193, 7, 0.2)",
                        borderRadius: "50%",
                        filter: "blur(12px)",
                        top: -8,
                        left: -8,
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        width: 32,
                        height: 24,
                        backgroundColor: "rgba(255, 193, 7, 0.3)",
                        borderRadius: "50%",
                        filter: "blur(8px)",
                        top: -4,
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        width: 16,
                        height: 16,
                        backgroundColor: "rgba(255, 193, 7, 0.4)",
                        borderRadius: "50%",
                        filter: "blur(4px)",
                        top: 0,
                        left: 8,
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          );
        })}
        
        {/* Render child components (like Avatar, menu, action buttons) on the right side if provided */}
        {children && (
          <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 0, md: 1 }, pl: { xs: 1, md: 1.5 }, borderLeft: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {children}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default TubeLightNavbar;
