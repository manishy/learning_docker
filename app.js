const express = require("express");
const app = express();
const path = require('path');
const lib = require(path.resolve("./lib/handlerLib.js"));
const cookieParser = require('cookie-parser');



app.initialize = function(client, fs) {
  app.fs = fs;
  app.client = client;
  app.comments = [];
};

app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(lib.setSessionIdAndUser);
// app.use(lib.insertResUtils);
// app.use(lib.logSessionIdAndUser);
app.use(lib.logRequest);
app.get('/login', lib.handleGetLogin);
app.get('/guestBook.html',lib.updateComments, lib.serveGuestBook);
app.post('/logout',lib.handlePostLogOut);
app.post('/login',lib.handlePostLogin);
app.post('/addComment', lib.handleComments);
app.post('/registration', lib.registerUser);
app.use(express.static('public'));


module.exports = app;
