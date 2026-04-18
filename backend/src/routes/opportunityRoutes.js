const express = require('express')
const opportunityController = require('../controllers/opportunityController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', authMiddleware, (req, res) => opportunityController.getAll(req, res))
router.get('/stats', authMiddleware, (req, res) => opportunityController.getStats(req, res))
router.get('/:id', authMiddleware, (req, res) => opportunityController.getById(req, res))
router.post('/', authMiddleware, (req, res) => opportunityController.create(req, res))

module.exports = router
