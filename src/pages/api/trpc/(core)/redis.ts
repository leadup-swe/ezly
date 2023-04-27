import Redis from "ioredis";

let redis: Redis;

export const getRedis = () => {
  if (!redis) {
    redis = new Redis();
  }
  return redis;
};
