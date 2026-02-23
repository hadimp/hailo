# Slingshot Prediction Engine

The improved Slingshot Prediction Engine utilizes a highly optimized, cascaded approach to predict the next characters a user is likely to type. Rather than running a heavyweight neural network script, it relies on three rapid, memory-efficient tiers:

## 1. Context Engine (Bigrams)
**Trigger:** Activated immediately after the user types a space, and remains active for the first **1 to 2 characters** of the new word.
- The engine extracts the *previous word* and consults a highly compressed Bigram dictionary (`src/data/bigrams.js`) containing the top 8,000 contextual pairings derived from a comprehensive English corpus.
- If the text input is just a space (e.g., `"the "`), it predicts the first letters of the most statistically probable next words.
- If the user types 1 or 2 letters of the next word (e.g., `"the q"` or `"the qu"`), it cleanly filters those bigram predictions to words matching that prefix.
- As soon as the user types the **3rd character** of the new word, this context engine shuts off to allow the primary dictionary to securely take over.

## 2. Primary Engine (General English Word Trie)
**Trigger:** Activated when the Bigram engine is exhausted, returns fewer than 3 predictions, or the user types the 3rd character of a word.
- The engine searches a generalized English dictionary (`src/data/words.js`) composed of thousands of common words.
- This dictionary is structured as a Trie for O(1) prefix lookups.
- By deliberately ignoring previous words, this engine focuses entirely on auto-completing the *current* word the user is actively typing, without contextual bias.

## 3. Secondary Engine (Letter Frequency Fallback)
**Trigger:** Activated if the user types a unique name, a typo, or a word completely absent from the dictionary, yielding 0 Trie results.
- The engine looks strictly at the *last character* typed by the user.
- It consults a hardcoded statistical map (`src/data/frequencies.js`) of which English letters most commonly follow that specific character (e.g., 'q' is almost always followed by 'u' or 'i').
- If the text input is completely empty, it simply returns the standard English letter frequency distribution (`e`, `t`, `a`, `o`, `i`, `n`...).

---
*Note: This cascaded approach ensures lightning-fast completions for common conversational phrases while gracefully falling back to strict dictionary completion and mathematical frequency for complex or unknown words.*
