const fs = require("fs");
const http = require('http');
const app = require("./app.js");

const PORT = process.env.PORT || 8080;
const defaultCs = 'postgres://localhost:5432/manishy';
const connectionString = process.env.DATABASE_URL||defaultCs;
const {Client} = require('pg');

const client = new Client(connectionString);
client.connect();
app.initialize(client, fs);


let server = http.createServer(app);
server.listen(PORT);

console.log(`server is listening to ${PORT}`);
console.log(server.address());
