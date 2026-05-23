import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { Box, Container, Typography, Grid } from '@mui/material'
import {
  LocationOn, Phone, Email, Schedule,
  Send, CheckCircle, School, Business,
  RocketLaunch, ExpandMore, ExpandLess, ArrowForward,
} from '@mui/icons-material'
import CinematicFooter from '../../components/ui/MotionFooter'
import Snackbar from '../../components/shared/Snackbar'
import { simulateApiCall } from '../../utils/dataSimulation'
import SplineScene from '../../components/ui/SplineScene'

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const STYLES = `

/* ── SPLINE HERO ── */
.cp-hero-dark {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #060606;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.cp-hero-spotlight {
  pointer-events: none;
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 30%, transparent 70%);
  blur: 40px;
  z-index: 2;
  transition: opacity 0.2s ease;
}

/* Subtle grid overlay on dark hero */
.cp-hero-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
  z-index: 1;
}

.cp-hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 18px; border-radius: 50px;
  border: 1px solid rgba(255,193,7,0.25);
  background: rgba(255,193,7,0.07);
  font-family: 'Inter', system-ui;
  font-size: 0.75rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: #FFC107;
  margin-bottom: 28px;
}

.cp-hero-cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 32px; border-radius: 50px;
  background: linear-gradient(135deg, #FFC107, #FF8F00);
  color: #000;
  font-family: 'Inter', system-ui;
  font-weight: 800; font-size: 0.95rem;
  border: none; cursor: pointer;
  box-shadow: 0 8px 30px rgba(255,193,7,0.35);
  transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
  text-decoration: none;
}
.cp-hero-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(255,193,7,0.5);
}

.cp-hero-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 32px; border-radius: 50px;
  background: transparent;
  color: rgba(255,255,255,0.7);
  font-family: 'Inter', system-ui;
  font-weight: 700; font-size: 0.95rem;
  border: 1px solid rgba(255,255,255,0.15);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
}
.cp-hero-ghost:hover {
  border-color: rgba(255,193,7,0.4);
  color: #FFC107;
  transform: translateY(-3px);
}

@keyframes cp-spotlight-enter {
  from { opacity: 0; } to { opacity: 1; }
}

.cp-root {
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  background-color: #F7F5F0;
  color: #0A0A0A;
  overflow-x: hidden;
  min-height: 100vh;
}

/* ── FLOATING BLOBS ── */
@keyframes cp-float1 { 0%,100%{transform:translate(0,0) scale(1);} 40%{transform:translate(30px,-40px) scale(1.05);} 70%{transform:translate(-15px,20px) scale(0.97);} }
@keyframes cp-float2 { 0%,100%{transform:translate(0,0) scale(1);} 35%{transform:translate(-35px,25px) scale(1.07);} 65%{transform:translate(20px,-15px) scale(0.95);} }
.cp-blob1 { animation: cp-float1 16s ease-in-out infinite; }
.cp-blob2 { animation: cp-float2 20s ease-in-out infinite; }

/* ── LABEL ── */
.cp-label {
  font-size: 0.72rem; font-weight: 700;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: #B8860B;
  display: inline-flex; align-items: center; gap: 8px;
}
.cp-label::before { content:''; width:20px; height:1.5px; background:#B8860B; display:inline-block; border-radius:2px; }

/* ── GRADIENT TEXT ── */
.cp-gradient-text {
  background: linear-gradient(135deg, #FFC107 0%, #E65100 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── INFO BLOCK ── */
.cp-info-block {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 24px;
  padding: 24px 28px;
  border-radius: 20px;
  background: rgba(255,255,255,0.95);
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 4px 24px rgba(0,0,0,0.04);
  backdrop-filter: blur(20px);
  transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
  min-height: 110px;
}
.cp-info-block:hover {
  border-color: rgba(255,193,7,0.4);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  transform: translateY(-5px);
}
.cp-info-icon {
  width: 56px; height: 56px; border-radius: 18px;
  background: linear-gradient(135deg, rgba(255,193,7,0.15), rgba(255,152,0,0.08));
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(255,193,7,0.25);
  box-shadow: 0 4px 12px rgba(255,193,7,0.1);
}

/* ── FORM CARD ── */
.cp-form-card {
  background: #FFFFFF;
  border-radius: 28px;
  padding: 44px;
  box-shadow:
    0 4px 6px rgba(0,0,0,0.04),
    0 20px 60px rgba(0,0,0,0.08),
    0 0 0 1px rgba(0,0,0,0.04);
  position: relative;
  overflow: hidden;
}
.cp-form-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, #FFC107, #FF8F00, #FFC107);
  background-size: 200% 100%;
  animation: cp-shimmer-bar 3s ease-in-out infinite;
}
@keyframes cp-shimmer-bar {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── INPUTS ── */
.cp-input-wrap { position: relative; width: 100%; }
.cp-input-label {
  font-family: 'Inter', system-ui;
  font-size: 0.78rem; font-weight: 700;
  color: rgba(0,0,0,0.5);
  text-transform: uppercase; letter-spacing: 0.08em;
  display: block; margin-bottom: 8px;
}
.cp-input {
  width: 100%;
  background: #F9F8F5;
  border: 1.5px solid rgba(0,0,0,0.08);
  border-radius: 14px;
  padding: 14px 18px;
  font-family: 'Inter', system-ui;
  font-size: 0.9rem; color: #0A0A0A;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
}
.cp-input::placeholder { color: rgba(0,0,0,0.28); }
.cp-input:focus {
  border-color: #FFC107;
  background: #FFFFFF;
  box-shadow: 0 0 0 4px rgba(255,193,7,0.1), 0 4px 16px rgba(0,0,0,0.06);
}
.cp-textarea {
  width: 100%;
  background: #F9F8F5;
  border: 1.5px solid rgba(0,0,0,0.08);
  border-radius: 14px;
  padding: 14px 18px;
  font-family: 'Inter', system-ui;
  font-size: 0.9rem; color: #0A0A0A;
  outline: none; resize: vertical; min-height: 140px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}
.cp-textarea::placeholder { color: rgba(0,0,0,0.28); }
.cp-textarea:focus {
  border-color: #FFC107;
  background: #FFFFFF;
  box-shadow: 0 0 0 4px rgba(255,193,7,0.1);
}

/* ── SELECT ── */
.cp-select {
  width: 100%;
  background: #F9F8F5;
  border: 1.5px solid rgba(0,0,0,0.08);
  border-radius: 14px;
  padding: 14px 18px;
  font-family: 'Inter', system-ui;
  font-size: 0.9rem; color: #0A0A0A;
  outline: none; appearance: none; cursor: pointer;
  transition: all 0.3s ease;
}
.cp-select:focus {
  border-color: #FFC107;
  background: #FFFFFF;
  box-shadow: 0 0 0 4px rgba(255,193,7,0.1);
}

/* ── SUBMIT BUTTON ── */
.cp-submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #FFC107, #FF8F00);
  color: #000;
  border: none; cursor: pointer;
  font-family: 'Inter', system-ui;
  font-weight: 800; font-size: 1rem;
  padding: 18px 32px; border-radius: 50px;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  box-shadow: 0 8px 30px rgba(255,193,7,0.4);
  transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
  margin-top: 8px;
}
.cp-submit-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(255,193,7,0.5);
}
.cp-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── FAQ ── */
.cp-faq-item {
  background: rgba(255,255,255,0.85);
  border: 1.5px solid rgba(0,0,0,0.07);
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}
.cp-faq-item:hover { border-color: rgba(255,193,7,0.3); }
.cp-faq-item.open { border-color: rgba(255,193,7,0.4); box-shadow: 0 8px 24px rgba(255,193,7,0.08); }
.cp-faq-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 22px 28px; cursor: pointer;
  background: transparent; border: none; width: 100%; text-align: left;
  font-family: 'Inter', system-ui;
}
.cp-faq-body {
  max-height: 0; overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 0 28px;
}
.cp-faq-body.open { max-height: 300px; padding-bottom: 24px; }

/* ── SUCCESS STATE ── */
.cp-success-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; padding: 60px 20px; gap: 16px;
}

@keyframes cp-check-pop {
  0%   { transform: scale(0); opacity: 0; }
  70%  { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}
.cp-check-icon { animation: cp-check-pop 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }

/* ── NOISE OVERLAY ── */
.cp-noise::after {
  content: '';
  position: fixed; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
  pointer-events: none; z-index: 0;
}
`

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const infoBlocks = [
  { icon: <LocationOn sx={{ fontSize: 22, color: '#B8860B' }} />, title: 'Head Office', lines: ['InAcadFusion HQ', 'Innovation Hub, Tech Park'] },
  { icon: <Email sx={{ fontSize: 22, color: '#B8860B' }} />, title: 'Email Us', lines: ['hello@inacadfusion.com'] },
  { icon: <Phone sx={{ fontSize: 22, color: '#B8860B' }} />, title: 'Call Us', lines: ['+1 (800) 123-4567', 'Mon–Fri, 9 am – 6 pm'] },
  { icon: <Schedule sx={{ fontSize: 22, color: '#B8860B' }} />, title: 'Working Hours', lines: ['Monday – Friday', '09:00 am – 06:00 pm'] },
]

const faqs = [
  { q: 'How do I get started as a student?', a: 'Register as a student, complete your profile, and start browsing available projects. You can also upload your own project to showcase your skills to startups.' },
  { q: 'Can startups post multiple projects?', a: 'Yes! Startups can post and manage as many projects as they need. Each project can have unique requirements, skill tags, and a custom collaboration timeline.' },
  { q: 'How are experience letters issued?', a: 'Once a collaboration is marked complete and all milestones are met, the startup can issue a cryptographically-verifiable experience letter directly through the platform.' },
  { q: 'Is there a cost to use InAcadFusion?', a: 'InAcadFusion is completely free for students. Startups can access essential features at no cost, with premium options available for advanced analytics and team tools.' },
  { q: 'How does the collaboration process work?', a: "A student applies to a startup's project, the startup reviews and accepts, then both sides work through structured milestones tracked on the platform." },
]

const inquiryTypes = ['General Inquiry', 'Student Support', 'Startup Partnership', 'Technical Issue', 'Press & Media', 'Other']

// ─────────────────────────────────────────────────────────────────────────────
// FAQ ITEM
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// SPLINE HERO COMPONENT  — dark, cinematic, with spotlight + 3D scene
// ─────────────────────────────────────────────────────────────────────────────
function SplineHero() {
  const containerRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const mouseX = useSpring(0, { bounce: 0 })
  const mouseY = useSpring(0, { bounce: 0 })

  const spotlightLeft = useTransform(mouseX, (x) => `${x - 150}px`)
  const spotlightTop  = useTransform(mouseY, (y) => `${y - 150}px`)

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const { left, top } = containerRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - left)
    mouseY.set(e.clientY - top)
  }, [mouseX, mouseY])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseenter', () => setHovered(true))
    el.addEventListener('mouseleave', () => setHovered(false))
    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseenter', () => setHovered(true))
      el.removeEventListener('mouseleave', () => setHovered(false))
    }
  }, [handleMouseMove])

  return (
    <Box
      ref={containerRef}
      className="cp-hero-dark"
      sx={{ pt: { xs: 10, md: 0 } }}
    >
      {/* Grid overlay */}
      <div className="cp-hero-grid" />

      {/* Mouse-tracking Spotlight */}
      <motion.div
        style={{
          position: 'absolute',
          width: 300, height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.07) 0%, transparent 70%)',
          filter: 'blur(20px)',
          pointerEvents: 'none',
          zIndex: 2,
          left: spotlightLeft,
          top: spotlightTop,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Mustard glow orb — bottom left */}
      <Box sx={{
        position: 'absolute', bottom: '-10%', left: '-5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,193,7,0.08) 0%, transparent 65%)',
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 1,
      }} />

      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 }, position: 'relative', zIndex: 10 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', minHeight: '100vh', gap: { xs: 6, md: 0 } }}>

          {/* ── LEFT: Text Content ── */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', pr: { md: 6 }, pt: { xs: 8, md: 0 } }}>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="cp-hero-badge">
                ✦ Contact InAcadFusion
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
              <Typography variant="h1" sx={{
                fontFamily: '"Inter", system-ui, sans-serif',
                fontWeight: 900,
                fontSize: { xs: '2.8rem', sm: '3.8rem', md: '4.8rem', lg: '5.5rem' },
                lineHeight: 1.0, letterSpacing: '-0.04em',
                color: '#FFFFFF', mb: 3,
              }}>
                We'd Love to
                <br />
                <Box component="span" sx={{
                  background: 'linear-gradient(135deg, #FFC107 0%, #FFD54F 50%, #FFC107 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 4px 20px rgba(255,193,7,0.4))',
                }}>
                  Hear From You.
                </Box>
              </Typography>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.2 }}>
              <Typography sx={{
                fontFamily: '"Inter", system-ui, sans-serif',
                fontWeight: 400, fontSize: { xs: '0.95rem', md: '1.1rem' },
                lineHeight: 1.8, color: 'rgba(255,255,255,0.5)',
                maxWidth: 500, mb: 5,
              }}>
                Fill out the form below and our team will get back to you within 1–2 business days.
                Whether you're a student or a startup — we're here to help.
              </Typography>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.3 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <a
                  href="#contact-form"
                  className="cp-hero-cta"
                  onClick={(e) => { e.preventDefault(); document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }) }}
                >
                  <Send sx={{ fontSize: 16 }} />
                  Send a Message
                </a>
                <button
                  className="cp-hero-ghost"
                  onClick={() => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View FAQs <ArrowForward sx={{ fontSize: 16 }} />
                </button>
              </Box>
            </motion.div>

            {/* Mini stats row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
              <Box sx={{ display: 'flex', gap: 4, mt: 6, pt: 5, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                {[['< 24h', 'Response Time'], ['500+', 'Students Helped'], ['150+', 'Startups Onboarded']].map(([val, lbl]) => (
                  <Box key={lbl}>
                    <Typography sx={{ fontFamily: '"Inter", system-ui', fontWeight: 900, fontSize: { xs: '1.4rem', md: '1.8rem' }, color: '#FFC107', lineHeight: 1, letterSpacing: '-0.03em' }}>{val}</Typography>
                    <Typography sx={{ fontFamily: '"Inter", system-ui', fontWeight: 600, fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', mt: 0.5 }}>{lbl}</Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Box>

          {/* ── RIGHT: 3D Spline Scene ── */}
          <Box sx={{
            flex: 1,
            height: { xs: '50vh', md: '100vh' },
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: '100%', height: '100%' }}
            >
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                style={{ width: '100%', height: '100%' }}
              />
            </motion.div>
          </Box>

        </Box>
      </Container>
    </Box>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ ITEM
// ─────────────────────────────────────────────────────────────────────────────
function FaqItem({ faq, index }) {

  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={`cp-faq-item ${open ? 'open' : ''}`}>
        <button className="cp-faq-header" onClick={() => setOpen(!open)}>
          <Typography sx={{ fontFamily: '"Inter", system-ui', fontWeight: 700, fontSize: { xs: '0.95rem', md: '1rem' }, color: '#0A0A0A', textAlign: 'left', lineHeight: 1.4 }}>
            {faq.q}
          </Typography>
          <Box sx={{ flexShrink: 0, ml: 2, width: 32, height: 32, borderRadius: '50%', background: open ? 'linear-gradient(135deg, #FFC107, #FF8F00)' : 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
            {open
              ? <ExpandLess sx={{ fontSize: 18, color: '#000' }} />
              : <ExpandMore sx={{ fontSize: 18, color: 'rgba(0,0,0,0.5)' }} />
            }
          </Box>
        </button>
        <div className={`cp-faq-body ${open ? 'open' : ''}`}>
          <Typography sx={{ fontFamily: '"Inter", system-ui', fontWeight: 400, fontSize: '0.9rem', lineHeight: 1.75, color: 'rgba(0,0,0,0.55)' }}>
            {faq.a}
          </Typography>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', inquiry: '', company: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await simulateApiCall({ success: true })
      setSubmitted(true)
    } catch {
      setSnackbar({ open: true, message: 'Something went wrong. Please try again.', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Box className="cp-root cp-noise" sx={{ position: 'relative' }}>

        {/* Ambient blobs */}
        <Box className="cp-blob1" sx={{ position: 'fixed', left: '-5%', top: '10%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,193,7,0.14) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: 0, pointerEvents: 'none' }} />
        <Box className="cp-blob2" sx={{ position: 'fixed', right: '-8%', top: '40%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,152,0,0.1) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: 0, pointerEvents: 'none' }} />

        {/* ═══════════════════════════════════════════════
            SPLINE 3D HERO (Dark)
        ═══════════════════════════════════════════════ */}
        <SplineHero />

        {/* ═══════════════════════════════════════════════
            TWO-COLUMN LAYOUT
        ═══════════════════════════════════════════════ */}
        <Box id="contact-form" sx={{ position: 'relative', zIndex: 1, py: { xs: 8, md: 14 } }}>
          <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
            <Grid container spacing={{ xs: 6, md: 8 }} alignItems="flex-start">

              {/* ── LEFT — Info ── */}
              <Grid item xs={12} md={5}>
                <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                  <span className="cp-label" style={{ display: 'inline-flex', marginBottom: 24 }}>Contact Info</span>
                  <Typography variant="h2" sx={{ fontFamily: '"Inter", system-ui', fontWeight: 900, fontSize: { xs: '2rem', md: '2.8rem' }, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#0A0A0A', mb: 3 }}>
                    Get in Touch With <Box component="span" className="cp-gradient-text">Our Team</Box>
                  </Typography>
                  <Typography sx={{ fontFamily: '"Inter", system-ui', fontWeight: 400, fontSize: '0.95rem', lineHeight: 1.8, color: 'rgba(0,0,0,0.45)', mb: 6 }}>
                    Whether you're a student looking for your next challenge or a startup searching for fresh talent — we're just a message away.
                  </Typography>

                  <Grid container spacing={2.5}>
                    {infoBlocks.map((block, i) => (
                      <Grid item xs={12} sm={6} key={i}>
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                          <div className="cp-info-block">
                            <div className="cp-info-icon">{block.icon}</div>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Typography sx={{ fontFamily: '"Inter", system-ui', fontWeight: 800, fontSize: '0.72rem', color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', mb: 0.2 }}>{block.title}</Typography>
                              {block.lines.map((l, j) => (
                                <Typography key={j} sx={{ fontFamily: '"Inter", system-ui', fontWeight: 600, fontSize: '0.92rem', color: '#0A0A0A', lineHeight: 1.3 }}>{l}</Typography>
                              ))}
                            </Box>
                          </div>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Social trust badges */}
                  <Box sx={{ mt: 6, pt: 5, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                    <Typography sx={{ fontFamily: '"Inter", system-ui', fontWeight: 700, fontSize: '0.75rem', color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', mb: 3 }}>Trusted By Students & Startups Across</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {['500+ Students', '150+ Startups', '300+ Projects', '98% Satisfaction'].map((t) => (
                        <Box key={t} sx={{ px: 2.5, py: 1, borderRadius: '50px', background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                          <Typography sx={{ fontFamily: '"Inter", system-ui', fontWeight: 700, fontSize: '0.78rem', color: '#0A0A0A' }}>{t}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </motion.div>
              </Grid>

              {/* ── RIGHT — Form ── */}
              <Grid item xs={12} md={7}>
                <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>
                  <div className="cp-form-card">
                    {submitted ? (
                      <div className="cp-success-state">
                        <CheckCircle className="cp-check-icon" sx={{ fontSize: 72, color: '#FFC107' }} />
                        <Typography sx={{ fontFamily: '"Inter", system-ui', fontWeight: 900, fontSize: '1.8rem', color: '#0A0A0A', letterSpacing: '-0.02em' }}>Message Sent!</Typography>
                        <Typography sx={{ fontFamily: '"Inter", system-ui', fontWeight: 400, fontSize: '0.95rem', color: 'rgba(0,0,0,0.45)', maxWidth: 360, lineHeight: 1.7 }}>
                          Thank you for reaching out. Our team will get back to you within 1–2 business days.
                        </Typography>
                        <Box component="button" onClick={() => { setSubmitted(false); setForm({ firstName: '', lastName: '', email: '', phone: '', inquiry: '', company: '', message: '' }) }}
                          sx={{ mt: 2, px: 4, py: 1.5, borderRadius: '50px', background: 'linear-gradient(135deg,#FFC107,#FF8F00)', color: '#000', border: 'none', cursor: 'pointer', fontFamily: '"Inter", system-ui', fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 4px 16px rgba(255,193,7,0.3)', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)' } }}>
                          Send Another Message
                        </Box>
                      </div>
                    ) : (
                      <Box component="form" onSubmit={handleSubmit}>
                        <Typography sx={{ fontFamily: '"Inter", system-ui', fontWeight: 900, fontSize: '1.5rem', color: '#0A0A0A', letterSpacing: '-0.02em', mb: 1 }}>Send Us a Message</Typography>
                        <Typography sx={{ fontFamily: '"Inter", system-ui', fontWeight: 400, fontSize: '0.875rem', color: 'rgba(0,0,0,0.4)', mb: 4 }}>Fill in the details below and we'll be in touch shortly.</Typography>

                        {/* Row 1: First + Last */}
                        <Grid container spacing={2} sx={{ mb: 2.5 }}>
                          <Grid item xs={12} sm={6}>
                            <div className="cp-input-wrap">
                              <label className="cp-input-label">First Name</label>
                              <input className="cp-input" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Jane" required />
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <div className="cp-input-wrap">
                              <label className="cp-input-label">Last Name</label>
                              <input className="cp-input" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Smith" required />
                            </div>
                          </Grid>
                        </Grid>

                        {/* Row 2: Email */}
                        <Box sx={{ mb: 2.5 }}>
                          <div className="cp-input-wrap">
                            <label className="cp-input-label">Email Address</label>
                            <input className="cp-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" required />
                          </div>
                        </Box>

                        {/* Row 3: Phone */}
                        <Box sx={{ mb: 2.5 }}>
                          <div className="cp-input-wrap">
                            <label className="cp-input-label">Phone (Optional)</label>
                            <input className="cp-input" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                          </div>
                        </Box>

                        {/* Row 4: Inquiry Type + Company */}
                        <Grid container spacing={2} sx={{ mb: 2.5 }}>
                          <Grid item xs={12} sm={6}>
                            <div className="cp-input-wrap">
                              <label className="cp-input-label">Inquiry Type</label>
                              <div style={{ position: 'relative' }}>
                                <select className="cp-select" name="inquiry" value={form.inquiry} onChange={handleChange} required>
                                  <option value="" disabled>Select type</option>
                                  {inquiryTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                                </select>
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <div className="cp-input-wrap">
                              <label className="cp-input-label">Company / University</label>
                              <input className="cp-input" name="company" value={form.company} onChange={handleChange} placeholder="Your organization" />
                            </div>
                          </Grid>
                        </Grid>

                        {/* Row 5: Message */}
                        <Box sx={{ mb: 3 }}>
                          <div className="cp-input-wrap">
                            <label className="cp-input-label">Your Message</label>
                            <textarea className="cp-textarea" name="message" value={form.message} onChange={handleChange} placeholder="Tell us how we can help you..." required />
                          </div>
                        </Box>

                        <button type="submit" className="cp-submit-btn" disabled={loading}>
                          {loading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ width: 18, height: 18, borderRadius: '50%', border: '2.5px solid rgba(0,0,0,0.15)', borderTopColor: '#000', animation: 'spin 0.8s linear infinite', '@keyframes spin': { to: { transform: 'rotate(360deg)' } } }} />
                              Sending...
                            </Box>
                          ) : (
                            <>
                              <Send sx={{ fontSize: 18 }} />
                              Send Message
                            </>
                          )}
                        </button>
                      </Box>
                    )}
                  </div>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* ═══════════════════════════════════════════════
            FAQ SECTION
        ═══════════════════════════════════════════════ */}
        <Box sx={{ position: 'relative', zIndex: 1, py: { xs: 10, md: 16 }, borderTop: '1px solid rgba(0,0,0,0.06)', background: 'linear-gradient(180deg, transparent, rgba(255,193,7,0.02))' }}>
          <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
            <Grid container spacing={{ xs: 6, md: 12 }} alignItems="flex-start">
              <Grid item xs={12} md={4}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                  <Box sx={{ position: 'sticky', top: 120 }}>
                    <span className="cp-label" style={{ display: 'inline-flex', marginBottom: 20 }}>FAQ</span>
                    <Typography variant="h2" sx={{ fontFamily: '"Inter", system-ui', fontWeight: 900, fontSize: { xs: '2rem', md: '2.8rem' }, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#0A0A0A', mb: 3 }}>
                      Frequently Asked <Box component="span" className="cp-gradient-text">Questions</Box>
                    </Typography>
                    <Typography sx={{ fontFamily: '"Inter", system-ui', fontWeight: 400, fontSize: '0.95rem', lineHeight: 1.8, color: 'rgba(0,0,0,0.43)' }}>
                      Can't find what you're looking for? Reach out to us directly via the form above.
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {faqs.map((faq, i) => <FaqItem key={i} faq={faq} index={i} />)}
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* ── FOOTER ── */}
        <CinematicFooter />
      </Box>

      <Snackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} />
    </>
  )
}
