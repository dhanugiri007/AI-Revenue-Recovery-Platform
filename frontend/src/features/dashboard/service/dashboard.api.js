import axios from 'axios';

const api = axios.create({
   baseURL: import.meta.env.VITE_BACKEND_URI,
   withCredentials: true
});

export async function getDashboardSummary() {
    const response = await api.get('/api/dashboard/summary');
    return response.data;
}