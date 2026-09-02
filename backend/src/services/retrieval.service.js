const { getCollection } = require('../config/vectorDB');
const { getEmbedding } = require('./embedding.service');
const policyModel = require('../models/policy.model');

/**
 * Retrieve the top-k most relevant policy chunks for a given query,
 * restricted to currently ACTIVE policies only.
 * @param {string} queryText - e.g. a summary of the recovery case
 * @param {number} topK
 */
async function retrieveRelevantPolicies(queryText, topK = 5) {
    const activePolicies = await policyModel.find({ active: true }, '_id');
    const activePolicyIds = activePolicies.map(p => p._id.toString());

    if (activePolicyIds.length === 0) {
        return []; // no active policy -> agent has nothing to ground on
    }

    const queryEmbedding = await getEmbedding(queryText);
    const collection = await getCollection();

    const results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: topK,
        where: { policyId: { "$in": activePolicyIds } }
    });

    // Flatten Chroma's result shape into simple chunk objects
    const documents = results.documents?.[0] || [];
    const metadatas = results.metadatas?.[0] || [];
    const ids = results.ids?.[0] || [];
    const distances = results.distances?.[0] || [];

    return documents.map((text, i) => ({
        chunkId: ids[i],
        text,
        policyId: metadatas[i]?.policyId,
        filename: metadatas[i]?.filename,
        chunkIndex: metadatas[i]?.chunkIndex,
        distance: distances[i]
    }));
}

module.exports = { retrieveRelevantPolicies };