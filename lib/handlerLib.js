const path = require('path');
const dbHandler = require(path.resolve('./lib/dbHandler.js'));

const updateComments = function(req, res, next) {
  console.log("Updating comments");
  let promiseForComments = dbHandler.getCommentsPromise(req);
  promiseForComments
  .then((comments)=>{
    req.app.comments = comments;
    next();
  })
  .catch((err) => console.log(err));
}

const registerUser = function(req, res) {
  let isSamePassword = req.body.password[0] != req.body.password[1];
  if (isSamePassword) {
    res.send("Enter right password");
    return;
  }
  dbHandler.insertUser(req);
  console.log('User saved');
  res.redirect('./login.html');
}

const setSessionIdAndUser = (req, res, next) => {
  dbHandler.getAllUsersPromise(req)
  .then((registeredUsers)=>{
    let sessionid = req.cookies.sessionid;
    let currentUser = registeredUsers.find(u => u.session == sessionid);
    if (sessionid && currentUser) {
      req.user = currentUser;
    }
    next();
  })
  .catch((err) => console.log(err));
};

const logRequest = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const logSessionIdAndUser = function(req, res, next) {
  console.log(`sessionid is ${req.Cookies.sessionid}`);
  next();
};


const handleGetLogin = (req, res) => {
  if (!req.user) {
    res.redirect('/login.html');
    return;
  }
  res.redirect('/guestBook.html');
};


const areSame = function(registerUser, newUser) {
  let registerId = registerUser.user_name.toLowerCase();
  let newId = newUser.userName.toLowerCase();
  let registerPassword = registerUser.password;
  let newPassword = newUser.password;
  return registerId == newId && registerPassword == newPassword;
}

const handlePostLogin = function(req, res) {
  let usersPromise = dbHandler.getAllUsersPromise(req);
  usersPromise
  .then(function(registeredUsers){
    let user = registeredUsers.find((user) => {
      return areSame(user, req.body)
    });
    if (!user) {
      let message = `<h4 style="color:#bd0f0f;">invalid username!!<h4>`;
      res.send(message + req.app.fs.readFileSync('./public/login.html', 'utf8'))
      return;
    }
    let sessionid = new Date().getTime();
    res.cookie("sessionid", sessionid);
    dbHandler.updateSession(user, req, sessionid);
    res.redirect('./guestBook.html');
  })
  .catch((err) => console.log(err));
}


const handlePostLogOut = function(req, res) {
  res.clearCookie("sessionid");
  res.redirect("./index.html");
};

const generateCommentString = function(comment) {
  let timeAndDate = new Date();
  let commentInfo = {
    "Date": timeAndDate.toLocaleDateString(),
    "Time": timeAndDate.toLocaleTimeString(),
    "Name": comment.Name,
    "Comment": comment.Comment
  };
  return commentInfo;
};


const makeBackupOfNewComments = function(req) {
  dbHandler.insertComment(req);
  console.log('comments saved');
};

const handleComments = function(req, res) {
  if (!req.user) {
    res.redirect('./login.html');
    return;
  }
  makeBackupOfNewComments(req);
  res.redirect('./guestBook.html');
};

const serveGuestBook = function(req, res) {
  if (!req.user) {
    res.redirect('./login.html');
    return;
  }
  let path = "./public/guestBook.html";
  let guestBookContent = req.app.fs.readFileSync(path, "utf8");
  let allComments = req.app.comments;
  let contentToSend = addGuestBookAndComment(guestBookContent, allComments);
  res.setHeader("Content-type", "text/html");
  res.write(`Hello ${req.user.user_name}`);
  res.write(contentToSend);
  res.end();
};

const addGuestBookAndComment = function(guestBookContent, allComments) {
  commentToShow = [];
  allComments.reverse().forEach(parseFn);
  let line = "<br/><br/>------------------------------------------------<br/>";
  allComments = commentToShow.join(line);
  let contentToSend = guestBookContent.replace("commentInfos", allComments);
  return contentToSend;
};

const parseFn = function(comment) {
  let commentDetails = [
    "<b>Date :</b> " + comment["date"],
    "<b>Time :</b> " + comment["time"] + "<br/>",
    "<b>name :</b> " + comment["user_name"],
    "<b>comment :</b> " + comment["comment"]
  ].join("<br/>");
  commentToShow.push(commentDetails);
};

const missingResourceHandler = (req, res) => {
  res.statusCode = 404;
  res.write('File not found!');
  res.end();
  return;
};

module.exports = {
  // logSessionIdAndUser,
  logRequest,
  setSessionIdAndUser,
  handleGetLogin,
  handlePostLogin,
  handlePostLogOut,
  serveGuestBook,
  handleComments,
  missingResourceHandler,
  updateComments,
  registerUser
};
