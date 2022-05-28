import { Injectable } from '@nestjs/common';
import redisConfig from 'src/config/redisConfig';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
    private redisClient;

    constructor() {
        const { host, port, db } = redisConfig;
        this.redisClient = createClient({
            url: process.env.REDIS_URL || `redis://${host}:${port}/${db}`,
        });
        this.redisClient.on('error', (err) => {
            console.error('Redis error: ', err);
        });
    }

    async get(key: string): Promise<any> {
        return this.redisClient.get(key, (error) => {
            console.error(error);
        });
    }

    async set(key: string, value: any, expires: number): Promise<void> {
        const expireArgs = expires ? ['EX', expires] : [];
        this.redisClient.set(
            key,
            value,
            ...expireArgs,
            (error) => {
                console.error(error);
            },
        );
    }

    async del(key: string): Promise<void> {
        await this.redisClient.del(key, (error) => {
            console.error(error);
        });
    }

    async onModuleInit(): Promise<void> {
        await this.redisClient.connect();
    }
}
