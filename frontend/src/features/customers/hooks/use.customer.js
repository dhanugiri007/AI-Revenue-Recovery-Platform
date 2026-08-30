import { useContext } from "react";
import { CustomerContext } from "../customer.context.jsx";
import { createCustomer,getCustomers,getPayments } from "../service/customer.api.js";



export const useCustomer = () => {

    const context = useContext(CustomerContext)
    const {customer, setCustomer , loading, setloading,customers,setCustomers,payments,setPayments } = context


    const handleCreateCustomer = async ({ name,email,phone,customerType }) => {
        setloading(true)
        try {
            const data = await createCustomer({ name,email,phone,customerType })
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

    const handlePaymentList = async (customerId) => {
        setloading(true);
        try {
            const data = await getPayments(customerId);

            setPayments(data);
        }catch(err) {

        }
        finally {
            setloading(false);
        }
    }

    
    

    return { handleCreateCustomer,customer,loading,customers,handleCustomerList,handlePaymentList,payments }
}