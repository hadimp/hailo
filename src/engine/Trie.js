class TrieNode {
    constructor() {
        this.children = {};
        this.isWord = false;
        this.subWords = 0;
    }
}

function buildTrie(words) {
    const root = new TrieNode();
    words.forEach(word => {
        let node = root;
        for (const char of word) {
            if (!node.children[char]) node.children[char] = new TrieNode();
            node = node.children[char];
            node.subWords++;
        }
        node.isWord = true;
    });
    return root;
}

function getPredictions(root, prefix) {
    let node = root;
    for (const char of prefix) {
        if (!node.children[char]) return [];
        node = node.children[char];
    }
    return Object.entries(node.children)
        .sort((a, b) => b[1].subWords - a[1].subWords)
        .map(entry => entry[0]);
}
