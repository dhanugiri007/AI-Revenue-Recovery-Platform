import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, register } from "../service/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setloading } = context


    const handleLogin = async ({ email, password }) => {
        setloading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
        } catch (err) {

        } finally {
            setloading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setloading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
        } catch (err) {

        } finally {
            setloading(false)
        }
    }

   

    

    return { user, loading, handleRegister, handleLogin }
}