const applicationRepository = require('../repositories/applicationRepository')
const userRepository = require('../repositories/userRepository')
const opportunityRepository = require('../repositories/opportunityRepository')
const aiService = require('./aiService')
const logger = require('../utils/logger')

class ApplicationService {
    async apply(userId, opportunityId, generateType = 'all') {
        const existing = await applicationRepository.findByUserAndOpportunity(userId, opportunityId)
        if (existing) {
            throw new Error('You have already applied to this opportunity')
        }

        const user = await userRepository.findById(userId)
        if (!user) throw new Error('User not found')

        const opportunity = await opportunityRepository.findById(opportunityId)
        if (!opportunity) throw new Error('Opportunity not found')

        if (new Date(opportunity.deadline) < new Date()) {
            throw new Error('This opportunity has passed its deadline')
        }

        let coverLetter = ''
        let emailDraft = ''

        if (generateType === 'all' || generateType === 'coverLetter') {
            coverLetter = aiService.generateCoverLetter(user, opportunity)
        }
        if (generateType === 'all' || generateType === 'email') {
            emailDraft = aiService.generateEmail(user, opportunity)
        }

        const application = await applicationRepository.create({
            userId,
            opportunityId,
            coverLetter,
            emailDraft,
            status: 'pending'
        })

        logger.info('Application created', {
            userId,
            opportunityId,
            applicationId: application._id
        })

        return application.populate('opportunityId')
    }

    async getUserApplications(userId) {
        return applicationRepository.findByUser(userId)
    }

    async getApplicationById(id, userId) {
        const app = await applicationRepository.findById(id)
        if (!app) throw new Error('Application not found')
        if (app.userId.toString() !== userId.toString()) {
            throw new Error('Unauthorized access to application')
        }
        return app
    }

    async updateStatus(id, userId, status) {
        const app = await applicationRepository.findById(id)
        if (!app) throw new Error('Application not found')
        if (app.userId.toString() !== userId.toString()) {
            throw new Error('Unauthorized')
        }

        const updated = await applicationRepository.updateStatus(id, status)
        logger.info('Application status updated', { applicationId: id, status })
        return updated
    }

    async getDashboardStats(userId) {
        const applications = await applicationRepository.findByUser(userId)
        const breakdown = await applicationRepository.getStatusBreakdown(userId)

        const statusMap = {}
        breakdown.forEach(b => { statusMap[b._id] = b.count })

        return {
            totalApplications: applications.length,
            pending: statusMap.pending || 0,
            submitted: statusMap.submitted || 0,
            accepted: statusMap.accepted || 0,
            rejected: statusMap.rejected || 0
        }
    }

    async regenerateContent(applicationId, userId, contentType) {
        const app = await applicationRepository.findById(applicationId)
        if (!app) throw new Error('Application not found')
        if (app.userId.toString() !== userId.toString()) throw new Error('Unauthorized')

        const user = await userRepository.findById(userId)
        const opportunity = await opportunityRepository.findById(app.opportunityId)

        let update = {}
        if (contentType === 'coverLetter') {
            update.coverLetter = aiService.generateCoverLetter(user, opportunity)
        } else if (contentType === 'email') {
            update.emailDraft = aiService.generateEmail(user, opportunity)
        } else {
            throw new Error('Invalid content type for regeneration')
        }

        const updated = await require('../models/Application').findByIdAndUpdate(
            applicationId, update, { new: true }
        ).populate('opportunityId')

        logger.info('Content regenerated', { applicationId, contentType })
        return updated
    }
}

module.exports = new ApplicationService()
