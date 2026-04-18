function validate(schema) {
    return (req, res, next) => {
        const errors = []

        for (let field in schema) {
            const rules = schema[field]
            const value = req.body[field]

            if (rules.required && (value === undefined || value === null || value === '')) {
                errors.push(`${field} is required`)
                continue
            }

            if (value === undefined || value === null) continue

            if (rules.type === 'string' && typeof value !== 'string') {
                errors.push(`${field} must be a string`)
            }

            if (rules.type === 'array' && !Array.isArray(value)) {
                errors.push(`${field} must be an array`)
            }

            if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
                errors.push(`${field} must be at least ${rules.minLength} characters`)
            }

            if (rules.email && typeof value === 'string') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailPattern.test(value)) {
                    errors.push(`${field} must be a valid email`)
                }
            }

            if (rules.enum && !rules.enum.includes(value)) {
                errors.push(`${field} must be one of: ${rules.enum.join(', ')}`)
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({ errors })
        }

        next()
    }
}

module.exports = validate
