const paymentModel = require('../models/payment.model');
const customerModel = require('../models/customer.model');
const recoveryCaseModel = require('../models/recoveryCase.model');
const crypto = require('crypto');

const PAYMENT_METHODS = ["credit_card", "debit_card", "upi", "netbanking", "wallet", "cod"];
const FAILURE_REASONS = ["card expired", "insufficient funds", "bank declined", "network error", "invalid payment method", "suspicious transaction"];

function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// POST /api/payment/generate/:customerId
// body: { status: 'success' | 'failed', eventId: <client-generated uuid> }
async function generatePayment(req, res) {
    try {
        const { customerId } = req.params;
        const { status, eventId } = req.body;

        if (!['success', 'failed'].includes(status)) {
            return res.status(400).json({ message: "status must be 'success' or 'failed'" });
        }
        if (!eventId) {
            return res.status(400).json({ message: "eventId is required" });
        }

        const customer = await customerModel.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // --- IDEMPOTENCY CHECK ---
        // If this eventId was already processed (double click, retry, etc.),
        // return the existing payment instead of creating a duplicate.
        const existingPayment = await paymentModel.findOne({ eventId });
        if (existingPayment) {
            const existingCase = await recoveryCaseModel.findOne({ paymentId: existingPayment._id });
            return res.status(200).json({
                message: "Duplicate event - returning existing payment",
                duplicate: true,
                payment: existingPayment,
                recoveryCase: existingCase || null
            });
        }

        const now = new Date();
        const amount = Math.floor(Math.random() * (50000 - 500 + 1)) + 500;

        const paymentData = {
            customerId,
            eventId,
            amount,
            currency: 'INR',
            status,
            paymentMethod: randomFrom(PAYMENT_METHODS),
            attemptCount: status === 'failed' ? 1 : 0,
            dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // +7 days
        };

        if (status === 'failed') {
            paymentData.failureReason = randomFrom(FAILURE_REASONS);
            paymentData.failedAt = now;
        }

        const payment = await paymentModel.create(paymentData);

        let recoveryCase = null;

        if (status === 'failed') {
            // Create a recovery case for this failed payment (idempotency
            // enforced at the schema level via unique paymentId)
            recoveryCase = await recoveryCaseModel.create({
                customerId,
                paymentId: payment._id,
                state: 'detected'
            });
        } else {
            // Optional: if a customer succeeds, auto-resolve any open case
            // that might exist for them from a prior failure
            await recoveryCaseModel.updateMany(
                { customerId, state: { $nin: ['resolved', 'escalated'] } },
                { $set: { state: 'resolved' } }
            );
        }

        return res.status(201).json({
            message: `Payment (${status}) generated successfully`,
            duplicate: false,
            payment,
            recoveryCase
        });

    } catch (error) {
        console.log("Generate payment error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { generatePayment };