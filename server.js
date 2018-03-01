const http = require('http');
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT;
const lib = require("./lib/handlerLib.js");

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


let server = http.createServer(app);
server.listen(PORT);

console.log(`server is listening to ${PORT}`);
console.log(server.address());
