# Redis-Learning

## Introduction to Redis

Redis is an open-source, in-memory data structure store that can be used as a database, cache, and message broker. It supports various data structures, such as strings, hashes, lists, sets, and sorted sets.

---

## Core Redis Commands

### Basic Commands

- **PING**: Check if the Redis server is running.

  ```
  PING
  ```

  Response: `PONG`

- **SET**: Set a key to a value.

  ```
  SET key value
  ```

- **GET**: Retrieve the value of a key.

  ```
  GET key
  ```

- **DEL**: Delete one or more keys.

  ```
  DEL key1 key2
  ```

- **EXPIRE**: Set a time-to-live (TTL) in seconds for a key.

  ```
  EXPIRE key 10
  ```

- **TTL**: Get the remaining TTL of a key.

  ```
  TTL key
  ```

- **SETEX**: Set a key with a value and expiration time.

  ```
  SETEX key 60 value
  ```

### Working with Lists

- **LPUSH**: Add elements to the beginning of a list.

  ```
  LPUSH list_name value1 value2
  ```

- **RPUSH**: Add elements to the end of a list.

  ```
  RPUSH list_name value1 value2
  ```

- **LRANGE**: Get a range of elements from a list.

  ```
  LRANGE list_name 0 -1
  ```

  Example:

  ```
  LRANGE problems 0 -1
  ```

  Returns all elements in the list.

- **RPOP**: Remove and return the last element from a list.

  ```
  RPOP list_name
  ```

- **BRPOP**: Remove and return the last element from a list, with a timeout. If the list is empty, it waits for the specified time.

  ```
  BRPOP list_name 5
  ```

### Hash Operations

- **HSET**: Set field-value pairs in a hash.

  ```
  HSET user:100 name "John Doe" email "user@example.com" age "30"
  ```

- **HGET**: Get the value of a field in a hash.

  ```
  HGET user:100 name
  ```

### Key Patterning for Uniqueness

Use patterns like `user:100` to uniquely identify entities (e.g., users) in a structured manner.

### Key Retrieval

- **KEYS \***: Retrieve all keys.
  ```
  KEYS *
  ```
- **MGET**: Retrieve the values of multiple keys.
  ```
  MGET key1 key2
  ```

---

## Persistence in Redis

Redis provides two main mechanisms for persistence:

1. **RDB (Redis Database File)**: Takes point-in-time snapshots of your dataset at specified intervals.

   - You can configure Redis to create snapshots every `x` minutes if `y` keys have changed.
   - Example configuration:
     ```
     save 300 1   # Save the dataset every 300 seconds if at least 1 key changed
     save 60 1000 # Save the dataset every 60 seconds if at least 1000 keys change
     ```

2. **AOF (Append Only File)**: Logs every write operation received by the server. This approach allows for better durability but may be slower than RDB.

   - Example configuration:
     ```
     appendonly yes
     appendfsync everysec
     ```

### When to Use AOF or RDB?

- Use **AOF** if you want minimal data loss, as it logs every operation.
- Use **RDB** if you want faster performance and can tolerate occasional data loss.

---

## Redis Indexing with RediSearch

RediSearch is a Redis module that enables querying, secondary indexing, and full-text search on Redis data.

### Creating an Index

- Example command to create a RediSearch index:
  ```
  FT.CREATE idx:bicycle ON JSON PREFIX 1 bicycle: SCORE 1.0 SCHEMA \
  $.brand AS brand TEXT WEIGHT 1.0 \
  $.model AS model TEXT WEIGHT 1.0 \
  $.description AS description TEXT WEIGHT 1.0 \
  $.price AS price NUMERIC \
  $.condition AS condition TAG SEPARATOR ,
  ```
  Explanation:
  - `FT.CREATE idx:bicycle`: Create a new RediSearch index named `idx:bicycle`.
  - `ON JSON`: Operate on JSON documents stored in Redis.
  - `PREFIX 1 bicycle:`: Index only documents whose keys start with `bicycle:`.
  - `SCORE 1.0`: Assign a default relevance score of `1.0`.
  - `SCHEMA`: Define the fields to index:
    - `$.brand`, `$.model`, `$.description`: Indexed as text fields with weight `1.0`.
    - `$.price`: Indexed as a numeric field.
    - `$.condition`: Indexed as a tag field, using `,` as a separator.

---

## Docker and Redis Setup

### Running Redis in a Docker Container

- Command to run Redis in a Docker container:
  ```
  docker run -d --name redis-container -p 6380:6379 redis
  ```
  Explanation:
  - The Redis server runs inside the container on port `6379`, but it is accessible on the host machine through port `6380`.

### Connecting to Redis from Node.js

- Example Node.js code to create a Redis client:
  ```javascript
  const client = redis.createClient({
      socket: {
          host: '127.0.0.1',
          port: 6380
      }
  });
  ```
  Note: Redis no longer supports specifying `port` and `host` directly without the `socket` object.

---

## Rate Limiting Example with Redis

### Example Implementation

```javascript
const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
const key = `${clientIP}:request_count`;
const requestCount = await client.incr(key);
const limit = 10;
const timer = 50;

if (requestCount === 1) {
    client.expire(key, timer);
}

const ttl = await client.ttl(key);
if (requestCount > limit) {
    return res.status(429).send(`Too many requests, please try after ${ttl} seconds`);
}
```

---

## Sorted Sets in Redis

Sorted sets store unique elements ordered by a score.

### Commands

- **ZADD**: Add elements with a score.
  ```
  ZADD racer_scores 10 "Norem"
  ```
- **ZRANGE**: Retrieve elements within a range of indexes.
  ```
  ZRANGE racer_scores 0 -1
  ```
- **ZRANGEBYSCORE**: Retrieve elements within a range of scores.
  ```
  ZRANGEBYSCORE racer_scores -inf 10
  ```
- **ZRANK**: Get the rank of an element.
  ```
  ZRANK racer_scores "Norem"
  ```
- **ZREMRANGEBYSCORE**: Remove elements within a range of scores.
  ```
  ZREMRANGEBYSCORE racer_scores -inf 9
  ```

---

## Redis with TLS

TLS (Transport Layer Security) encrypts communication between Redis clients and servers, ensuring data confidentiality and integrity. By default, Redis does not use encryption, meaning data sent over the network can be intercepted.

### Setting up TLS in Redis

1. Generate TLS certificates.
2. Configure the Redis server to use TLS by adding the following settings to `redis.conf`:
   ```
   tls-cert-file /path/to/redis.crt
   tls-key-file /path/to/redis.key
   tls-ca-cert-file /path/to/ca.crt
   ```
3. Start the Redis server with TLS enabled.

---

## Useful Links

- [Redis Documentation](https://redis.io/docs/latest/develop/data-types/)

