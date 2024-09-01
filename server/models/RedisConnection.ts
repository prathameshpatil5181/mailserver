import { Redis } from "ioredis";
const serviceUri = process.env.REDIS_URL || "";

const redis = new Redis(serviceUri);

export default redis;
