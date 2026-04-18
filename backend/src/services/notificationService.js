const opportunityService = require('./opportunityService')
const applicationRepository = require('../repositories/applicationRepository')
const userRepository = require('../repositories/userRepository')
const logger = require('../utils/logger')

class NotificationService {
    async getDeadlineReminders(userId) {
        const user = await userRepository.findById(userId)
        if (!user) return []

        const upcoming = await opportunityService.getUpcomingDeadlines(3)
        const userApps = await applicationRepository.findByUser(userId)
        const appliedIds = new Set(userApps.map(a => a.opportunityId._id.toString()))

        const reminders = upcoming
            .filter(opp => !appliedIds.has(opp._id.toString()))
            .map(opp => {
                const daysLeft = Math.ceil((new Date(opp.deadline) - new Date()) / (1000 * 60 * 60 * 24))
                return {
                    type: 'deadline',
                    message: `${opp.title} closes in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
                    opportunity: opp,
                    urgency: daysLeft <= 1 ? 'critical' : daysLeft <= 3 ? 'high' : 'normal'
                }
            })

        return reminders
    }

    async getStatusNotifications(userId) {
        const applications = await applicationRepository.findByUser(userId)
        const recent = applications.filter(app => {
            const updated = new Date(app.updatedAt)
            const twoDaysAgo = new Date()
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
            return updated > twoDaysAgo && app.status !== 'pending'
        })

        return recent.map(app => ({
            type: 'status_update',
            message: `Your application for ${app.opportunityId.title} is now ${app.status}`,
            application: app,
            urgency: app.status === 'accepted' ? 'high' : 'normal'
        }))
    }

    async getAllNotifications(userId) {
        const deadlines = await this.getDeadlineReminders(userId)
        const statusUpdates = await this.getStatusNotifications(userId)

        const all = [...deadlines, ...statusUpdates]
        all.sort((a, b) => {
            const urgencyOrder = { critical: 0, high: 1, normal: 2 }
            return (urgencyOrder[a.urgency] || 2) - (urgencyOrder[b.urgency] || 2)
        })

        logger.info('Fetched notifications', { userId, count: all.length })
        return all
    }
}

module.exports = new NotificationService()
