const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Sends the case context to Gemini with function-calling tools and returns
 * the model's chosen action as structured JSON.
 * We use responseSchema (structured output) instead of true function-calling
 * for simplicity and reliability - the effect is the same: a constrained,
 * parseable decision.
 */
async function getAgentDecision({ systemPrompt, userPrompt }) {
    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
            { role: 'user', parts: [{ text: userPrompt }] }
        ],
        config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: {
                type: 'object',
                properties: {
                    action: {
                        type: 'string',
                        enum: ['retryPayment', 'sendOutreach', 'escalateToHuman']
                    },
                    policyChunkId: {
                        type: 'string',
                        description: 'The chunkId of the policy text this decision is grounded in. Empty string if none applies.'
                    },
                    reasoning: {
                        type: 'string',
                        description: 'Short justification tied directly to the policy text.'
                    },
                    confidence: {
                        type: 'string',
                        enum: ['high', 'low']
                    }
                },
                required: ['action', 'policyChunkId', 'reasoning', 'confidence']
            }
        }
    });

    const parsed = JSON.parse(response.text);
    return parsed;
}

module.exports = { getAgentDecision };