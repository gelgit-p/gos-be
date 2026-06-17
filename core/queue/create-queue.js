const Bull = require('bull');
const config = require('./config');

/**
 * Bull Connection Config
 * @typedef {Object} BullConnectionConfig
 * @property {string} [queueName] - The name of the queue
 * @property {string} [redisUrl] - The redis connection string
 */

/**
 * Bull Connection Result
 * @typedef {Object} BullConnectionResult
 * @property {import("bull").Queue} queue
 */

/**
 * Normalize legacy Redis URLs so Bull can parse them correctly.
 * @param {string} redisUrl
 * @returns {string}
 */
function normalizeRedisUrl(redisUrl) {
  if (typeof redisUrl !== 'string') return redisUrl;
  const trimmed = redisUrl.trim();
  if (trimmed.startsWith('http://')) {
    return trimmed.replace(/^http:\/\//i, 'redis://');
  }
  if (trimmed.startsWith('https://')) {
    return trimmed.replace(/^https:\/\//i, 'rediss://');
  }
  return trimmed;
}

const createdQueues = new Map();
function createQueue(connectionConfig = config) {
  const { queueName, url } = connectionConfig;
  if (createdQueues.has(queueName)) {
    return createdQueues.get(queueName);
  }

  if (queueName && url) {
    const normalizedUrl = normalizeRedisUrl(url);
    const newQueue = new Bull(queueName, normalizedUrl);
    createdQueues.set(queueName, newQueue);
    return newQueue;
  }
}

module.exports = createQueue;
