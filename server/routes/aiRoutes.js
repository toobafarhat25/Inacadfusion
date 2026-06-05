const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Resolve the AI worker base URL from env var (set on Render), fallback to localhost for local dev
const AI_WORKER_URL = process.env.AI_WORKER_URL || 'http://127.0.0.1:8000';

// Helper: fetch with a custom timeout
const fetchWithTimeout = (url, options, timeoutMs = 10000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timer));
};

// Helper: check if AI is awake and model is loaded (single check, no loops)
// Loops are now on the FRONTEND to avoid Render's 30s request timeout.
const checkAIReady = async () => {
  try {
    const r = await fetchWithTimeout(`${AI_WORKER_URL}/health`, {}, 8000);
    if (!r.ok) return false;
    const body = await r.json();
    return body.model_loaded === true;
  } catch (_) {
    return false;
  }
};

// Helper: ping the AI worker to wake it from sleep (fire and forget style)
const pingAI = () => {
  fetchWithTimeout(`${AI_WORKER_URL}/health`, {}, 6000).catch(() => {});
};

/**
 * @desc    Get AI recommendations based on student query
 * @route   POST /api/ai/recommend
 * @access  Private (Student)
 *
 * Strategy: Check if model is ready. If not, return 503 { waking: true }.
 * The FRONTEND retries every 8 seconds. This prevents Render's 30s timeout from killing us.
 */
router.post('/recommend', protect, async (req, res) => {
  const { query, top_n } = req.body;

  if (!query) {
    return res.status(400).json({ message: 'Please provide a search query' });
  }

  try {
    const isReady = await checkAIReady();

    if (!isReady) {
      // Trigger a wake-up ping in the background, then tell frontend to retry
      pingAI();
      return res.status(503).json({
        waking: true,
        message: 'AI engine is warming up. Please wait a moment and try again.'
      });
    }

    // Model is ready — send the actual recommendation request
    const response = await fetchWithTimeout(
      `${AI_WORKER_URL}/recommend`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, top_n: top_n || 5 }),
      },
      12000
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
 * @desc    Get AI recommendations for discovering students (Startup)
 * @route   POST /api/ai/recommend-students
 * @access  Private (Startup)
 */
router.post('/recommend-students', protect, async (req, res) => {
  const { query, top_n } = req.body;

  if (!query) {
    return res.status(400).json({ message: 'Please provide a search query' });
  }

  try {
    const isReady = await checkAIReady();

    if (!isReady) {
      pingAI();
      return res.status(503).json({
        waking: true,
        message: 'AI engine is warming up. Please wait a moment and try again.'
      });
    }

    const response = await fetchWithTimeout(
      `${AI_WORKER_URL}/recommend_students`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, top_n: top_n || 9 }),
      },
      12000
    );

    if (!response.ok) {
      throw new Error(`AI Worker returned ${response.status}`);
    }

    const aiData = await response.json();

    res.status(200).json({
      success: true,
      data: aiData.data || []
    });

  } catch (error) {
    console.error('AI Student Recommend Error:', error.message);
    res.status(500).json({
      message: 'AI Service is currently unavailable. Please try standard search.',
      error: error.message
    });
  }
});

/**
 * @desc    Health-check proxy for the AI worker
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
