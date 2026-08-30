import { useContext } from "react";
import { CustomerContext } from "../customer.context.jsx";
import { createCustomer,getCustomers } from "../service/customer.api.js";



export const useCustomer = () => {

    const context = useContext(CustomerContext)
    const {customer, setCustomer , loading, setloading,customers,setCustomers } = context


    const handleCreateCustomer = async ({ name,email,phone,stripeCustomerId }) => {
        setloading(true)
        try {
            const data = await createCustomer({ name,email,phone,stripeCustomerId })
            setCustomer(data.customer)
        } catch (err) {

        } finally {
            setloading(false)
        }
    }

    const handleCustomerList = async () => {
        setloading(true);
        try {
           const data = await getCustomers();
          
           setCustomers(data.customers);

        }catch(err) {

        }
        finally {
            setloading(false);
        }
    }

    
    

    return { handleCreateCustomer,customer,loading,customers,handleCustomerList }
}