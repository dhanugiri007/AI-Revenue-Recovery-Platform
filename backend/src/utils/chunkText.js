/**
 * Splits text into overlapping word-based chunks.
 * @param {string} text
 * @param {number} chunkSize - words per chunk
 * @param {number} overlap - words shared between consecutive chunks
 * @returns {string[]}
 */
function chunkText(text, chunkSize = 300, overlap = 50) {
    const cleaned = text.replace(/\s+/g, ' ').trim();
    const words = cleaned.split(' ');

    if (words.length === 0) return [];

    const chunks = [];
    let start = 0;

    while (start < words.length) {
        const end = Math.min(start + chunkSize, words.length);
        const chunk = words.slice(start, end).join(' ');
        chunks.push(chunk);

        if (end === words.length) break;
        start += (chunkSize - overlap);
    }

    return chunks;
}

module.exports = { chunkText };