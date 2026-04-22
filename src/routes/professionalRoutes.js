const express = require('express');
const {
  getProfessional,
  updateProfessional,
  patchAvailability
} = require('../controllers/professionalController');
const { authenticate } = require('../middleware/authMiddleware');
const { allowSelfOrAdmin } = require('../middleware/accessMiddleware');

const router = express.Router();

router.get('/:id', authenticate, allowSelfOrAdmin('id'), getProfessional);
router.put('/:id', authenticate, allowSelfOrAdmin('id'), updateProfessional);
router.patch('/:id/availability', authenticate, allowSelfOrAdmin('id'), patchAvailability);

module.exports = router;
