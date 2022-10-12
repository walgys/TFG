const express = require('express');
const query = require('../db/productos');
const router = express.Router();

router.get('/productos', async (req, res) => {
  try {
    productos = await query.queryProductos();
    res.status(200).json(productos).end();
  } catch (err) {
    console.log(err);
    res.status(422).end();
  }
});

module.exports = router;