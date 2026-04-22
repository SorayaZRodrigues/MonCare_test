const express = require('express');
const { getPatient, updatePatient } = require('../controllers/patientController');
const { authenticate } = require('../middleware/authMiddleware');
const { allowSelfOrAdmin } = require('../middleware/accessMiddleware');

const router = express.Router();

router.get('/:id', authenticate, allowSelfOrAdmin('id'), getPatient);
router.put('/:id', authenticate, allowSelfOrAdmin('id'), updatePatient);

module.exports = router;
