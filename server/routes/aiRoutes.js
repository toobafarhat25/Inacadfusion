const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Project = require('../models/Project');

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
    // Calling the Python AI Worker
    const response = await fetch('http://127.0.0.1:8000/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, top_n: top_n || 5 }),
    });

    if (!response.ok) {
      throw new Error('AI Worker communication failed');
    }

    const aiData = await response.json();
    
    // The AI returns project IDs and metadata. 
    // We can return this directly or hydrate it with more DB data if needed.
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

module.exports = router;
