import {createBrowserRouter} from 'react-router-dom';
import Protected from './features/auth/components/Protected.jsx';
import Register from './features/auth/pages/Register.jsx';
import Login from  './features/auth/pages/Login.jsx';
import CreateCustomer from './features/customers/pages/CreateCustomer.jsx';
import Home from './features/Home.jsx';
import Customer from './features/customers/pages/Customers.jsx';

export const router = createBrowserRouter([
    {
        path: '/login',
        element : <Login/>
    },
    {
        path : '/register',
        element : <Register/>
    },
    {
        path: '/home',
        element : <Protected><Home/></Protected>
    },
    {
        path: '/create-customer',
        element: <Protected><CreateCustomer/></Protected> 
    },
    {
        path: '/get-customers',
        element : <Protected><Customer/></Protected>
    }
]);
