import axios from 'axios';

const api = axios.create({
   baseURL: "http://localhost:3000",
   withCredentials: true
});

export async function uploadPolicy(file) {
    const formData = new FormData();
    formData.append('pdfFile', file);

    const response = await api.post('/api/policy/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
}

export async function getPolicies() {
    const response = await api.get('/api/policy/list');
    return response.data;
}

export async function togglePolicy(id) {
    const response = await api.patch(`/api/policy/${id}/toggle`);
    return response.data;
}

export async function deletePolicy(id) {
    const response = await api.delete(`/api/policy/${id}`);
    return response.data;
}