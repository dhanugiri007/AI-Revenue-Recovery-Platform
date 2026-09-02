import axios from 'axios';

const api = axios.create({
   baseURL: "http://localhost:3000",
   withCredentials: true
});

export async function createCustomer({ name, email, phone, customerType }) {
    try {
        const response = await api.post('/api/customer/create-customer', {
            name, email, phone, customerType
        });

        return response.data;

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getCustomers() {
    try {
        const response = await api.get('/api/customer/get-customers');

        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getPayments(customerId) {
    try {
        const response = await api.get(`/api/customer/get-customer-payments/${customerId}`);

        return response.data;

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function generatePayment(customerId, status) {
    try {
        // client-generated idempotency key - unique per click
        const eventId = crypto.randomUUID();

        const response = await api.post(`/api/payment/generate/${customerId}`, {
            status,
            eventId
        });

        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}