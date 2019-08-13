const redis = require('redis')
const url = require('../../construct').REDIS_SERVER

let client = redis.createClient(url);

let cache = {}

cache.get = (key) => {
    return new Promise((resolve) => {
        client.get(key, (err, reply) => {
            resolve(reply)
        })
    })
}

cache.getKeys = () => {
    return new Promise((resolve) => {
        client.keys('*', function (err, keys) {
            resolve(keys)
        })
    })
}

cache.store = (key, value) => {
    return client.set(key, JSON.stringify(value))
}

cache.delete = (key) => {
    return client.del(key);
}

cache.clearCache = () => {
    return client.flushdb();
}

cache.start = client

module.exports = cache
