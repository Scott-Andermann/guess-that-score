const express = require('express');
const router = express.Router();
const fact = require('./facts');
const game = require('./games');

router.get('/facts', fact);
router.get('/games', game);
module.exports = router;