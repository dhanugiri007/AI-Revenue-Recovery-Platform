import { createContext, useState } from "react";

export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
    const [loading, setloading] = useState(false);
    const [customer, setCustomer] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [payments, setPayments] = useState([]);

    return (
        <CustomerContext.Provider value={{
            loading, setloading,
            customer, setCustomer,
            customers, setCustomers,
            payments, setPayments
        }}>
            {children}
        </CustomerContext.Provider>
    )
}