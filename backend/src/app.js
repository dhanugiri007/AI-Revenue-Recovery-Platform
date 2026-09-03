const express = require('express');
const cookie = require('cookie-parser');
const cors = require('cors');

const { generalLimiter } = require('./middlewares/rateLimiter.middleware');   // NEW

const authRoutes = require('./routes/auth.route');
const customerRoutes = require('./routes/customer.route');
const paymentRoutes = require('./routes/payment.route');
const policyRoutes = require('./routes/policy.route');
const recoveryCaseRoutes = require('./routes/recoveryCase.route');
const dashboardRoutes = require('./routes/dashboard')

const app = express();

app.use(express.json());
app.use(cookie());
app.use(cors({
    origin: process.env.FRONTEND_URI,
    credentials: true
}));

app.use(generalLimiter);   // NEW - applies to all routes below

app.use('/api/auth',authRoutes);
app.use('/api/customer',customerRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/policy', policyRoutes);
app.use('/api/recovery-case', recoveryCaseRoutes);
app.use('/api/dashboard', dashboardRoutes); 

module.exports = app;