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
  client.query(insertQuery, (err, res)=>{
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

module.exports = {
  insertComment,
  insertUser
};
