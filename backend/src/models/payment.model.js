const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Customer',
        required: true
    },
    amount : {
        type : Number,
        required: true
    },
    currency : {
        type : String,
        default : 'INR',
        required: true
    },
    status : {
        type : String,
        enum : ["pending","success","recovering","escalated"],
        required: true
    },
    failureReason : {
        type : String,
        enum: ["card expired", "insufficient funds","bank declined","network error","invalid payment method","suspicious transaction","unknown"],
        required: function() { return this.status === 'failed'; } 
    },
    paymentMethod : {
        type: String,
        enum : ["credit_card", "debit_card", "upi", "netbanking","wallet", "cod"],
        required: true
    },
    attemptCount :{ 
        type: Number,
        required: true,
        default : 0
    },
    dueDate : {
        type : Date,
        required: true
    },
    failedAt : {
        type : Date,
        required: true
    }

}, {
    timestamps: true
} );

const paymentModel = mongoose.model('Payment',paymentSchema);

module.exports = paymentModel;
