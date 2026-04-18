const express = require('express')
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')
const validate = require('../middleware/validate')

const router = express.Router()

const registerSchema = {
    name: { required: true, type: 'string', minLength: 2 },
    email: { required: true, type: 'string', email: true },
    password: { required: true, type: 'string', minLength: 6 }
}

const loginSchema = {
    email: { required: true, type: 'string', email: true },
    password: { required: true, type: 'string' }
}

router.post('/register', validate(registerSchema), (req, res) => authController.register(req, res))
router.post('/login', validate(loginSchema), (req, res) => authController.login(req, res))
router.get('/profile', authMiddleware, (req, res) => authController.getProfile(req, res))
router.put('/profile', authMiddleware, (req, res) => authController.updateProfile(req, res))

module.exports = router
