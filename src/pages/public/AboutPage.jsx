import React, { useEffect, useRef } from 'react'
import { Box, Typography, Container, Grid } from '@mui/material'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useNavigate } from 'react-router-dom'
import CinematicFooter from '../../components/ui/MotionFooter'
import {
  School,
  Business,
  ConnectWithoutContact,
  RocketLaunch,
  Verified,
  Groups,
  TrendingUp,
  AutoAwesome,
} from '@mui/icons-material'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─────────────────────────────────────────────────────────────────────────────
// INLINE STYLES
// ─────────────────────────────────────────────────────────────────────────────
const STYLES = `

.about-page-root {
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  background-color: #0A0A0A;
  overflow-x: hidden;
}

.about-reveal {
  opacity: 0;
  transform: translateY(60px);
}

.about-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #FFC107;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.about-label::before {
  content: '';
  width: 24px;
  height: 1px;
  background: #FFC107;
  display: inline-block;
}

.about-gradient-text {
  background: linear-gradient(135deg, #FFC107 0%, #FFD54F 50%, #FFC107 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 20px rgba(255, 193, 7, 0.3));
}

.about-divider {
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.12), transparent);
  height: 100%;
  min-height: 80px;
}

.about-stat-card {
  padding: 40px;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(255,193,7,0.04), rgba(255,255,255,0.01));
  backdrop-filter: blur(10px);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.about-stat-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  border: 1px solid transparent;
  background: linear-gradient(135deg, rgba(255,193,7,0.2), transparent) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.about-stat-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255,193,7,0.2);
  box-shadow: 0 30px 60px -12px rgba(0,0,0,0.7), 0 0 40px rgba(255,193,7,0.06);
}

.about-stat-card:hover::after {
  opacity: 1;
}

.about-value-card {
  padding: 32px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.about-value-card:hover {
  border-color: rgba(255,193,7,0.25);
  background: rgba(255,193,7,0.04);
  transform: translateY(-4px);
}

@keyframes about-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
  100% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.7; }
}

.about-glow-orb {
  animation: about-breathe 8s ease-in-out infinite alternate;
}

.about-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px);
}

.about-scroll-indicator {
  width: 1px;
  height: 80px;
  background: linear-gradient(to bottom, rgba(255,193,7,0.8), transparent);
  animation: about-pulse 2s ease-in-out infinite;
}

@keyframes about-pulse {
  0%, 100% { opacity: 1; height: 80px; }
  50% { opacity: 0.4; height: 50px; }
}
`

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const stats = [
  { value: '500+', label: 'Active Students', sub: 'Gaining real-world experience' },
  { value: '150+', label: 'Partner Startups', sub: 'Building tomorrow\'s products' },
  { value: '300+', label: 'Projects Delivered', sub: 'With verified outcomes' },
  { value: '98%', label: 'Satisfaction Rate', sub: 'From both sides of collaboration' },
]

const values = [
  {
    icon: School,
    title: 'Student Empowerment',
    desc: 'We believe every student deserves access to real-world experience. InAcadFusion ensures your university projects actually matter — to you and to industry.',
  },
  {
    icon: Business,
    title: 'Startup Acceleration',
    desc: 'Early-stage startups need talent without the overhead. Through InAcadFusion, founders get fresh ideas, dedicated contributors, and verified project results.',
  },
  {
    icon: ConnectWithoutContact,
    title: 'Structured Collaboration',
    desc: 'Every engagement on our platform is structured, milestone-driven, and professionally verified. No ambiguity. Just meaningful work and clear outcomes.',
  },
  {
    icon: Verified,
    title: 'Verified Credentials',
    desc: 'Students receive cryptographically-verifiable experience letters upon project completion, building a portfolio that stands out to future employers.',
  },
  {
    icon: Groups,
    title: 'Global Community',
    desc: 'InAcadFusion is building a worldwide network of achievers — students and startups united by the shared goal of turning ideas into impact.',
  },
  {
    icon: AutoAwesome,
    title: 'Innovation First',
    desc: 'We push boundaries by connecting academia to the frontier. The most interesting unsolved problems are exactly where we want to help.',
  },
]

const journey = [
  { year: '2022', title: 'The Idea', desc: 'Born from frustration — a gap between what students learn and what startups need.' },
  { year: '2023', title: 'First Collaborations', desc: 'Our pilot connected 30 students across 12 projects with 8 early-stage startups.' },
  { year: '2024', title: 'Scaling Up', desc: 'Platform launched publicly. 150+ startups and 500+ students joined within the first year.' },
  { year: '2025+', title: 'Global Expansion', desc: 'Building cross-university, cross-border pipelines to redefine how talent meets opportunity.' },
]

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const navigate = useNavigate()
  const rootRef = useRef(null)

  useEffect(() => {
    if (!rootRef.current) return
    const ctx = gsap.context(() => {
      // All elements with class .about-reveal animate in on scroll
      gsap.utils.toArray('.about-reveal').forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Box
        ref={rootRef}
        className="about-page-root"
        sx={{ position: 'relative', minHeight: '100vh', width: '100%', zIndex: 1 }}
      >

        {/* ── AMBIENT BACKGROUND ── */}
        <Box className="about-bg-grid" sx={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
        <Box
          className="about-glow-orb"
          sx={{
            position: 'fixed', top: '30%', left: '50%', width: '80vw', height: '60vh',
            background: 'radial-gradient(ellipse at center, rgba(255,193,7,0.07) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none',
          }}
        />

        {/* ========================================================
            HERO SECTION
        ======================================================== */}
        <Box
          sx={{
            position: 'relative', zIndex: 1,
            minHeight: '100vh',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            px: { xs: 3, md: 6 }, pt: { xs: 12, md: 16 }, pb: { xs: 8, md: 12 },
            textAlign: 'center',
          }}
        >
          <Box className="about-reveal" sx={{ mb: 4 }}>
            <span className="about-label">About InAcadFusion</span>
          </Box>

          <Box className="about-reveal">
            <Typography
              variant="h1"
              sx={{
                fontFamily: '"Inter", system-ui, sans-serif',
                fontWeight: 900,
                fontSize: { xs: '2.8rem', sm: '4rem', md: '5.5rem', lg: '7rem' },
                lineHeight: 1.0,
                letterSpacing: '-0.04em',
                color: '#FFFFFF',
                mb: 2,
              }}
            >
              Bridging the Gap
              <br />
              <Box component="span" className="about-gradient-text">
                That Holds Everyone Back.
              </Box>
            </Typography>
          </Box>

          <Box className="about-reveal" sx={{ mt: 5, maxWidth: 680, mx: 'auto' }}>
            <Typography
              sx={{
                fontFamily: '"Inter", system-ui, sans-serif',
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.2rem' },
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              InAcadFusion exists to dismantle the wall between academia and industry — creating
              a world where students build real things, startups discover real talent, and
              every collaboration leaves a verified, lasting footprint.
            </Typography>
          </Box>

          {/* Scroll indicator */}
          <Box sx={{ mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
              Scroll
            </Typography>
            <Box className="about-scroll-indicator" />
          </Box>
        </Box>

        {/* ========================================================
            STATS SECTION
        ======================================================== */}
        <Box
          sx={{
            position: 'relative', zIndex: 1,
            py: { xs: 10, md: 18 },
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <Container maxWidth="xl" sx={{ px: { xs: 3, md: 8 } }}>
            <Grid container spacing={3}>
              {stats.map((stat, i) => (
                <Grid item xs={12} sm={6} lg={3} key={i}>
                  <Box className="about-reveal about-stat-card">
                    <Typography
                      sx={{
                        fontFamily: '"Inter", system-ui, sans-serif',
                        fontWeight: 900,
                        fontSize: { xs: '3.5rem', md: '4.5rem' },
                        lineHeight: 1,
                        color: '#FFC107',
                        mb: 1,
                        letterSpacing: '-0.04em',
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography sx={{ fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#FFFFFF', mb: 0.5 }}>
                      {stat.label}
                    </Typography>
                    <Typography sx={{ fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 400, fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)' }}>
                      {stat.sub}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* ========================================================
            MISSION SECTION
        ======================================================== */}
        <Box
          sx={{
            position: 'relative', zIndex: 1,
            py: { xs: 10, md: 20 },
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <Container maxWidth="xl" sx={{ px: { xs: 3, md: 8 } }}>
            <Grid container spacing={{ xs: 6, md: 12 }} alignItems="center">
              <Grid item xs={12} md={5}>
                <Box className="about-reveal" sx={{ mb: 3 }}>
                  <span className="about-label">Our Mission</span>
                </Box>
                <Box className="about-reveal">
                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: '"Inter", system-ui, sans-serif',
                      fontWeight: 900,
                      fontSize: { xs: '2.2rem', md: '3.5rem' },
                      lineHeight: 1.1,
                      letterSpacing: '-0.03em',
                      color: '#FFFFFF',
                    }}
                  >
                    Building the world's{' '}
                    <Box component="span" className="about-gradient-text">most impactful</Box>
                    {' '}student-startup pipeline.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={7}>
                <Box className="about-reveal">
                  <Typography
                    sx={{
                      fontFamily: '"Inter", system-ui, sans-serif',
                      fontWeight: 400,
                      fontSize: { xs: '1rem', md: '1.15rem' },
                      lineHeight: 1.9,
                      color: 'rgba(255,255,255,0.55)',
                      mb: 4,
                    }}
                  >
                    There is a profound, systemic gap between what universities teach and what the real world demands. Students sit on extraordinary potential — untapped ideas, fresh perspectives, fierce ambition. Startups are racing against time, starved for talent they can't yet afford.
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Inter", system-ui, sans-serif',
                      fontWeight: 400,
                      fontSize: { xs: '1rem', md: '1.15rem' },
                      lineHeight: 1.9,
                      color: 'rgba(255,255,255,0.55)',
                    }}
                  >
                    InAcadFusion was built to change that. We create a structured, verifiable, and mutually rewarding bridge — where students gain the experience they can't get in classrooms, and startups get the talent they need to grow.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* ========================================================
            PROBLEM → SOLUTION SECTION
        ======================================================== */}
        <Box
          sx={{
            position: 'relative', zIndex: 1,
            py: { xs: 10, md: 20 },
            borderTop: '1px solid rgba(255,255,255,0.05)',
            background: 'linear-gradient(180deg, transparent 0%, rgba(255,193,7,0.025) 50%, transparent 100%)',
          }}
        >
          <Container maxWidth="xl" sx={{ px: { xs: 3, md: 8 } }}>
            <Box className="about-reveal" sx={{ mb: 3 }}>
              <span className="about-label">The Problem We Solve</span>
            </Box>

            <Box className="about-reveal" sx={{ mb: { xs: 8, md: 14 } }}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Inter", system-ui, sans-serif',
                  fontWeight: 900,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem' },
                  lineHeight: 1.05,
                  letterSpacing: '-0.04em',
                  color: '#FFFFFF',
                  maxWidth: '900px',
                }}
              >
                Academia produces talent.<br />
                Industry needs talent.<br />
                <Box component="span" className="about-gradient-text">They never properly meet.</Box>
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {[
                {
                  num: '01',
                  title: 'Students Graduate Underexperienced',
                  desc: 'Theoretical knowledge alone cannot compete. Students need proof of work — real deliverables, real stakes, real outcomes that matter beyond a transcript.',
                },
                {
                  num: '02',
                  title: 'Startups Can\'t Afford Experienced Talent',
                  desc: 'Early-stage startups are forced to choose between speed and cost. They need motivated contributors who bring new energy and technical curiosity.',
                },
                {
                  num: '03',
                  title: 'No Verified Track Record Exists',
                  desc: 'Without a neutral platform to manage, verify, and certify the collaboration, both sides operate on trust alone — a fragile and inefficient system.',
                },
              ].map((item, i) => (
                <Grid item xs={12} md={4} key={i}>
                  <Box className="about-reveal about-value-card" sx={{ height: '100%' }}>
                    <Typography sx={{ fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 900, fontSize: '3.5rem', color: 'rgba(255,193,7,0.15)', letterSpacing: '-0.04em', mb: 2, lineHeight: 1 }}>
                      {item.num}
                    </Typography>
                    <Typography sx={{ fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#FFFFFF', mb: 2, lineHeight: 1.3 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 400, fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* ========================================================
            VALUES / PILLARS SECTION
        ======================================================== */}
        <Box
          sx={{
            position: 'relative', zIndex: 1,
            py: { xs: 10, md: 20 },
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <Container maxWidth="xl" sx={{ px: { xs: 3, md: 8 } }}>
            <Grid container spacing={4} sx={{ mb: { xs: 8, md: 14 } }} alignItems="flex-end">
              <Grid item xs={12} md={6}>
                <Box className="about-reveal" sx={{ mb: 3 }}>
                  <span className="about-label">What We Stand For</span>
                </Box>
                <Box className="about-reveal">
                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: '"Inter", system-ui, sans-serif',
                      fontWeight: 900,
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      lineHeight: 1.1,
                      letterSpacing: '-0.03em',
                      color: '#FFFFFF',
                    }}
                  >
                    Six pillars that guide{' '}
                    <Box component="span" className="about-gradient-text">every decision</Box> we make.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box className="about-reveal">
                  <Typography sx={{ fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 400, fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.9, color: 'rgba(255,255,255,0.45)' }}>
                    InAcadFusion was built with a clear set of values. These aren't just words on a wall — they're the operating principles behind every feature, every policy, and every relationship we build.
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              {values.map((v, i) => {
                const Icon = v.icon
                return (
                  <Grid item xs={12} sm={6} lg={4} key={i}>
                    <Box className="about-reveal about-value-card" sx={{ height: '100%' }}>
                      <Box sx={{ mb: 3, display: 'inline-flex', p: 1.5, borderRadius: '12px', background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.15)' }}>
                        <Icon sx={{ color: '#FFC107', fontSize: 24 }} />
                      </Box>
                      <Typography sx={{ fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#FFFFFF', mb: 1.5, lineHeight: 1.3 }}>
                        {v.title}
                      </Typography>
                      <Typography sx={{ fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 400, fontSize: '0.88rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8 }}>
                        {v.desc}
                      </Typography>
                    </Box>
                  </Grid>
                )
              })}
            </Grid>
          </Container>
        </Box>

        {/* ========================================================
            JOURNEY / TIMELINE SECTION
        ======================================================== */}
        <Box
          sx={{
            position: 'relative', zIndex: 1,
            py: { xs: 10, md: 20 },
            borderTop: '1px solid rgba(255,255,255,0.05)',
            background: 'linear-gradient(180deg, transparent 0%, rgba(255,193,7,0.02) 100%)',
          }}
        >
          <Container maxWidth="xl" sx={{ px: { xs: 3, md: 8 } }}>
            <Box className="about-reveal" sx={{ mb: 3 }}>
              <span className="about-label">Our Journey</span>
            </Box>
            <Box className="about-reveal" sx={{ mb: { xs: 8, md: 14 } }}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Inter", system-ui, sans-serif',
                  fontWeight: 900,
                  fontSize: { xs: '2.5rem', md: '4.5rem' },
                  lineHeight: 1.1,
                  letterSpacing: '-0.04em',
                  color: '#FFFFFF',
                }}
              >
                From a bold idea{' '}
                <Box component="span" className="about-gradient-text">to a growing movement.</Box>
              </Typography>
            </Box>

            <Box sx={{ position: 'relative' }}>
              {/* Vertical line */}
              <Box sx={{ position: 'absolute', left: { xs: 20, md: '50%' }, top: 0, bottom: 0, width: '1px', background: 'linear-gradient(to bottom, rgba(255,193,7,0.3), rgba(255,255,255,0.05))', transform: { md: 'translateX(-50%)' } }} />

              {journey.map((item, i) => (
                <Box
                  key={i}
                  className="about-reveal"
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'row', md: i % 2 === 0 ? 'row' : 'row-reverse' },
                    mb: { xs: 6, md: 10 },
                    position: 'relative',
                    gap: { xs: 4, md: 0 },
                  }}
                >
                  {/* Dot */}
                  <Box sx={{
                    position: { xs: 'relative', md: 'absolute' },
                    left: { md: '50%' },
                    top: { md: 0 },
                    transform: { md: 'translate(-50%, 6px)' },
                    width: 14, height: 14,
                    borderRadius: '50%',
                    background: '#FFC107',
                    boxShadow: '0 0 0 4px rgba(255,193,7,0.2)',
                    flexShrink: 0,
                    zIndex: 2,
                    mt: { xs: 1, md: 0 },
                    ml: { xs: '13px', md: 0 },
                  }} />

                  {/* Content */}
                  <Box sx={{ width: { md: '45%' }, ml: { xs: 2, md: i % 2 === 0 ? 0 : 'auto' }, mr: { md: i % 2 === 0 ? 'auto' : 0 }, pl: { xs: 0, md: i % 2 === 0 ? 0 : 8 }, pr: { md: i % 2 === 0 ? 8 : 0 }, textAlign: { md: i % 2 === 0 ? 'right' : 'left' } }}>
                    <Typography sx={{ fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.2em', color: '#FFC107', textTransform: 'uppercase', mb: 1 }}>
                      {item.year}
                    </Typography>
                    <Typography sx={{ fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 800, fontSize: { xs: '1.3rem', md: '1.6rem' }, color: '#FFFFFF', mb: 1.5, letterSpacing: '-0.02em' }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 400, fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* ========================================================
            CTA SECTION
        ======================================================== */}
        <Box
          sx={{
            position: 'relative', zIndex: 1,
            py: { xs: 12, md: 22 },
            borderTop: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'center',
          }}
        >
          <Container maxWidth="md" sx={{ px: 3 }}>
            <Box className="about-reveal" sx={{ mb: 3 }}>
              <span className="about-label">Ready to Start?</span>
            </Box>
            <Box className="about-reveal">
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Inter", system-ui, sans-serif',
                  fontWeight: 900,
                  fontSize: { xs: '2.5rem', md: '5rem' },
                  lineHeight: 1.05,
                  letterSpacing: '-0.04em',
                  color: '#FFFFFF',
                  mb: 4,
                }}
              >
                Your next collaboration{' '}
                <Box component="span" className="about-gradient-text">starts here.</Box>
              </Typography>
            </Box>
            <Box className="about-reveal" sx={{ mb: 6 }}>
              <Typography sx={{ fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 400, fontSize: { xs: '1rem', md: '1.15rem' }, lineHeight: 1.8, color: 'rgba(255,255,255,0.5)' }}>
                Whether you're a student looking for meaningful projects or a startup seeking driven talent — InAcadFusion is where ambition meets opportunity.
              </Typography>
            </Box>
            <Box className="about-reveal" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              <Box
                component="button"
                onClick={() => navigate('/register')}
                sx={{
                  background: '#FFC107', color: '#000', border: 'none', cursor: 'pointer',
                  fontFamily: '"Inter", system-ui, sans-serif',
                  fontWeight: 800, fontSize: '1rem',
                  px: 5, py: 2.5, borderRadius: '50px',
                  boxShadow: '0 8px 30px rgba(255,193,7,0.35)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex', alignItems: 'center', gap: 1,
                  '&:hover': {
                    backgroundColor: '#FFD54F',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 16px 40px rgba(255,193,7,0.45)',
                  },
                }}
              >
                <RocketLaunch sx={{ fontSize: 20 }} />
                Join InAcadFusion
              </Box>
              <Box
                component="button"
                onClick={() => navigate('/projects')}
                sx={{
                  background: 'transparent', color: '#FFFFFF', cursor: 'pointer',
                  fontFamily: '"Inter", system-ui, sans-serif',
                  fontWeight: 700, fontSize: '1rem',
                  px: 5, py: 2.5, borderRadius: '50px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex', alignItems: 'center', gap: 1,
                  '&:hover': {
                    borderColor: 'rgba(255,193,7,0.4)',
                    color: '#FFC107',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                <TrendingUp sx={{ fontSize: 20 }} />
                Explore Projects
              </Box>
            </Box>
          </Container>
        </Box>

        {/* ========================================================
            CINEMATIC FOOTER
        ======================================================== */}
        <CinematicFooter />
      </Box>
    </>
  )
}
