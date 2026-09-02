const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    version: {
        type: Number,
        required: true,
        default: 1
    },
    chunkCount: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        default: true   // only active policies are used by the agent's retrieval
    }
}, {
    timestamps: true
});

const policyModel = mongoose.model('Policy', policySchema);

module.exports = policyModel;