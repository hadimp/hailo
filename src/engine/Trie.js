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

function getFullPhrasePredictions(root, prefix, limit = 3) {
    let node = root;
    for (const char of prefix) {
        if (!node.children[char]) return [];
        node = node.children[char];
    }

    // DFS to find the heaviest complete words/phrases down this branch
    const results = [];

    function dfs(currentNode, currentString) {
        // Only collect branches that legally terminate as a full word/phrase in our dataset
        if (currentNode.isWord) {
            results.push({ phrase: currentString, weight: currentNode.subWords });
        }

        // Prioritize heavier branches to traverse the most likely paths first
        const sortedChildren = Object.entries(currentNode.children)
            .sort((a, b) => b[1].subWords - a[1].subWords);

        for (const [char, childNode] of sortedChildren) {
            dfs(childNode, currentString + char);
        }
    }

    dfs(node, "");

    return results
        .sort((a, b) => b.weight - a.weight)
        .slice(0, limit)
        .map(r => r.phrase);
}
