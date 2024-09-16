const mysql = require("mysql");

export function getConnection() {
  return mysql.createConnection({
    host: process.env.MysqlHost,
    user: process.env.MysqlUser,
    password: process.env.MysqlPassword,
    database: process.env.MysqlDb,
  });
}

// +-----------------------------------+
// |              GAMES                |
// +-----------------------------------+

function getGames(connection) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT id, title, subtitle, type, players, duration, ages FROM games`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        }
        resolve(result);
      }
    );
  });
}

function getGame(connection, gameid) {
  return new Promise((resolve, reject) => {
    connection.query(
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

function addHelper(connection, username, gameid) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE games SET helpers = JSON_ARRAY_APPEND(helpers, '$', "${username}") WHERE id = ${gameid}`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        }
        resolve(result);
      }
    )
  })
}

function removeHelper(connection, username, gameid) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE games SET helpers = JSON_REMOVE(helpers, JSON_UNQUOTE(JSON_SEARCH(helpers, 'one', "${username}"))) WHERE id = ${gameid}`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        }
        resolve(result);
      }
    );
  });
}

function getHelpers(connection, gameid) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT helpers FROM games WHERE id = "${gameid}"`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        }
        resolve(result);
      }
    )
  })
}

// +-----------------------------------+
// |               AUTH                |
// +-----------------------------------+

function getUser(connection, username) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM users WHERE username = "${username}"`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        }
        resolve(result);
      })
  }) 
}

function addUser(connection, username, name, lastname, password) {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO users(username, name, lastname, password) VALUES("${username}", "${name}", "${lastname}", "${password}")`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        }
        resolve(result);
      })
  }) 
}

// +-----------------------------------+
// |              ADMIN                |
// +-----------------------------------+

export function getUnverifiedUsers(connection) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM users WHERE verified = 0`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        }
        resolve(result);
      })
  }) 
}

function setVerified(connection, username) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE users SET verified = 1 WHERE username = "${username}"`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        }
        resolve(result);
      })
  }) 
}

module.exports = {
  getConnection,

  getGames,
  getGame,
  addHelper,
  removeHelper,
  getHelpers,

  getUser,
  addUser,

  getUnverifiedUsers,
  setVerified,
};
