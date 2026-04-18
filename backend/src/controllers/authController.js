const authService = require('../services/authService')

class AuthController {
    async register(req, res) {
        try {
            const { name, email, password, skills, interests } = req.body
            const result = await authService.register(name, email, password, skills, interests)
            res.status(201).json(result)
        } catch (err) {
            const status = err.message.includes('already registered') ? 409 : 500
            res.status(status).json({ error: err.message })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body
            const result = await authService.login(email, password)
            res.json(result)
        } catch (err) {
            const status = err.message.includes('Invalid') ? 401 : 500
            res.status(status).json({ error: err.message })
        }
    }

    async getProfile(req, res) {
        try {
            const profile = await authService.getProfile(req.userId)
            res.json(profile)
        } catch (err) {
            res.status(404).json({ error: err.message })
        }
    }

    async updateProfile(req, res) {
        try {
            const updated = await authService.updateProfile(req.userId, req.body)
            res.json(updated)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }
}

module.exports = new AuthController()
