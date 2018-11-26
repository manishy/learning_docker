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

module.exports = {
  insertComment
};
