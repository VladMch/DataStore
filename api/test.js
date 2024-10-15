const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
    try {
        res.json({ test: "success" });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
  });

  module.exports = router;
