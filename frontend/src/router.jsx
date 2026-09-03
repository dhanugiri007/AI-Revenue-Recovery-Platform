import {createBrowserRouter} from 'react-router-dom';
import Protected from './features/auth/components/Protected.jsx';
import Register from './features/auth/pages/Register.jsx';
import Login from  './features/auth/pages/Login.jsx';
import CreateCustomer from './features/customers/pages/CreateCustomer.jsx';
import Home from './features/dashboard/Home.jsx';
import Customer from './features/customers/pages/Customers.jsx';
import Payment from './features/customers/pages/Payment.jsx';
import Policies from './features/policies/pages/PolicyUpload.jsx'
import RevenueRecoveryHero from './features/Landingpage.jsx';
import HowItWorks from './features/How.jsx';
import Escalations from './features/recoveryCases/pages/Escalations.jsx';
import RecoveryCasesList from './features/recoveryCases/pages/RecoveryCaseList.jsx'
import CaseAuditTrail from './features/recoveryCases/pages/CaseAuditTrail.jsx';


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
    },
    {
       
        path: '/get-customer-payments/:customerId',
       element : <Protected><Payment/> </Protected>
    },
    {
    path: '/policies',
    element: <Protected><Policies/></Protected>
    },
    {
        path: "/",
        element: <RevenueRecoveryHero/>
    },
    {
        path: "/how-it-works",
        element : <HowItWorks/>
    },
    {
        path: '/escalations',
        element: <Protected><Escalations/></Protected>
    },
    {
        path: '/recovery-cases',
        element: <Protected><RecoveryCasesList/></Protected>
    },
    {
        path: '/recovery-cases/:caseId',
        element:  <Protected><CaseAuditTrail/></Protected>
    },
    {
        path: '/escalations',
        element: <Protected><Escalations/></Protected>
    }
]);
