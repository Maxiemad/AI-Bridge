const express = require('express')
const applicationController = require('../controllers/applicationController')
const authMiddleware = require('../middleware/authMiddleware')
const validate = require('../middleware/validate')

const router = express.Router()

const applySchema = {
    opportunityId: { required: true, type: 'string' }
}

const statusSchema = {
    status: { required: true, type: 'string', enum: ['pending', 'submitted', 'accepted', 'rejected'] }
}

router.post('/', authMiddleware, validate(applySchema), (req, res) => applicationController.apply(req, res))
router.get('/', authMiddleware, (req, res) => applicationController.getMyApplications(req, res))
router.get('/dashboard', authMiddleware, (req, res) => applicationController.getDashboard(req, res))
router.get('/:id', authMiddleware, (req, res) => applicationController.getById(req, res))
router.patch('/:id/status', authMiddleware, validate(statusSchema), (req, res) => applicationController.updateStatus(req, res))
router.post('/:id/regenerate', authMiddleware, (req, res) => applicationController.regenerate(req, res))

module.exports = router
