import React from 'react'
import { RouterProvider } from 'react-router-dom';
import {router} from './router.jsx';
import { AuthProvider } from './features/auth/auth.context.jsx';
import { CustomerProvider } from './features/customers/customer.context.jsx';
const App = () => {
  return (
    <AuthProvider>
      <CustomerProvider>
         <RouterProvider router = {router}/>
      </CustomerProvider>
      
    </AuthProvider>
      
    
   
  )
}

export default App