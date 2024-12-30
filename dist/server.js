"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const redis_1 = require("redis");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
app.use((0, cors_1.default)({
    origin: '*',
}));
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
    },
});
const redisClient = (0, redis_1.createClient)({
    url: 'redis://redis:6379'
});
const allowedKeys = [
    'key1',
    'key2',
    'key3',
    'key4',
    'key5',
    'key6',
    'key7',
    'key8',
    'key11',
    'key12',
];
(async () => {
    try {
        await redisClient.connect();
        console.log('Redis connected successfully');
    }
    catch (err) {
        console.error('Redis connection error:', err);
    }
})();
app.use(express_1.default.static('public'));
app.get('/api/plus/:key', async (req, res) => {
    try {
        const { key } = req.params;
        if (!allowedKeys.includes(key)) {
            return res.status(400).json({ ok: false, error: 'Key not allowed' });
        }
        const newValue = await redisClient.incr(key);
        io.emit('update', { key, count: newValue });
        res.json({ ok: true, key });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error });
    }
});
io.on('connection', async (socket) => {
    console.log('A client connected:', socket.id);
    try {
        const initialData = {};
        for (const key of allowedKeys) {
            const value = await redisClient.get(key);
            initialData[key] = Number(value) || 0;
        }
        socket.emit('initialData', initialData);
    }
    catch (error) {
        console.error('Error fetching initial data:', error);
    }
    socket.on('getCount', async (key) => {
        if (allowedKeys.includes(key)) {
            const value = await redisClient.get(key);
            socket.emit('update', { key, count: Number(value) || 0 });
        }
        else {
            console.warn('Invalid key requested:', key);
        }
    });
    socket.on('disconnect', () => {
        console.log('A client disconnected:', socket.id);
    });
});
const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
