// Depends on global `fallbackWords`, `defaultFreq`, `nextLetterFreq`, `buildTrie`, `getPredictions` being loaded before this file in index.html

const fallbackTrieRoot = buildTrie(fallbackWords);

function getBaseProbabilities(text) {
    if (!text) return defaultFreq;

    const currentPhrase = text.toLowerCase();
    
    // 1. Primary Engine: English Word Trie
    const wordsMatch = currentPhrase.match(/[a-z]+$/);
    const lastWordFragment = wordsMatch ? wordsMatch[0] : '';
    let combined = lastWordFragment.length > 0 ? getPredictions(fallbackTrieRoot, lastWordFragment) : [];

    // 2. Secondary Engine: Letter Frequency Maps
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
    let phrasePreds = [];

    // 1. Primary Engine: English Word Trie
    const wordsMatch = currentPhrase.match(/[a-z]+$/);
    const lastWordFragment = wordsMatch ? wordsMatch[0] : '';
    if (lastWordFragment) {
        phrasePreds = getFullPhrasePredictions(fallbackTrieRoot, lastWordFragment, 3);
    }

    return Array.from(new Set(phrasePreds)).slice(0, 3);
}
