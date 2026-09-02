const { Server } = require('socket.io');

let io = null;

function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        // frontend joins a room per customer, so it only gets updates it cares about
        socket.on('joinCustomerRoom', (customerId) => {
            socket.join(`customer:${customerId}`);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });

    return io;
}

function getIO() {
    if (!io) throw new Error('Socket.IO not initialized yet');
    return io;
}

// Emits a recovery case update to anyone watching that customer's room
function emitCaseUpdate(customerId, payload) {
    if (!io) return; // fail silently if sockets aren't up - don't break the agent flow
    io.to(`customer:${customerId}`).emit('recoveryCaseUpdate', payload);
}

module.exports = { initSocket, getIO, emitCaseUpdate };