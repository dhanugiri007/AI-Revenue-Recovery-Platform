const { ChromaClient } = require('chromadb');

const client = new ChromaClient({
    path: process.env.CHROMA_URL || 'http://localhost:8000'
});

const COLLECTION_NAME = 'recovery_policies';

// We supply embeddings ourselves via OpenAI on every add/query call,
// so this is just a placeholder to satisfy the client's requirement
// for an embeddingFunction object — it should never actually be invoked.
const noopEmbeddingFunction = {
    generate: async () => {
        throw new Error('noopEmbeddingFunction should never be called — embeddings must be passed explicitly');
    }
};

let collectionPromise = null;

function getCollection() {
    if (!collectionPromise) {
        collectionPromise = client.getOrCreateCollection({
            name: COLLECTION_NAME,
            embeddingFunction: noopEmbeddingFunction   // NEW
        });
    }
    return collectionPromise;
}

module.exports = { client, getCollection };