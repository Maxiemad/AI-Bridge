# AI WingMan – Opportunity Sniper

## Overview

AI WingMan is a full-stack application that helps users discover hidden opportunities like hackathons, internships, grants, and collaborations. It goes beyond just listing them — the system uses AI to rank what matters most to you and can generate personalized applications, cover letters, and emails on the spot.

Think of it as your personal opportunity wingman.

## The Problem

Every day, thousands of opportunities go unnoticed. They're scattered across LinkedIn, Twitter, university boards, company websites. By the time someone finds them, the deadline has passed or the application window is tiny. Even when people do find relevant ones, writing applications from scratch is time-consuming and exhausting.

## What AI WingMan Does

- Aggregates opportunities from multiple sources into a single feed
- Ranks them based on your skills, interests, and past activity using an AI scoring engine
- Generates tailored application content — cover letters, cold emails, and form responses
- Tracks every application you submit and reminds you about deadlines
- Runs background jobs to keep the opportunity pool fresh

## Who Is This For

Students, early-career professionals, researchers, and freelancers who want to stay on top of opportunities without spending hours browsing.

## Architecture

The backend follows a layered service architecture:

- **Controllers** handle incoming requests
- **Services** contain business logic and orchestration
- **Repositories** manage database operations

This separation keeps the codebase maintainable and testable. An AI service module handles ranking and content generation, while background workers keep data fresh and send timely notifications.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT |
| AI | Custom ranking + template-based generation |
| Frontend | React, Vite |
| Jobs | node-cron |
