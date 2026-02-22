// Depends on global `movies`, `fallbackWords`, `defaultFreq`, `nextLetterFreq`, `buildTrie`, `getPredictions` being loaded before this file in index.html

const phraseTrieRoot = buildTrie(movies);
const fallbackTrieRoot = buildTrie(fallbackWords);

function getBaseProbabilities(text) {
    if (!text) return defaultFreq;

    // 1. Primary Engine: Streaming Phrase Trie
    const currentPhrase = text.toLowerCase();
    const phrasePreds = getPredictions(phraseTrieRoot, currentPhrase);

    // 2. Secondary Engine: English Word Trie
    const wordsMatch = currentPhrase.match(/[a-z]+$/);
    const lastWordFragment = wordsMatch ? wordsMatch[0] : '';
    const fallbackPreds = lastWordFragment.length > 0 ? getPredictions(fallbackTrieRoot, lastWordFragment) : [];

    // Combine them, heavily prioritizing the exact phrase match, then the word fallback
    let combined = [...phrasePreds, ...fallbackPreds];

    // 3. Last Resort Engine: Letter Frequency Maps
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

    // 1. Primary Engine: Streaming Phrase Trie
    let phrasePreds = getFullPhrasePredictions(phraseTrieRoot, currentPhrase, 3);

    // 2. Secondary Engine: English Word Trie
    if (phrasePreds.length < 3) {
        const wordsMatch = currentPhrase.match(/[a-z]+$/);
        const lastWordFragment = wordsMatch ? wordsMatch[0] : '';
        if (lastWordFragment) {
            const fallbackPreds = getFullPhrasePredictions(fallbackTrieRoot, lastWordFragment, 3 - phrasePreds.length);
            phrasePreds = [...phrasePreds, ...fallbackPreds];
        }
    }

    return Array.from(new Set(phrasePreds)).slice(0, 3);
}
