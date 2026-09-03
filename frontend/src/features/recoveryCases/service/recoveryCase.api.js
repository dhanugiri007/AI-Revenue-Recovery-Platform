import axios from 'axios';

const api = axios.create({
   baseURL: import.meta.env.VITE_BACKEND_URI,
   withCredentials: true
});

export async function getCasesByCustomer(customerId) {
    const response = await api.get(`/api/recovery-case/customer/${customerId}`);
    return response.data;
}

export async function getCaseAuditTrail(caseId) {
    const response = await api.get(`/api/recovery-case/${caseId}/audit`);
    return response.data;
}

export async function getEscalatedCases() {
    const response = await api.get('/api/recovery-case/escalations');
    return response.data;
}

export async function resolveCase(caseId, note) {
    const response = await api.patch(`/api/recovery-case/${caseId}/resolve`, { note });
    return response.data;
}

export async function getAllCases() {
    const response = await api.get('/api/recovery-case/all');
    return response.data;
}