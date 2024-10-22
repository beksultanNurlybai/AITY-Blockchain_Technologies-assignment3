const WebSocket = require('ws');
const url = require('url');
const User = require('../models/User');

const userConnections = new Map();

const initWebSocket = (server) => {
    wss = new WebSocket.Server({ port: 3001 });
    wss.on('connection', async (ws, req) => {
        console.log('Client attempting connection via WebSocket');
        const query = url.parse(req.url, true).query;
        const key = query.key;

        try {
            const user = await User.findOne({ key });
            if (user) {
                console.log(`Client connected with valid key: ${key}`);
                ws.send(JSON.stringify({ event: 'login', is_valid: true }));
                userConnections.set(key, ws);

                // ws.on('message', (msg) => {
                //     console.log('Message from client:', msg);
                //     // Handle messages from client if needed
                // });

                ws.on('close', () => {
                    console.log('Client disconnected');
                    userConnections.delete(key);
                });
            } else {
                console.log(`Client attempted connection with invalid key: ${key}`);
                ws.send(JSON.stringify({ event: 'login', is_valid: false }));
                ws.close();
            }
        } catch (error) {
            console.error('Error validating key:', error);
            ws.send(JSON.stringify({ event: 'login', is_valid: false }));
            ws.close();
        }
    });
};

const sendMessageToUser = (userId, message) => {
    const ws = userConnections.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        console.log(`User ${userId} is not connected or WebSocket is not open.`);
    }
};

module.exports = { initWebSocket, sendMessageToUser };