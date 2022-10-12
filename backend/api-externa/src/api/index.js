const express = require('express');
const productos = require('./productos');

const router = express.Router();
router.use(productos);

router.get('/', (req, res) => {
  res.json({ message: 'Ruta inválida' });
});

module.exports = router;