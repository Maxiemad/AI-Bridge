const applicationService = require('../services/applicationService')
const notificationService = require('../services/notificationService')

class ApplicationController {
    async apply(req, res) {
        try {
            const { opportunityId, generateType } = req.body
            const application = await applicationService.apply(req.userId, opportunityId, generateType)
            res.status(201).json(application)
        } catch (err) {
            let status = 500
            if (err.message.includes('already applied')) status = 409
            if (err.message.includes('not found')) status = 404
            if (err.message.includes('deadline')) status = 400
            res.status(status).json({ error: err.message })
        }
    }

    async getMyApplications(req, res) {
        try {
            const apps = await applicationService.getUserApplications(req.userId)
            res.json({ count: apps.length, data: apps })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async getById(req, res) {
        try {
            const app = await applicationService.getApplicationById(req.params.id, req.userId)
            res.json(app)
        } catch (err) {
            let status = err.message.includes('not found') ? 404 : 403
            res.status(status).json({ error: err.message })
        }
    }

    async updateStatus(req, res) {
        try {
            const { status } = req.body
            const updated = await applicationService.updateStatus(req.params.id, req.userId, status)
            res.json(updated)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    async regenerate(req, res) {
        try {
            const { contentType } = req.body
            const updated = await applicationService.regenerateContent(req.params.id, req.userId, contentType)
            res.json(updated)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    async getDashboard(req, res) {
        try {
            const stats = await applicationService.getDashboardStats(req.userId)
            const notifications = await notificationService.getAllNotifications(req.userId)
            res.json({ stats, notifications })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}

module.exports = new ApplicationController()
