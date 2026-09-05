const customerModel = require('../models/customer.model');
const paymentModel = require('../models/payment.model');

async function createCustomer(req,res) {

    try {
        const {name, email, phone,customerType} = req.body;

        if(!name || !email || !phone || !customerType) {
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
            name,email,phone,customerType,userId
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

async function getAllCustomer(req, res) {
    try {
        const customers = await customerModel.find({ userId: req.user.id });
        return res.status(200).json({ message: 'sucessfully fetched all customers', customers });
    } catch (error) {
        console.log("Get customer error", error);
        return res.status(500).json({ message: "internal server error" });
    }
}

async function deleteCustomer(req, res) {
    try {
        const { id } = req.params;
        const deletedItem = await customerModel.findOneAndDelete({ _id: id, userId: req.user.id });

        if (!deletedItem) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer deleted successfully', id });
    } catch (error) {
        console.log('customer delete error :', error);
        res.status(500).json({ message: 'internal server error' });
    }
}

async function getCustomerPayment(req, res) {
    try {
        const { id } = req.params;
        // ownership check on the customer first
        const customer = await customerModel.findOne({ _id: id, userId: req.user.id });
        if (!customer) return res.status(404).json({ message: "Customer not found" });

        const payments = await paymentModel.find({ customerId: id, userId: req.user.id });
        if (!payments || payments.length === 0) {
            return res.status(404).json({ message: "No payments found for this customer." });
        }
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
module.exports = {createCustomer,getAllCustomer,deleteCustomer,getCustomerPayment};