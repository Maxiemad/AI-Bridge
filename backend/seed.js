require('dotenv').config()
const mongoose = require('mongoose')
const database = require('./src/utils/database')
const Opportunity = require('./src/models/Opportunity')

const opportunities = [
    {
        title: 'Google Summer of Code 2025',
        description: 'Contribute to open-source projects with mentorship from Google. Work on real-world codebases and get a stipend for your work over the summer.',
        source: 'Google',
        type: 'internship',
        url: 'https://summerofcode.withgoogle.com',
        organization: 'Google',
        tags: ['open-source', 'coding', 'python', 'javascript', 'golang', 'mentorship'],
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        location: 'Remote',
        stipend: '$1500-$3300'
    },
    {
        title: 'MLH Fellowship — Spring Batch',
        description: 'A 12-week internship alternative where you contribute to open-source projects, build portfolio pieces, and connect with top tech companies.',
        source: 'Major League Hacking',
        type: 'fellowship',
        url: 'https://fellowship.mlh.io',
        organization: 'MLH',
        tags: ['open-source', 'web development', 'react', 'python', 'fellowship'],
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        location: 'Remote',
        stipend: '$5000'
    },
    {
        title: 'HackMIT 2025',
        description: 'Annual hackathon hosted by MIT. Build something amazing in 24 hours with teams from around the world. Free travel reimbursement available.',
        source: 'MIT',
        type: 'hackathon',
        url: 'https://hackmit.org',
        organization: 'MIT',
        tags: ['hackathon', 'ai', 'machine learning', 'web development', 'mobile'],
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        location: 'CamWingMan, MA',
        stipend: ''
    },
    {
        title: 'Thiel Fellowship',
        description: 'Peter Thiel gives $100,000 to young people who want to build new things instead of sitting in a classroom. For those under 23.',
        source: 'Thiel Foundation',
        type: 'grant',
        url: 'https://thielfellowship.org',
        organization: 'Thiel Foundation',
        tags: ['entrepreneurship', 'startup', 'innovation', 'business'],
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        location: 'San Francisco, CA',
        stipend: '$100,000'
    },
    {
        title: 'GitHub Externship India',
        description: 'A structured open-source contribution program for Indian students. Mentorship from GitHub engineers and a chance to get hired.',
        source: 'GitHub',
        type: 'internship',
        url: 'https://externship.github.in',
        organization: 'GitHub',
        tags: ['open-source', 'git', 'javascript', 'typescript', 'devops'],
        deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        location: 'Remote',
        stipend: '₹25,000/month'
    },
    {
        title: 'ETHGlobal Hackathon — New York',
        description: 'Build decentralized applications in 36 hours. Over $100k in prizes. Workshops on smart contracts, DeFi, and Web3 infra.',
        source: 'ETHGlobal',
        type: 'hackathon',
        url: 'https://ethglobal.com',
        organization: 'ETHGlobal',
        tags: ['blockchain', 'web3', 'solidity', 'ethereum', 'defi'],
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        location: 'New York, NY',
        stipend: ''
    },
    {
        title: 'Outreachy — Winter Internships',
        description: 'Paid remote internships in open source for people underrepresented in tech. Three-month placements with experienced mentors.',
        source: 'Outreachy',
        type: 'internship',
        url: 'https://outreachy.org',
        organization: 'Outreachy',
        tags: ['open-source', 'diversity', 'python', 'linux', 'documentation'],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        location: 'Remote',
        stipend: '$7000'
    },
    {
        title: 'AWS AI/ML Scholarship',
        description: 'Full scholarship for machine learning nanodegree on Udacity. Covers AI fundamentals, deep learning, and computer vision.',
        source: 'Amazon Web Services',
        type: 'grant',
        url: 'https://aws.amazon.com/machine-learning/scholarship',
        organization: 'AWS',
        tags: ['ai', 'machine learning', 'deep learning', 'python', 'cloud'],
        deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        location: 'Remote',
        stipend: 'Full tuition'
    },
    {
        title: 'Buildspace Nights & Weekends S5',
        description: 'Six-week program where you build and ship a real product. Weekly check-ins, demo day, and a community of builders.',
        source: 'Buildspace',
        type: 'competition',
        url: 'https://buildspace.so',
        organization: 'Buildspace',
        tags: ['startup', 'product', 'web development', 'entrepreneurship', 'ai'],
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        location: 'Remote',
        stipend: ''
    },
    {
        title: 'Microsoft Imagine Cup 2025',
        description: 'Global student technology competition. Build a solution using Microsoft tech and compete for $100k in prizes and mentorship.',
        source: 'Microsoft',
        type: 'competition',
        url: 'https://imaginecup.microsoft.com',
        organization: 'Microsoft',
        tags: ['azure', 'ai', 'cloud', 'iot', 'mixed reality'],
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        location: 'Remote / Seattle Finals',
        stipend: '$100,000 grand prize'
    },
    {
        title: 'LFX Mentorship — Linux Foundation',
        description: 'Contribute to critical open-source projects under the Linux Foundation umbrella. Kubernetes, Hyperledger, and more.',
        source: 'Linux Foundation',
        type: 'fellowship',
        url: 'https://lfx.linuxfoundation.org/tools/mentorship',
        organization: 'Linux Foundation',
        tags: ['open-source', 'kubernetes', 'golang', 'cloud-native', 'linux'],
        deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        location: 'Remote',
        stipend: '$3000-$6600'
    },
    {
        title: 'Figma Design Jam 2025',
        description: 'A 48-hour design challenge. Create innovative UI/UX solutions for a given theme. Great for designers and design-oriented developers.',
        source: 'Figma',
        type: 'hackathon',
        url: 'https://designjam.figma.com',
        organization: 'Figma',
        tags: ['design', 'ui', 'ux', 'figma', 'prototyping'],
        deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        location: 'Remote',
        stipend: ''
    }
]

async function seed() {
    try {
        await database.connect(process.env.MONGO_URI)
        await Opportunity.deleteMany({})
        const result = await Opportunity.insertMany(opportunities)
        console.log(`Seeded ${result.length} opportunities`)
        process.exit(0)
    } catch (err) {
        console.error('Seed failed:', err.message)
        process.exit(1)
    }
}

seed()
