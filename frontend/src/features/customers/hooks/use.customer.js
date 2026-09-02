import { useContext } from "react";
import { CustomerContext } from "../customer.context.jsx";
import { createCustomer, getCustomers, getPayments, generatePayment } from "../service/customer.api.js";

export const useCustomer = () => {

    const context = useContext(CustomerContext)
    const { customer, setCustomer, loading, setloading, customers, setCustomers, payments, setPayments } = context

    const handleCreateCustomer = async ({ name, email, phone, customerType }) => {
        setloading(true)
        try {
            const data = await createCustomer({ name, email, phone, customerType })
            setCustomer(data.customer)
            return data
        } catch (err) {
            console.log("Create customer failed:", err)
            return null
        } finally {
            setloading(false)
        }
    }

    const handleCustomerList = async () => {
        setloading(true);
        try {
            const data = await getCustomers();
            setCustomers(data.customers);
            return data
        } catch (err) {
            console.log("Fetch customers failed:", err)
            return null
        } finally {
            setloading(false);
        }
    }

    const handlePaymentList = async (customerId) => {
        setloading(true);
        try {
            const data = await getPayments(customerId);
            setPayments(data);
            return data
        } catch (err) {
            console.log("Fetch payments failed:", err)
            return null
        } finally {
            setloading(false);
        }
    }

    const handleGeneratePayment = async (customerId, status) => {
        try {
            const data = await generatePayment(customerId, status);
            // refresh the list so the new payment shows up immediately
            await handlePaymentList(customerId);
            return data
        } catch (err) {
            console.log("Generate payment failed:", err)
            return null
        }
    }

    return {
        handleCreateCustomer, customer, loading, customers,
        handleCustomerList, handlePaymentList, payments,
        handleGeneratePayment
    }
}