const mongoose = require('mongoose');

const recoveryCaseSchema = new mongoose.Schema({
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: true,
        unique: true
    },
    state: {
        type: String,
        enum: ['detected', 'analyzing', 'action_taken', 'resolved', 'escalated'],
        default: 'detected'
    },
    retryCount: { type: Number, default: 0 },
    outreachCount: { type: Number, default: 0 },
    lastActionAt: { type: Date },
    escalationReason: { type: String },          
    resolvedBy: {                                  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resolvedAt: { type: Date },                    
    resolutionNote: { type: String }                
}, { timestamps: true });

module.exports = mongoose.model('RecoveryCase', recoveryCaseSchema);