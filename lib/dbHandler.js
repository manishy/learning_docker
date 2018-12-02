// Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code



const insertComment = function(req){
  let timeAndDate = new Date();
  let client = req.app.client;
  let comment = req.body.Comment
  let name = req.user.user_name;
  let date = timeAndDate.toLocaleDateString();
  let time = timeAndDate.toLocaleTimeString();
  const insertQuery = {
  text: 'INSERT INTO comments VALUES($1, $2, $3, $4)',
  values: [name, comment, date, time]
  }
  return client.query(insertQuery, (err, res)=>{
    if (err) {
      console.log("fat gya");
      console.log(err);
    }else {
      console.log("chal gya");
    }
  })
};

const insertUser = function(req){
  let client = req.app.client;
  let userId = req.body.user;
  let password = req.body.password;
  const setQuery = {
  text: "SET search_path to flower_catalog;"
  }
  client.query(setQuery);
  const insertQuery = {
  text: 'INSERT INTO users VALUES($1, $2)',
  values: [userId, password[0]]
  }
  client.query(insertQuery, (err, response)=>{
    if (err) {
      console.log("fat gya");
      console.log(err);
    }else {
      console.log("chal gya");
    }
  })
}


const updateSession = function(user, req, sessionid){
  let client = req.app.client;
  let userId = user.user_name;
  const setQuery = {
  text: "SET search_path to flower_catalog;"
  }
  client.query(setQuery);
  const updateQuery = {
  text: 'UPDATE users SET session = ($1) WHERE user_name = ($2)',
  values: [sessionid, userId]
  }
  client.query(updateQuery, (err, response)=>{
    if (err) {
      console.log("fat gya");
      console.log(err);
    }else {
      console.log("chal gya");
    }
  })
}

const filterSelectResult = (response) => {
  return response.command == "SELECT";
};

const getCommentsPromise = function(req){
  let client = req.app.client;
  let query = "SET search_path to flower_catalog;" +
    "SELECT * FROM comments;";
  return client.query(query)
  .then((response)=>{
    let selectQueryResult = response.filter(filterSelectResult);
    let comments = selectQueryResult[0].rows;
    return comments;
  })
  .catch((err) => console.log(err));
}


const getAllUsersPromise = function(req){
  let client = req.app.client;
  let query = "SET search_path to flower_catalog;" +
              "SELECT * FROM users;";
  return client.query(query)
  .then((response)=>{
    let selectQueryResult = response.filter(filterSelectResult);
    let registeredUsers = selectQueryResult[0].rows;
    return registeredUsers;
  })
  .catch((err) => console.log(err));
}

module.exports = {
  insertComment,
  insertUser,
  updateSession,
  getCommentsPromise,
  getAllUsersPromise
};
