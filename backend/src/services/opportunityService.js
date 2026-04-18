const opportunityRepository = require('../repositories/opportunityRepository')
const userRepository = require('../repositories/userRepository')
const aiService = require('./aiService')
const logger = require('../utils/logger')

class OpportunityService {
    constructor() {
        this.rankingStrategy = 'ai'
    }

    setRankingStrategy(strategy) {
        this.rankingStrategy = strategy
    }

    async getAll(filters) {
        if (filters.deadlineAfter === undefined) {
            filters.deadlineAfter = new Date()
        }
        return opportunityRepository.findAll(filters)
    }

    async getById(id) {
        const opp = await opportunityRepository.findById(id)
        if (!opp) throw new Error('Opportunity not found')
        return opp
    }

    async getRankedForUser(userId, filters = {}) {
        const user = await userRepository.findById(userId)
        if (!user) throw new Error('User not found')

        const opportunities = await this.getAll(filters)

        if (this.rankingStrategy === 'ai') {
            return aiService.rankOpportunities(user, opportunities)
        }

        return this._simpleSort(opportunities)
    }

    _simpleSort(opportunities) {
        return opportunities
            .map(o => ({ ...o.toObject(), relevanceScore: 0 }))
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    }

    async create(data) {
        const opp = await opportunityRepository.create(data)
        logger.info('Opportunity created', { id: opp._id, title: opp.title })
        return opp
    }

    async getUpcomingDeadlines(days = 7) {
        const start = new Date()
        const end = new Date()
        end.setDate(end.getDate() + days)
        return opportunityRepository.findByDeadlineRange(start, end)
    }

    async cleanupExpired() {
        const result = await opportunityRepository.markExpired()
        if (result.modifiedCount > 0) {
            logger.info('Marked expired opportunities', { count: result.modifiedCount })
        }
        return result
    }

    async getStats() {
        const total = await opportunityRepository.count()
        const upcoming = await this.getUpcomingDeadlines(7)
        return { totalActive: total, deadlineThisWeek: upcoming.length }
    }
}

module.exports = new OpportunityService()
