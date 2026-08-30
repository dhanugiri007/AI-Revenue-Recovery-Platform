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
        match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'pls enter valid email']
    },
    phone : {
        type: String,
       
        match : [/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, 'pls enter valid number']
    },
    customerType : {
        type : String,
        required: true,
        enum: ["individual","business"]
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
});


const customerModel = mongoose.model('Customer', customerSchema);

module.exports = customerModel;
