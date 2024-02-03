import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config({ path: 'dev.env' });
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;

export const redisClient = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
});

redisClient.on('connect', () => {
    console.log('client connected');
})

redisClient.on('ready', (error) => {
    console.log('client ready');
})

redisClient.on('error', (error) => {
    console.log(error.message);
})

redisClient.on('end', () => {
    console.log('client disconnected');
})

export default redisClient;