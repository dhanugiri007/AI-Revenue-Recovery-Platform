require('dotenv').config();
require('dns').setServers(['8.8.8.8','8.8.4.4']);

const app = require('./src/app');
const connectDB = require('./src/config/db');

connectDB();
app.listen(process.env.PORT, () => {
    console.log("Server is running on port : ", process.env.PORT);
});




