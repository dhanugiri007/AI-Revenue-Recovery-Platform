import {createContext,useState,useEffect } from "react";



export const CustomerContext = createContext();

export const CustomerProvider = ({children}) => {
    const [loading, setloading] = useState(false);
    const [customer,setcustomer] = useState(null);

    
    return (
        <CustomerContext.Provider value={({loading,setloading,customer,setcustomer})}>
            {children}
        </CustomerContext.Provider>
    )
}