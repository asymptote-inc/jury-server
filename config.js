var mongoDbConnectionString;

if (process.env.NODE_ENV === 'production') {
    mongoDbConnectionString = `mongodb://${process.env.mongodb_username}:${process.env.mongodb_password}@cluster-x-shard-00-00-h0b6c.mongodb.net:27017,cluster-x-shard-00-01-h0b6c.mongodb.net:27017,cluster-x-shard-00-02-h0b6c.mongodb.net:27017/jury?ssl=true&replicaSet=cluster-x-shard-0&authSource=admin`;
} else {
    mongoDbConnectionString = `mongodb://localhost:27017/jury`;
}

module.exports = mongoDbConnectionString;
