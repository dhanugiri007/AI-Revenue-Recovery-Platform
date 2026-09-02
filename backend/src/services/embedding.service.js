// Local, free embeddings using a small sentence-transformer model.
// First call downloads the model (~90MB) from HuggingFace's CDN and
// caches it locally — after that, everything runs offline, no API key needed.

let extractorPromise = null;

async function getExtractor() {
    if (!extractorPromise) {
        // dynamic import because @xenova/transformers is an ESM package
        const { pipeline } = await import('@xenova/transformers');
        extractorPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return extractorPromise;
}

/**
 * Get embeddings for an array of text strings.
 * @param {string[]} texts
 * @returns {Promise<number[][]>}
 */
async function getEmbeddings(texts) {
    const extractor = await getExtractor();
    const embeddings = [];

    for (const text of texts) {
        const output = await extractor(text, { pooling: 'mean', normalize: true });
        embeddings.push(Array.from(output.data));
    }

    return embeddings;
}

async function getEmbedding(text) {
    const [embedding] = await getEmbeddings([text]);
    return embedding;
}

module.exports = { getEmbeddings, getEmbedding };