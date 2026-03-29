# Hailo Paradigm

<div align="center">
  <p>A faster way to type using only directional inputs, designed for Smart TVs, Game Consoles, and VR devices.</p>

  <video src="https://github.com/hadimp/hailo/raw/main/video/typing_w_hailo.mp4" width="100%" controls>
    Your browser does not support the video tag. You can <a href="video/typing_w_hailo.mp4">view the video here</a>.
  </video>
</div>

---

## Overview

Typing on Smart TVs, game consoles, and VR devices with traditional QWERTY grids is slow and frustrating. **Hailo** is a novel typing paradigm designed to maximize efficiency using only four directional inputs (D-pad).

By leveraging a predictive engine and a simplified "cycling" selection method, Hailo reduces the "distance" between characters and eliminates the need for a full keyboard grid.

## How it Works

The Hailo paradigm uses a hierarchical prediction system. Instead of hunting for letters, you cycle through predicted options.

- **Cycle Layers (Down Arrow):** Flip through pages of predicted characters. The most likely letters appear first.
- **Select (Up, Left, Right):** Instantly type the letter in the corresponding directional slot.
- **Space (Enter/Center):** Submit a space.
- **Delete (Long-press Down):** Quickly clear characters.

## Key Features

- **Predictive Engine:** Uses bigrams and letter frequencies to suggest the most likely next characters in real-time.
- **Interactive Tutorial:** A step-by-step guided onboarding experience to help users master the paradigm in minutes.
- **Research Suite:** A built-in benchmarking tool to compare Hailo performance against a **Classic QWERTY** baseline.
- **Stats Dashboard:** Tracks Words Per Minute (WPM), accuracy, and total keystrokes to visualize progress.
- **Mobile Remote:** A companion mobile interface that turns any smartphone into a responsive controller for the Hailo interface.

## Tech Stack

- **Frontend:** React (via CDN for zero-build deployment)
- **Styling:** Tailwind CSS
- **Engine:** Custom Trie-based predictor with bigram support
- **Animation:** CSS Transitions & Framer-like micro-interactions

## Local Development

Since Hailo is built with a CDN-based architecture, you can run it without any complex build steps.

1. Clone the repository:
   ```bash
   git clone https://github.com/hadimp/hailo.git
   ```
2. Open `index.html` in your browser, or use a simple local server:
   ```bash
   npx serve .
   ```

---

*Hailo is currently in a research phase. Anonymous metrics are collected during sessions to help optimize the paradigm.*
