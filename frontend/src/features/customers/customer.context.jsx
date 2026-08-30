import {createContext,useState,useEffect } from "react";



export const CustomerContext = createContext();

export const CustomerProvider = ({children}) => {
    const [loading, setloading] = useState(false);
    const [customer,setcustomer] = useState(null);
    const [customers,setCustomers] = useState([]);
    const [payments, setPayments] = useState([]);
    
    return (
        <CustomerContext.Provider value={({loading,setloading,customer,setcustomer,customers,setCustomers,payments,setPayments})}>
            {children}
        </CustomerContext.Provider>
    )
}