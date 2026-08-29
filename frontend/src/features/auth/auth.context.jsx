import {createContext,useState,useEffect } from "react";
import { getMe } from "./service/auth.api";


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [loading, setloading] = useState(true);
    const [user,setUser] = useState(null);

    useEffect(()=> {
        const getAndSetUser  = async()=> {
            const data = await getMe();
            setUser(data.user);
            setloading(false);
        }

        getAndSetUser();

    },[])

    
    return (
        <AuthContext.Provider value={({loading,setloading,user,setUser})}>
            {children}
        </AuthContext.Provider>
    )
}