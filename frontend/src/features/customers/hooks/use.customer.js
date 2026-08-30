import { useContext } from "react";
import { CustomerContext } from "../customer.context.jsx";
import { createCustomer } from "../service/customer.api.js";



export const useCustomer = () => {

    const context = useContext(CustomerContext)
    const {customer, setCustomer , loading, setloading } = context


    const handleCreateCustomer = async ({ name,email,phone,stripeCustomerId }) => {
        setloading(true)
        try {
            const data = await createCustomer({ name,email,phone,stripeCustomerId })
            setCustomer(data.user)
        } catch (err) {

        } finally {
            setloading(false)
        }
    }

    
    

    return { handleCreateCustomer,customer,loading }
}