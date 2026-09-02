const mongoose = require('mongoose');

const recoveryCaseSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: true,
        unique: true   // one case per payment - blocks duplicate case creation
    },
    state: {
        type: String,
        enum: ['detected', 'analyzing', 'action_taken', 'resolved', 'escalated'],
        default: 'detected'
    },
    retryCount: {
        type: Number,
        default: 0
    },
    outreachCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const recoveryCaseModel = mongoose.model('RecoveryCase', recoveryCaseSchema);

module.exports = recoveryCaseModel;