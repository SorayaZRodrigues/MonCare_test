const express = require('express');
const { approveProfessional } = require('../controllers/professionalController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin actions
 */

/**
 * @swagger
 * /admin/professionals/{id}/approve:
 *   patch:
 *     summary: Approve a professional
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Professional id
 *     responses:
 *       200:
 *         description: Professional approved successfully
 *       404:
 *         description: Professional not found
 */
router.patch('/professionals/:id/approve', authenticate, authorize('admin'), approveProfessional);

module.exports = router;
