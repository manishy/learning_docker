const path = require('path');
const dbHandler = require(path.resolve('./lib/dbHandler.js'));
const filterSelectResult = (response) => {
  return response.command == "SELECT";
};

const updateComments = function(req, res, next) {
  console.log("Updating comments");
  let client = req.app.client;
  let query = "SET search_path to flower_catalog;" +
    "SELECT * FROM comments;";
  client.query(query, (err, response) => {
    if (err) {
      console.log(err.stack)
    } else {
      selectQueryResult = response.filter(filterSelectResult);
      let comments = selectQueryResult[0].rows;
      req.app.comments = comments;
      next();
    }
  })
}

const updateUsers = (req, res, next) => {
  console.log("Updating users");
  let client = req.app.client;
  let query = "SET search_path to flower_catalog;" +
    "SELECT * FROM users;";
  client.query(query, (err, response) => {
    if (err) {
      console.log(err.stack)
    } else {
      selectQueryResult = response.filter(filterSelectResult);
      let registeredUsers = selectQueryResult[0].rows;
      req.app.users = registeredUsers;
      next();
    }
  })
};

const setSessionIdAndUser = (req, res, next) => {
  let sessionid = req.cookies.sessionid;
  let registeredUsers = req.app.users;
  let user = registeredUsers.find(u => u.sessionid == sessionid);
  if (sessionid && user) {
    req.user = user;
  }
  next();
};

const logRequest = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const logSessionIdAndUser = function(req, res, next) {
  console.log(`sessionid is ${req.Cookies.sessionid}`);
  next();
};


const tagify = function(tag, attributes, text) {
  let attributeStrings = Object.keys(attributes).map((attribute) => {
    return `${attribute}="${attributes[attribute]}"`;
  });
  return `<${tag} ${attributeStrings.join(" ")}>${text}</${tag}>`;
};

const getForm = () => {
  let userNameInput = tagify("input", {
    name: "userName"
  }, "");
  let placeInput = tagify("input", {
    name: "place"
  }, "");
  let submitInput = tagify("input", {
    type: "submit"
  }, "");
  let allInputs = userNameInput + placeInput + submitInput;
  return tagify("form", {
    method: "POST"
  }, allInputs);
};


const handleGetLogin = (req, res) => {
  if (!req.user) {
    res.send(getForm());
    return;
  }
  res.redirect('/guestBook.html');
};

const insertResUtils = function(req, res, next) {
  res.setContentType = setContentType;
  res.setCookie = setCookie;
  next();
};



const handlePostLogin = function(req, res) {
  registeredUsers = req.app.users;
  let user = registeredUsers.find(u => u.user_name.toLowerCase() == req.body.userName.toLowerCase());
  if (!user) {
    let message = `<h4 style="color:#bd0f0f;">invalid username!!<h4>`;
    res.send(message + getForm());
    return;
  }
  let sessionid = new Date().getTime();
  res.cookie("sessionid", sessionid);
  user.sessionid = sessionid;
  res.redirect('./guestBook.html');
};

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
  let fs = req.app.fs;
  dbHandler.insertComment(req);
  console.log('comments saved');
};

const addComment = function(PrevComments, newComment, fs) {
  let commentsData = JSON.parse(PrevComments);
  commentsData.unshift(generateCommentString(newComment));
  let contents = JSON.stringify(commentsData, null, 2);
  fs.writeFileSync("./data/comments.json", contents);
  console.log('comments saved');
};


const handleComments = function(req, res) {
  if (!req.user) {
    res.redirect('/login');
    return;
  }
  makeBackupOfNewComments(req);
  res.redirect('./guestBook.html');
};

const serveGuestBook = function(req, res) {
  if (!req.user) {
    res.redirect('/login');
    return;
  }
  let path = "./public/guestBook.html";
  let guestBookContent = req.app.fs.readFileSync(path, "utf8");
  let allComments = req.app.comments;
  let contentToSend = addGuestBookAndComment(guestBookContent, allComments);
  res.setHeader("Content-type", "text/html");
  res.write(`hello ${req.user.user_name}`);
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

const serveSpecificFile = function(req, res) {
  let url = req.url;
  res.setContentType(req.url);
  try {
    let content = req.app.fs.readFileSync("./public" + req.url);
    res.write(content);
    res.end();
  } catch (e) {
    missingResourceHandler(req, res);
  }
};

const missingResourceHandler = (req, res) => {
  res.statusCode = 404;
  res.write('File not found!');
  res.end();
  return;
};

module.exports = {
  // logSessionIdAndUser,
  // insertResUtils,
  logRequest,
  setSessionIdAndUser,
  handleGetLogin,
  handlePostLogin,
  handlePostLogOut,
  serveGuestBook,
  handleComments,
  serveSpecificFile,
  missingResourceHandler,
  updateUsers,
  updateComments
};
