import { Redis } from "https://deno.land/x/upstash_redis/mod.ts";

const redis = new Redis({
  url: Deno.env.get('UPSTASH_REDIS_REST_URL') as string,
  token: Deno.env.get('UPSTASH_REDIS_REST_TOKEN') as string,
});

export async function get(key: string) {
  return await redis.get(key);
}

export async function set(key: string, value: string, exp?: number) {
  await redis.set(key, value);
  if (exp) await redis.expire(key, exp);
  return true;
}

export async function del(key: string) {
  await redis.del(key);
  return true;
}
