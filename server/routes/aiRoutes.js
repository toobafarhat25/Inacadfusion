const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Resolve the AI worker base URL from env var (set on Render), fallback to localhost for local dev
const AI_WORKER_URL = process.env.AI_WORKER_URL || 'http://127.0.0.1:8000';

// Helper: fetch with a custom timeout
const fetchWithTimeout = (url, options, timeoutMs = 60000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timer));
};

// Helper: wake up the AI worker (ping /health), retrying every 3s up to maxWaitMs
const wakeUpAI = async (maxWaitMs = 55000) => {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    try {
      const r = await fetchWithTimeout(`${AI_WORKER_URL}/health`, {}, 5000);
      if (r.ok) {
        const body = await r.json();
        if (body.model_loaded) return true;   // model is ready
      }
    } catch (_) { /* still sleeping */ }
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  return false; // timed out waiting
};

/**
 * @desc    Get AI recommendations based on student query
 * @route   POST /api/ai/recommend
 * @access  Private (Student)
 */
router.post('/recommend', protect, async (req, res) => {
  const { query, top_n } = req.body;

  if (!query) {
    return res.status(400).json({ message: 'Please provide a search query' });
  }

  try {
    // First ping the health endpoint — this wakes up the Render free-tier service
    // and waits until the ONNX model is actually loaded before sending the real query
    const isReady = await wakeUpAI(55000);  // wait up to 55 seconds
    if (!isReady) {
      return res.status(503).json({
        message: 'AI Service took too long to wake up. Please try again in a moment.',
        waking: true
      });
    }

    // Now send the actual recommendation request
    const response = await fetchWithTimeout(
      `${AI_WORKER_URL}/recommend`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, top_n: top_n || 5 }),
      },
      15000
    );

    if (!response.ok) {
      throw new Error(`AI Worker returned ${response.status}`);
    }

    const aiData = await response.json();

    res.status(200).json({
      success: true,
      data: aiData.data || aiData.matches || []
    });

  } catch (error) {
    console.error('AI Recommend Error:', error.message);
    res.status(500).json({
      message: 'AI Service is currently unavailable. Please try standard search.',
      error: error.message
    });
  }
});

/**
 * @desc    Health-check proxy for the AI worker (so frontend can poll)
 * @route   GET /api/ai/health
 * @access  Private
 */
router.get('/health', protect, async (req, res) => {
  try {
    const r = await fetchWithTimeout(`${AI_WORKER_URL}/health`, {}, 8000);
    const body = await r.json();
    res.status(200).json(body);
  } catch (err) {
    res.status(503).json({ status: 'offline', model_loaded: false });
  }
});

module.exports = router;
