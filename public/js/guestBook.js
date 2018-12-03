const getElement = function(selector) {
  return document.querySelector(selector);
};

const goToLogin = function() {
  location.href = '/login.html';
};

const sendAjaxRequest = function(method,url,callBack,reqBody,asyn=true){
  let ajax = new XMLHttpRequest();
  ajax.onload=callBack;
  ajax.open(method,url,asyn);
  if(reqBody){
    ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    return ajax.send(reqBody);
  }
  ajax.send();
};

const handleServerResponse = function(responseText){
  getElement("#comment").value = "";
  if (!responseText.isValid) {
    goToLogin();
    return;
  }

  let allComments = responseText.comments;
  renderComments(allComments);
}


const renderComments = function(allComments) {
  commentToShow = [];
  allComments.reverse().forEach(parseFn);
  let line = "<br/><br/>------------------------------------------------<br/>";
  allComments = commentToShow.join(line);
  getElement("#comments").innerHTML = allComments;
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

const addAndShowAllComments = function(){
  return sendAjaxRequest('POST','/addComment',function(){
    handleServerResponse(JSON.parse(this.responseText));
  },`Comment=${getElement("#comment").value}`);
}

const setUserAndComments = function(){
  return sendAjaxRequest('GET','/getCurrentUserAndComments',function(){
    let response = JSON.parse(this.responseText);
    let currentUser = response["currentUserName"];
    let comments = response["comments"];
    renderComments(comments);
    getElement('#WelcomeNote').innerHTML = `Hello ${currentUser}`
  })
}


const setClickListener = function(selector,listener) {
  let element = getElement(selector);
  if(element){
    element.onclick = listener;
  }
};

const updateComment = function(){
  return sendAjaxRequest('GET','/getCurrentUserAndComments',function(){
    let response = JSON.parse(this.responseText);
    let comments = response["comments"];
    console.log("Updating comments");
    renderComments(comments);
  })
}

let load = function(){
  setUserAndComments();
  intervalId = setInterval(updateComment, 5000);
  setClickListener("#submitButton",addAndShowAllComments)
}

window.onload = load;
