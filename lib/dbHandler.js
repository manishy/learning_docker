const usersTable = "user_details";

const insertComment = function(name, comment, client){
  const insertQuery = {
  text: 'INSERT INTO comments VALUES($1, $2)',
  values: [name, comment]
  }
  client.query(insertQuery, (err, res)=>{
    if (err) {
      console.log("fat gya");
      console.log(err);
    }else {
      console.log("chal gya");
    }
  })
}
module.exports = {
  insertComment
};
