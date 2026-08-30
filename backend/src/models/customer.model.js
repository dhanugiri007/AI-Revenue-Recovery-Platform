const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true,
    },
    name : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
    },
    phone : {
        type: String
    },
    stripeCustomerId : {
        type: String,
        requried : true
    },
    status : {
        type: String,
        enum : ['active','at_risk','churned'],
        default : 'active'
    },
    totalRevenue : {
        type: Number,
        default: 0
    },
    createdAt : {
        type: Date,
        default : Date.now,
    }
    
}, {
    timestamps : true
})

const customerModel = mongoose.model('Cutomer',customerSchema);

module.exports = customerModel