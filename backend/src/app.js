const express = require('express');
const cookie = require('cookie-parser');
const authRoutes = require('./routes/auth.route');
const customerRoutes = require('./routes/customer.route');
const paymentRoutes = require('./routes/payment.route');   // NEW

const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookie());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/api/auth',authRoutes);
app.use('/api/customer',customerRoutes);
app.use('/api/payment', paymentRoutes);   // NEW

module.exports = app;