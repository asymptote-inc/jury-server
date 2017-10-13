const mongoDbConnectionString =
    process.env.NODE_ENV === 'production' ?
        `mongodb://${process.env.mongodb_username}:${process.env.mongodb_password}@cluster-x-shard-00-00-h0b6c.mongodb.net:27017,cluster-x-shard-00-01-h0b6c.mongodb.net:27017,cluster-x-shard-00-02-h0b6c.mongodb.net:27017/jury?ssl=true&replicaSet=cluster-x-shard-0&authSource=admin` :
        `mongodb://localhost:27017/jury`;

const crowd9ApiUrl =
    process.env.NODE_ENV === 'production' ?
        'https://crowd9api-dot-wikidetox.appspot.com' :
        'http://localhost:8000';
const clientJobKey = process.env.client_job_key;

module.exports = { crowd9ApiUrl, mongoDbConnectionString, clientJobKey };
