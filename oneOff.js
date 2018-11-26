const { Client } = require('pg');
const action = process.argv[2];

const cleanDb = function(client){
  const dropQuery ="DROP SCHEMA IF EXISTS flower_catalog cascade;"
  client.query(dropQuery, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      // console.log(res);
      console.log("Dropped");
    }
    client.end();
  })
}



const initializeUsers = function(client){
  let createUsersQuery =
    "DROP SCHEMA IF EXISTS flower_catalog cascade;"
    +"CREATE SCHEMA flower_catalog;"
    +"SET search_path to flower_catalog;"
    +"DROP TABLE IF EXISTS users;"
    +"CREATE TABLE users"
    +"(user_name varchar(254) primary key,"
    +"password varchar(40) not null );"
  /* Inserting data into users table */

     +"insert into users values('Rahul','rahul123'),"
     +"('Harshad', 'harshad12'),"
     +"('Manish', 'manish23'),"
     +"('Madhuri', 'madhuri13'),"
     +"('Anjum', 'anjum543'),"
     +"('Omkar', 'omkar123'),"
     +"('Ketan', 'ketans123'),"
     +"('Shubham', 'shubham12'),"
     +"('Yogiraj', 'yogiraj1'),"
     +"('Suyog', 'suyog543');";

  client.query(createUsersQuery, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      // console.log(res);
      console.log("users created");
    }
    // client.end();
  })

}

const initializeComments = function(client){
  let createCommentsQuery =
  "SET search_path to flower_catalog;"
  +"DROP TABLE IF EXISTS comments;"
  +"CREATE TABLE comments"
  +"(user_name varchar(254),"
  +"comment varchar(200) not null ,"
  +"date varchar(200) not null,"
  +"time varchar(200) not null);";

  client.query(createCommentsQuery, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      // console.log(res);
      console.log("comments initialized");
    }
    client.end();
  })
}




const initialize = function(){
  const defaultCs = 'postgres://localhost:5432/manishy';
  const connectionString = process.env.DATABASE_URL||defaultCs;
  const client = new Client(connectionString);
  client.connect();
 if (action == "d") {
   cleanDb(client);
 }else if (action == "c") {
   initializeUsers(client);
   initializeComments(client);
 }else {
   console.log("Enter valid args 'd' to delete or 'c' for initialize tables");
 }
}

initialize();
