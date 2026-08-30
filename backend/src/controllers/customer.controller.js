const customerModel = require('../models/customer.model');


async function createCustomer(req,res) {

    try {
        const {name, email, phone,stripeCustomerId} = req.body;

        if(!name || !email || !phone || !stripeCustomerId) {
            return res.status(400).json ({
                message: 'All fields are required'
            })
        }

        const userId = req.user.id;

        const customer = await customerModel.create({
            name,email,phone,stripeCustomerId,userId
        });

        return res.status(201).json({
            message : "Successfully created customer",
            customer
        });
    }
    catch(error) {
        console.log("Customer creation error", error);
        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

async function getAllCustomer(req,res) {
    try {
    const customers = await customerModel.find({});

    return res.status(200).json({
        message: 'sucessfully fetched all customers',
        customers
    });
   } catch(error) {
    console.log("Get customer error", error);

    return res.status(500).json({
        message : "internal server error"
    });

   }
}

async function getCustomer (req,res) {
    try {
        const id = req.params.id? req.params.id.trim():null;


        const customer = await customerModel.findById(id);
        return res.status(200).json({
            message: 'succesfully got the customer',
            customer
        });


    }catch(error) {
        console.log("Fetching customer error ", error);
        return res.status(500).json({
            message: 'internal server error',
            
        });
    }
}

module.exports = {createCustomer,getAllCustomer,getCustomer}