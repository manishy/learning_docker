let registeredUsers = [{
  userName: 'manish',
  name: 'manish yadav'
},
{
  userName: 'manoj',
  name: 'manoj kumar yadav'
}
];

const setSessionIdAndUser = (req, res, next) => {
  let sessionid = req.cookies.sessionid;
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
  let user = registeredUsers.find(u => u.userName == req.body.userName);
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
  let newComment = req.body;
  newComment.Name = req.user.name;
  let fs = req.app.fs;
  fs.readFile("./data/comments.json", "utf8", function(err, PrevComments) {
    addComment(PrevComments, newComment, fs);
  });
};

const addComment = function(PrevComments, newComment,fs) {
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
  console.log(req.user);
  if (!req.user) {
    res.redirect('/login');
    return;
  }
  let path = "./public/guestBook.html";
  let guestBookContent = req.app.fs.readFileSync(path, "utf8");
  let allComments = req.app.fs.readFileSync("./data/comments.json", "utf8");
  let contentToSend = addGuestBookAndComment(guestBookContent, allComments);
  res.setHeader("Content-type", "text/html");
  res.write(`hello ${req.user.name}`);
  res.write(contentToSend);
  res.end();
};

const addGuestBookAndComment = function(guestBookContent, allComments) {
  commentToShow = [];
  JSON.parse(allComments).forEach(parseFn);
  let line = "<br/><br/>------------------------------------------------<br/>";
  allComments = commentToShow.join(line);
  let contentToSend = guestBookContent.replace("commentInfos", allComments);
  return contentToSend;
};

const parseFn = function(comment) {
  let commentDetails = [
    "<b>Date :</b> " + comment["Date"],
    "<b>Time :</b> " + comment["Time"] + "<br/>",
    "<b>name :</b> " + comment["Name"],
    "<b>comment :</b> " + comment["Comment"]
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
  missingResourceHandler
};
