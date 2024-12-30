import express, {Request, Response} from 'express';
import {createServer} from 'http';
import {Server as SocketServer, Socket} from 'socket.io';
import {createClient} from 'redis';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

app.use(cors({
    origin: '*',
}));

const io = new SocketServer(httpServer, {
    cors: {
        origin: '*',
    },
});

const redisClient = createClient({
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
    'key9',
    'key10',];

(async () => {
    try {
        await redisClient.connect();
        console.log('Redis connected successfully');
    } catch (err) {
        console.error('Redis connection error:', err);
    }
})();

app.use(express.static('public'));

app.get('/api/plus/:key', async (req: Request, res: Response) => {
    try {
        const {key} = req.params;

        if (!allowedKeys.includes(key)) {
            return res.status(400).json({ok: false, error: 'Key not allowed'});
        }

        const newValue = await redisClient.incr(key);
        io.emit('update', {key, count: newValue});
        res.json({ok: true, key});
    } catch (error) {
        console.error(error);
        res.status(500).json({ok: false, error});
    }
});

io.on('connection', async (socket: Socket) => {
    console.log('A client connected:', socket.id);

    try {
        const initialData: Record<string, number> = {};
        for (const key of allowedKeys) {
            const value = await redisClient.get(key);
            initialData[key] = Number(value) || 0;
        }
        socket.emit('initialData', initialData);
    } catch (error) {
        console.error('Error fetching initial data:', error);
    }

    socket.on('getCount', async (key: string) => {
        if (allowedKeys.includes(key)) {
            const value = await redisClient.get(key);
            socket.emit('update', {key, count: Number(value) || 0});
        } else {
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
