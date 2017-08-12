var pg = require("pg");

var config = {
    database: "betelgeuse", // name of the database
    host: "localhost", // where your db is located
    port: 5432, // the port number for your database
    max: 10, // the number of connections allowed at a time
    idleTimeoutMillis: 30000 // 30 seconds to try to connect
};

module.exports = pg.Pool(config);