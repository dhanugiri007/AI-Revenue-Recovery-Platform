import axios from 'axios';

const api = axios.create({
   baseURL: "http://localhost:3000",
   withCredentials : true
});

export async function createCustomer({name,email,phone,stripeCustomerId}) {
    try {
        const response  = await api.post('/api/customer/create-customer', {
            name,email,phone,stripeCustomerId
        })

        return response.data;
        
    }catch(error) {
        console.log(error);
        
    }
}