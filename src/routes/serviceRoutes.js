const express = require('express');
const { listServices } = require('../controllers/serviceController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Healthcare services
 */

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Get all available healthcare services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of services returned successfully
 */
router.get('/', listServices);

module.exports = router;
