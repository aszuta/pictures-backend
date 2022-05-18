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
        })
    }

    async get(key): Promise<any> {
        return this.redisClient.get(key);
    }

    async set(key, value, expires): Promise<void> {
        await this.redisClient.set(key, value, 'EX', expires);
    }

    async del(key): Promise<void> {
        await this.redisClient.del(key);
    }

    async onModuleInit(): Promise<void> {
        await this.redisClient.connect();
    }
}
