const http = require('http');
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT;
const defaultCs = 'postgres://localhost:5432/flower_catalog';
const connectionString = process.env.DATABASE_URL||defaultCs;
const lib = require("./lib/handlerLib.js");
const {Client} = require('pg');


app.initialize = function(client) {
  app.client = client;
};
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(lib.setSessionIdAndUser);
// app.use(lib.insertResUtils);
// app.use(lib.logSessionIdAndUser);
// app.use(lib.logRequest);

app.get('/login', lib.handleGetLogin);
app.get('/guestBook.html', lib.serveGuestBook);
app.post('/logout',lib.handlePostLogOut);
app.post('/login', lib.handlePostLogin);
app.post('/addComment', lib.handleComments);
app.use(express.static('public'));


const client = new Client(connectionString);
client.connect();
app.initialize(client);

let server = http.createServer(app);
server.listen(PORT);

console.log(`server is listening to ${PORT}`);
console.log(server.address());
