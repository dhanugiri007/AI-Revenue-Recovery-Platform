import { useState, useEffect } from 'react';
import { getDashboardSummary } from '../service/dashboard.api';
import { socket } from '../../../socket';

export const useDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        totalCustomers: 0,
        totalPayments: 0,
        failedPayments: 0,
        activeCases: 0,
        recoveredRevenue: 0,
        recoveryRate: 0,
        paymentTrend: [],
        recoveryByStatus: [],
    });
    const [loading, setLoading] = useState(true);

    const loadDashboard = async () => {
        try {
            const data = await getDashboardSummary();
            setDashboardData(data);
        } catch (err) {
            console.log("Dashboard load failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();

        // live-refresh whenever any recovery case updates, so stats stay current
        socket.on('recoveryCaseUpdate', loadDashboard);
        return () => socket.off('recoveryCaseUpdate', loadDashboard);
    }, []);

    return { dashboardData, loading };
};