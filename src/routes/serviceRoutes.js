const express = require('express');
const { listServices } = require('../controllers/serviceController');

const router = express.Router();

router.get('/', listServices);

module.exports = router;
