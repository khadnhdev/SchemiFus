const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');
const elements = require('../data/elements');

// Trang chủ
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Trang Chủ',
    elements: elements,
    currentPath: req.path
  });
});

// API xử lý phản ứng
router.post('/api/reaction', async (req, res) => {
  try {
    const { selectedElements, temperature, pressure, catalyst } = req.body;
    
    const result = await geminiService.processReaction(
      selectedElements, 
      temperature, 
      pressure, 
      catalyst
    );
    
    res.json(result);
  } catch (error) {
    console.error('Lỗi khi xử lý phản ứng:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi xử lý phản ứng' });
  }
});

// Trang sổ tay hóa học
router.get('/notebook', (req, res) => {
  res.render('notebook', { 
    title: 'Sổ Tay Hóa Học',
    currentPath: req.path
  });
});

// Trang thành tích
router.get('/achievements', (req, res) => {
  res.render('achievements', { 
    title: 'Thành Tích',
    currentPath: req.path
  });
});

module.exports = router; 