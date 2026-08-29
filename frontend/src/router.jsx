import {createBrowserRouter} from 'react-router-dom';

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
        element : <h1>Home</h1>
    }
])