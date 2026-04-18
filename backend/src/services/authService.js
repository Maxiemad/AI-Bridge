const jwt = require('jsonwebtoken')
const userRepository = require('../repositories/userRepository')
const logger = require('../utils/logger')

class AuthService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET
        this.tokenExpiry = '7d'
    }

    _generateToken(userId) {
        return jwt.sign({ id: userId }, this.jwtSecret, { expiresIn: this.tokenExpiry })
    }

    async register(name, email, password, skills, interests) {
        const existing = await userRepository.findByEmail(email)
        if (existing) {
            throw new Error('Email already registered')
        }

        const user = await userRepository.create({
            name,
            email,
            password,
            skills: skills || [],
            interests: interests || []
        })

        logger.info('New user registered', { userId: user._id, email })

        const token = this._generateToken(user._id)
        return { user: user.toPublicJSON(), token }
    }

    async login(email, password) {
        const user = await userRepository.findByEmail(email)
        if (!user) {
            throw new Error('Invalid email or password')
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            throw new Error('Invalid email or password')
        }

        logger.info('User logged in', { userId: user._id })

        const token = this._generateToken(user._id)
        return { user: user.toPublicJSON(), token }
    }

    async getProfile(userId) {
        const user = await userRepository.findById(userId)
        if (!user) throw new Error('User not found')
        return user.toPublicJSON()
    }

    async updateProfile(userId, updates) {
        const allowed = ['name', 'skills', 'interests', 'bio', 'experience']
        const filtered = {}
        for (let key of allowed) {
            if (updates[key] !== undefined) filtered[key] = updates[key]
        }

        const user = await userRepository.updateProfile(userId, filtered)
        if (!user) throw new Error('User not found')
        return user.toPublicJSON()
    }
}

module.exports = new AuthService()
