import {useAuth} from '../hooks/use.auth.js';
import {Navigate}from 'react-router';

const Protected = ({children}) => {
    const {loading, user} = useAuth();

    if(loading) {
         return (<main><h1>Loading...</h1></main>)
    }
    if(!user) {
         return <Navigate to={'/login'} />
    }

    return children;
}

export default Protected;