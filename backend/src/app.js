const express = require('express');
const cookie = require('cookie-parser');
const authRoutes = require('./routes/auth.route');

const app = express();

app.use(express.json());
app.use(cookie());

app.use('/api/auth',authRoutes);

module.exports = app;