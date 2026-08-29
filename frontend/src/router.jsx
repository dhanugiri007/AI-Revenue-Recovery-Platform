import {createBrowserRouter} from 'react-router-dom';
import Protected from './features/auth/components/Protected.jsx';
import Register from './features/auth/pages/Register.jsx';
import Login from  './features/auth/pages/Login.jsx';

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
        path: '/',
        element : <Protected><h1>Home</h1></Protected>
    }
])