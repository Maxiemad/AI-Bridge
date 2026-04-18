const logger = require('../utils/logger')

class CoverLetterGenerator {
    generate(user, opportunity) {
        const greeting = this._pickGreeting()
        const skillMention = user.skills.length > 0
            ? `With hands-on experience in ${this._joinNatural(user.skills.slice(0, 4))}`
            : 'With a strong drive to learn and grow'

        const interestHook = user.interests.length > 0
            ? `My interest in ${user.interests[0]} aligns closely with what ${opportunity.organization || 'your organization'} is working on.`
            : `I am excited about the work being done at ${opportunity.organization || 'your organization'}.`

        return `${greeting},

I am writing to express my interest in ${opportunity.title}. ${skillMention}, I believe I can contribute meaningfully to this ${opportunity.type}.

${interestHook}

${this._getBodyByType(opportunity.type, user)}

I would welcome the chance to discuss how my background fits your needs. Thank you for considering my application.

Best regards,
${user.name}`
    }

    _pickGreeting() {
        const options = ['Dear Hiring Team', 'Dear Selection Committee', 'Hello', 'Dear Team']
        return options[Math.floor(Math.random() * options.length)]
    }

    _joinNatural(items) {
        if (items.length === 0) return ''
        if (items.length === 1) return items[0]
        if (items.length === 2) return `${items[0]} and ${items[1]}`
        return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1]
    }

    _getBodyByType(type, user) {
        const level = user.experience || 'student'
        const bodies = {
            hackathon: `I thrive in fast-paced collaborative settings and have worked on projects that push creative boundaries. Building something under pressure is where I do my best work.`,
            internship: `As a ${level}-level professional, I am looking for hands-on experience that will deepen my practical skills and expose me to real-world challenges.`,
            grant: `I have been developing ideas that could benefit from dedicated funding and mentorship. This grant would accelerate the work I have already started.`,
            fellowship: `This fellowship represents a unique opportunity to combine structured learning with practical impact, which is exactly the direction I want to take.`,
            competition: `I enjoy solving complex problems under constraints. Competitions push me to think differently and I have consistently performed well in team settings.`,
            job: `I am ready to take the next step in my career and this role matches both my skill set and long-term goals.`,
            collaboration: `I believe in the power of working with others who share a vision. I would love to bring my skills to this collaborative effort.`
        }
        return bodies[type] || bodies.internship
    }
}

class EmailDraftGenerator {
    generate(user, opportunity) {
        const subject = `Application for ${opportunity.title}`
        const opening = this._pickOpening()

        return `Subject: ${subject}

${opening},

My name is ${user.name} and I recently came across the ${opportunity.title} opportunity${opportunity.source ? ' on ' + opportunity.source : ''}. I wanted to reach out directly to express my interest.

${this._buildPitch(user, opportunity)}

I have attached my resume for your reference. I would be happy to provide any additional information or schedule a brief conversation at your convenience.

Thank you for your time.

Warm regards,
${user.name}
${user.email}`
    }

    _pickOpening() {
        const options = ['Hi there', 'Hello', 'Good day', 'Hi']
        return options[Math.floor(Math.random() * options.length)]
    }

    _buildPitch(user, opportunity) {
        let pitch = ''

        if (user.skills.length > 0) {
            pitch += `My background includes ${user.skills.slice(0, 3).join(', ')} which I think would be valuable for this ${opportunity.type}. `
        }

        if (user.interests.length > 0) {
            const overlap = opportunity.tags.filter(t =>
                user.interests.some(i => i.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(i.toLowerCase()))
            )
            if (overlap.length > 0) {
                pitch += `I noticed this opportunity involves ${overlap.join(' and ')}, which is something I am particularly passionate about.`
            }
        }

        if (!pitch) {
            pitch = `I am genuinely excited about this opportunity and would love the chance to contribute.`
        }

        return pitch
    }
}

class ApplicationResponseGenerator {
    generate(user, opportunity) {
        const strengths = user.skills.length > 0
            ? `My key strengths include ${user.skills.slice(0, 5).join(', ')}.`
            : 'I am a quick learner with a strong work ethic.'

        const motivation = user.interests.length > 0
            ? `I am driven by my interest in ${user.interests.slice(0, 2).join(' and ')}, and this ${opportunity.type} directly aligns with that.`
            : `This ${opportunity.type} excites me because it offers a chance to grow and make an impact.`

        return `${strengths}

${motivation}

What draws me to ${opportunity.title} is the opportunity to apply what I know in a practical setting while learning from experienced professionals.

I am a ${user.experience || 'student'}-level individual who is committed to making the most of every opportunity that comes my way. I work well both independently and in teams, and I bring a problem-solving mindset to everything I do.`
    }
}

class AIService {
    constructor() {
        this.generators = {
            coverLetter: new CoverLetterGenerator(),
            email: new EmailDraftGenerator(),
            application: new ApplicationResponseGenerator()
        }
    }

    static createGenerator(type) {
        const map = {
            coverLetter: CoverLetterGenerator,
            email: EmailDraftGenerator,
            application: ApplicationResponseGenerator
        }
        const GeneratorClass = map[type]
        if (!GeneratorClass) throw new Error(`Unknown generator type: ${type}`)
        return new GeneratorClass()
    }

    rankOpportunities(user, opportunities) {
        const scored = opportunities.map(opp => {
            let score = 0

            const userTags = [...(user.skills || []), ...(user.interests || [])].map(s => s.toLowerCase())
            const oppTags = (opp.tags || []).map(t => t.toLowerCase())

            let tagOverlap = 0
            for (let tag of oppTags) {
                for (let userTag of userTags) {
                    if (tag.includes(userTag) || userTag.includes(tag)) {
                        tagOverlap++
                        break
                    }
                }
            }
            score += tagOverlap * 15

            const daysUntilDeadline = Math.ceil((new Date(opp.deadline) - new Date()) / (1000 * 60 * 60 * 24))
            if (daysUntilDeadline > 0 && daysUntilDeadline <= 7) {
                score += 25
            } else if (daysUntilDeadline > 7 && daysUntilDeadline <= 30) {
                score += 15
            } else if (daysUntilDeadline > 30) {
                score += 5
            }

            const preferredTypes = this._inferPreferredTypes(user)
            if (preferredTypes.includes(opp.type)) {
                score += 20
            }

            if (opp.stipend && opp.stipend.length > 0) {
                score += 5
            }

            return { ...opp.toObject(), relevanceScore: score }
        })

        scored.sort((a, b) => b.relevanceScore - a.relevanceScore)
        logger.info('Ranked opportunities for user', { userId: user._id, totalScored: scored.length })

        return scored
    }

    _inferPreferredTypes(user) {
        const interests = (user.interests || []).map(i => i.toLowerCase())
        let preferred = []

        if (interests.some(i => i.includes('hack') || i.includes('build'))) preferred.push('hackathon')
        if (interests.some(i => i.includes('intern') || i.includes('work experience'))) preferred.push('internship')
        if (interests.some(i => i.includes('research') || i.includes('fund'))) preferred.push('grant')
        if (interests.some(i => i.includes('compete') || i.includes('challenge'))) preferred.push('competition')
        if (interests.some(i => i.includes('job') || i.includes('career'))) preferred.push('job')

        if (preferred.length === 0) preferred = ['internship', 'hackathon']

        return preferred
    }

    generateCoverLetter(user, opportunity) {
        return this.generators.coverLetter.generate(user, opportunity)
    }

    generateEmail(user, opportunity) {
        return this.generators.email.generate(user, opportunity)
    }

    generateApplicationResponse(user, opportunity) {
        return this.generators.application.generate(user, opportunity)
    }
}

module.exports = new AIService()
