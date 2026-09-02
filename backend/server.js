require('dotenv').config();
require('dns').setServers(['8.8.8.8','8.8.4.4']);

const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { initSocket } = require('./src/socket');

connectDB();

const server = http.createServer(app);
initSocket(server);

server.listen(process.env.PORT, () => {
    console.log("Server is running on port : ", process.env.PORT);
});




