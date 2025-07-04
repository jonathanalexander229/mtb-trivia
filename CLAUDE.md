# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a mountain bike trivia game with Firebase integration. The main game file is `index.html` (previously `mtb_trivia_game.html`) and is deployed via Firebase Hosting. The game features three difficulty levels (Easy Trail, Technical Ride, Gnarly Descent) with questions covering categories like Parts, Manufacturers, Suspension, Riders, Races, Venues, Design, Trails, Accessories, and Lore.

## Architecture

The application consists of:
- **index.html**: Main game file with embedded CSS and JavaScript
- **firebase-config.js**: Firebase configuration and initialization
- **admin.html**: Admin interface for managing questions
- **trivia_db.json**: External questions database
- **package.json**: Node.js dependencies for Firebase tools

Key features:
- **Firebase Hosting**: Serves the game at mtb-trivia.firebaseapp.com
- **Firebase Analytics**: Tracks anonymous usage data
- **External Database**: Questions loaded from JSON file
- **Admin Interface**: Separate page for question management

## Key Components

- **Questions Database**: Structured object with three difficulty levels, each containing 10 questions with categories, multiple choice answers, and correct answer indices
- **Game State Management**: Tracks current difficulty, question index, score, shuffled questions array, and answer state
- **UI Controllers**: Functions for difficulty selection, question loading, answer handling, game progression, and restart functionality

## Development Workflow

To test changes locally:
1. Open `index.html` directly in a web browser
2. Questions are loaded from `trivia_db.json`
3. No build process required - static files only

To deploy changes:
1. Use Firebase CLI: `firebase deploy`
2. Game is hosted at: https://mtb-trivia.firebaseapp.com

To add new questions:
- Edit `trivia_db.json` following the existing structure
- Use `admin.html` for easier question management
- Structure: `{category, question, answers[], correct}`

To modify styling:
- Update the embedded CSS in `index.html`
- The design uses CSS Grid, Flexbox, and CSS animations

Firebase services:
- **Hosting**: Static file serving
- **Analytics**: Anonymous usage tracking
- **Config**: Public API keys in `firebase-config.js`