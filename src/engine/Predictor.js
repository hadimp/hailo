// Depends on global `fallbackWords`, `defaultFreq`, `nextLetterFreq`, `buildTrie`, `getPredictions` being loaded before this file in index.html

const fallbackTrieRoot = buildTrie(fallbackWords);

function getBaseProbabilities(text) {
    if (!text) return defaultFreq;

    const currentPhrase = text.toLowerCase();

    // Parse words for Context Engine
    const words = currentPhrase.trim().split(' ');
    // We only care about the last word typed (to find the space)
    const wordsMatch = currentPhrase.match(/[a-z]+$/);
    const lastWordFragment = wordsMatch ? wordsMatch[0] : '';

    let combined = [];

    if ((currentPhrase.endsWith(' ') || lastWordFragment.length > 0) && lastWordFragment.length <= 2) {
        // If they just typed a space, the previous word is the last word in the array
        // If they are in the middle of a word, it's the second to last
        const previousWordIdx = currentPhrase.endsWith(' ') ? words.length - 1 : words.length - 2;
        if (previousWordIdx >= 0) {
            const previousWord = words[previousWordIdx];
            // Check if our bigram dictionary has context for this word
            if (typeof bigrams !== 'undefined' && bigrams[previousWord]) {
                let contextWords = bigrams[previousWord];

                // If they have started typing the new word, filter the context
                if (lastWordFragment) {
                    contextWords = contextWords.filter(w => w.startsWith(lastWordFragment) && w !== lastWordFragment);
                }

                // Extract the immediate next letter for the probabilities
                if (contextWords.length > 0) {
                    combined = contextWords.map(w => w.charAt(lastWordFragment.length));
                }
            }
        }
    }

    // 2. Primary Engine: English Word Trie
    if (combined.length < 3 && lastWordFragment.length > 0) {
        const triePreds = getPredictions(fallbackTrieRoot, lastWordFragment);
        combined = [...combined, ...triePreds];
    }

    // 3. Secondary Engine: Letter Frequency Maps
    if (combined.length < 3) {
        const lastChar = currentPhrase.slice(-1);
        if (lastChar && nextLetterFreq[lastChar]) {
            combined = [...combined, ...nextLetterFreq[lastChar].split('')];
        }
    }

    return Array.from(new Set([...combined, ...defaultFreq]));
}

function getTopPhrasePredictions(text) {
    if (!text) return [];

    const currentPhrase = text.toLowerCase();
    const words = currentPhrase.trim().split(' ');
    const wordsMatch = currentPhrase.match(/[a-z]+$/);
    const lastWordFragment = wordsMatch ? wordsMatch[0] : '';

    let phrasePreds = [];

    if ((currentPhrase.endsWith(' ') || lastWordFragment.length > 0) && lastWordFragment.length <= 2) {
        const previousWordIdx = currentPhrase.endsWith(' ') ? words.length - 1 : words.length - 2;
        if (previousWordIdx >= 0) {
            const previousWord = words[previousWordIdx];
            if (typeof bigrams !== 'undefined' && bigrams[previousWord]) {
                let contextWords = bigrams[previousWord];
                if (lastWordFragment) {
                    contextWords = contextWords.filter(w => w.startsWith(lastWordFragment) && w !== lastWordFragment);
                }
                phrasePreds = [...contextWords];
            }
        }
    }

    // 2. Primary Engine: English Word Trie
    if (phrasePreds.length < 3 && lastWordFragment) {
        const triePreds = getFullPhrasePredictions(fallbackTrieRoot, lastWordFragment, 3 - phrasePreds.length);
        phrasePreds = [...phrasePreds, ...triePreds];
    }

    return Array.from(new Set(phrasePreds)).slice(0, 3);
}
