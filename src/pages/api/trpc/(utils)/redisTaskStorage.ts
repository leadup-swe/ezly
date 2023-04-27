import { brotliCompressSync, brotliDecompressSync } from "zlib";
import { getRedis } from "../(core)/redis";

export const redisStoreTask = async (
  descr: string | undefined,
  title: string | undefined,
  taskId: string
) => {
  const task = {
    title,
    description: descr,
  };

  const taskStr = JSON.stringify(task);
  const compactedTask = brotliCompressSync(taskStr).toString("base64");

  const redis = getRedis();
  return redis.set(taskId, compactedTask);
};

export const redisGetTask = async (
  taskId: string
): Promise<{ title: string, description: string } | null> => {
  const redis = getRedis();
  const task = await redis.get(taskId);

  if (!task) {
    return null;
  }

  const decompressedTask = brotliDecompressSync(
    Buffer.from(task, "base64")
  ).toString("utf-8");
  const parsedTask = JSON.parse(decompressedTask);

  return parsedTask;
};

export const redisGetTasks = async (taskIds: string[]) => {
  const redis = getRedis();
  const tasks = await redis.mget(taskIds);

  const tasksObj: { [id: string]: { title: string, description: string } } = {};

  taskIds.forEach((taskId, index) => {
    if (!tasks[index]) {
      return;
    }

    const decompressedTask = brotliDecompressSync(
      Buffer.from(tasks[index] as string, "base64")
    ).toString("utf-8");
    const parsedTask = JSON.parse(decompressedTask);

    tasksObj[taskId] = parsedTask;
  });

  return tasksObj;
};
