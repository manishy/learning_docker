const {
  Client
} = require('pg');


const initializeUsersAndComments = function(client) {
  let createQuery =
    // creating scema
    "CREATE SCHEMA IF NOT EXISTS flower_catalog;" +
    "SET search_path to flower_catalog;"
    // creating users
    +
    "CREATE TABLE IF NOT EXISTS users" +
    "(user_name varchar(254) primary key," +
    "password varchar(40) not null," +
    "session varchar(20));"
    // creating comments
    +
    "CREATE TABLE IF NOT EXISTS comments" +
    "(user_name varchar(254)," +
    "comment varchar(200) not null ," +
    "date varchar(200) not null," +
    "time varchar(200) not null);";

  client.query(createQuery, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log("created users and comments");
    }
    client.end();
  })
}


const initialize = function() {
  const defaultCs = 'postgres://localhost:5432/manishy';
  const connectionString = process.env.DATABASE_URL || defaultCs;
  const client = new Client(connectionString);
  client.connect();
  initializeUsersAndComments(client);
}

initialize();
