const express = require('express');
const { approveProfessional } = require('../controllers/professionalController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.patch('/professionals/:id/approve', authenticate, authorize('admin'), approveProfessional);

module.exports = router;
