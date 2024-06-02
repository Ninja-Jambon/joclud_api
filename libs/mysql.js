const mysql = require("mysql");

const con = mysql.createConnection({
  host: process.env.MysqlHost,
  user: process.env.MysqlUser,
  password: process.env.MysqlPassword,
  database: process.env.MysqlDb,
});

// +-----------------------------------+
// |              GAMES                |
// +-----------------------------------+

function getGames() {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT * FROM games`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        }
        resolve(result);
      }
    );
  });
}

function getGame(gameid) {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT * FROM games WHERE id = "${gameid}"`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        }
        resolve(result);
      }
    )
  })
}

function addHelper(username, gameid) {
  return new Promise((resolve, reject) => {
    con.query(
      `UPDATE games SET helpers = JSON_ARRAY_APPEND(helpers, '$', ${username}) WHERE id = ${gameid}`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        }
        resolve(result);
      }
    )
  })
}

function removeHelper(username, gameid) {
  return new Promise((resolve, reject) => {
    con.query(
      `UPDATE games SET helpers = JSON_REMOVE(helpers, JSON_UNQUOTE(JSON_SEARCH(helpers, 'one', ${username}))) WHERE id = ${gameid}`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        }
        resolve(result);
      }
    );
  });
}

// +-----------------------------------+
// |               AUTH                |
// +-----------------------------------+

function getUser(username) {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT * FROM users WHERE username = "${username}"`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        }
        resolve(result);
      })
  }) 
}

function addUser(username, name, lastname, password) {
  return new Promise((resolve, reject) => {
    con.query(
      `INSERT INTO users(username, name, lastname, password) VALUES("${username}", "${name}", "${lastname}", "${password}")`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        }
        resolve(result);
      })
  }) 
}

module.exports = {
  getGames,
  getGame,
  addHelper,
  removeHelper,

  getUser,
  addUser,
};