const opportunityService = require('../services/opportunityService')

class OpportunityController {
    async getAll(req, res) {
        try {
            const filters = {}
            if (req.query.type) filters.type = req.query.type
            if (req.query.tags) filters.tags = req.query.tags.split(',')

            const opportunities = await opportunityService.getRankedForUser(req.userId, filters)
            res.json({ count: opportunities.length, data: opportunities })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async getById(req, res) {
        try {
            const opp = await opportunityService.getById(req.params.id)
            res.json(opp)
        } catch (err) {
            const status = err.message.includes('not found') ? 404 : 500
            res.status(status).json({ error: err.message })
        }
    }

    async create(req, res) {
        try {
            const opp = await opportunityService.create(req.body)
            res.status(201).json(opp)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    async getStats(req, res) {
        try {
            const stats = await opportunityService.getStats()
            res.json(stats)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}

module.exports = new OpportunityController()
