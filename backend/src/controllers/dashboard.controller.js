const customerModel = require('../models/customer.model');
const paymentModel = require('../models/payment.model');
const recoveryCaseModel = require('../models/recoveryCase.model');

// GET /api/dashboard/summary
async function getDashboardSummary(req, res) {
    try {
        const [
            totalCustomers,
            totalPayments,
            failedPayments,
            successPayments,
            activeCases,
            recoveredCases,
            escalatedCases,
            allCases
        ] = await Promise.all([
            customerModel.countDocuments({}),
            paymentModel.countDocuments({}),
            paymentModel.countDocuments({ status: 'failed' }),
            paymentModel.find({ status: 'success' }),
            recoveryCaseModel.countDocuments({ state: { $in: ['detected', 'analyzing', 'action_taken'] } }),
            recoveryCaseModel.find({ state: 'resolved' }),
            recoveryCaseModel.countDocuments({ state: 'escalated' }),
            recoveryCaseModel.find({})
        ]);

        // Recovered revenue = sum of amounts on payments whose recovery case resolved
        // (i.e. a retry actually succeeded and flipped the payment to 'success')
        const resolvedPaymentIds = recoveredCases.map(c => c.paymentId.toString());
        const resolvedPayments = await paymentModel.find({ _id: { $in: resolvedPaymentIds } });
        const recoveredRevenue = resolvedPayments.reduce((sum, p) => sum + p.amount, 0);

        // Recovery rate = resolved cases / (resolved + escalated) - i.e. of all cases
        // that reached a terminal state, what % were recovered without human help
        const terminalCasesCount = recoveredCases.length + escalatedCases;
        const recoveryRate = terminalCasesCount > 0
            ? Math.round((recoveredCases.length / terminalCasesCount) * 100)
            : 0;

        // Payment trend: last 7 days, count of payment events per day
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const recentPayments = await paymentModel.find({ createdAt: { $gte: sevenDaysAgo } });

        const dayBuckets = {};
        for (let i = 0; i < 7; i++) {
            const d = new Date(sevenDaysAgo);
            d.setDate(d.getDate() + i);
            const key = d.toISOString().slice(0, 10);
            dayBuckets[key] = 0;
        }
        recentPayments.forEach(p => {
            const key = new Date(p.createdAt).toISOString().slice(0, 10);
            if (dayBuckets[key] !== undefined) dayBuckets[key] += 1;
        });

        const maxCount = Math.max(1, ...Object.values(dayBuckets));
        const paymentTrend = Object.entries(dayBuckets).map(([date, count]) => ({
            label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            value: Math.round((count / maxCount) * 100), // normalized 0-100 for bar height
            count
        }));

        // Case activity breakdown by state, for the "Case activity" list
        const stateOrder = ['detected', 'analyzing', 'action_taken', 'resolved', 'escalated'];
        const recoveryByStatus = stateOrder.map(state => ({
            label: state.replace('_', ' '),
            value: allCases.filter(c => c.state === state).length
        }));

        return res.status(200).json({
            totalCustomers,
            totalPayments,
            failedPayments,
            successPayments: successPayments.length,
            activeCases,
            recoveredRevenue,
            recoveryRate,
            paymentTrend,
            recoveryByStatus
        });

    } catch (error) {
        console.log("Dashboard summary error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getDashboardSummary };