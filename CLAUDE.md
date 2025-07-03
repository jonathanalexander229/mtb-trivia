# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-file HTML mountain bike trivia game (`mtb_trivia_game.html`) that runs entirely in the browser. The game features three difficulty levels (Easy Trail, Technical Ride, Gnarly Descent) with 10 questions each covering categories like Parts, Manufacturers, Suspension, Riders, Races, Venues, Design, Trails, Accessories, and Lore.

## Architecture

The application is built as a self-contained HTML file with embedded CSS and JavaScript:
- **HTML Structure**: Game container with difficulty selector, question section, and game over screen
- **CSS Styling**: Mountain biking themed design with gradient backgrounds, animations, and responsive layout
- **JavaScript Logic**: Question management, scoring system, game flow control, and UI interactions

## Key Components

- **Questions Database**: Structured object with three difficulty levels, each containing 10 questions with categories, multiple choice answers, and correct answer indices
- **Game State Management**: Tracks current difficulty, question index, score, shuffled questions array, and answer state
- **UI Controllers**: Functions for difficulty selection, question loading, answer handling, game progression, and restart functionality

## Development Workflow

To test changes:
1. Open `mtb_trivia_game.html` directly in a web browser
2. No build process or server required - it's a static HTML file

To add new questions:
- Add question objects to the appropriate difficulty level in the `questions` object
- Follow the existing structure: `{category, question, answers[], correct}`

To modify styling:
- Update the embedded CSS in the `<style>` section
- The design uses CSS Grid, Flexbox, and CSS animations

To add new features:
- Extend the JavaScript functions in the `<script>` section
- The game flow is: difficulty selection → question loading → answer selection → next question → game over → restart