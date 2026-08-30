const customerModel = require('../models/customer.model');


async function createCustomer(req,res) {

    try {
        const {name, email, phone,stripeCustomerId} = req.body;

        if(!name || !email || !phone || !stripeCustomerId) {
            return res.status(400).json ({
                message: 'All fields are required'
            })
        }

        const ifExists = await customerModel.findOne({
            email
        })

        if(ifExists) {
            return res.status(400).json({
                message: 'Customer already exists'
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


async function deleteCustomer (req,res) {
    try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted successfully', id });
  } catch (error) {
    console.log('customer delete error :', error);
    res.status(500).json({
        message : 'internal server error'
    })
  }
}
module.exports = {createCustomer,getAllCustomer,deleteCustomer}