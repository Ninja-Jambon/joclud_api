const mysql = require("mysql");

function getConnection() {
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

function addHelper(connection, game_id, user_id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO helpers (game_id, user_id) VALUES (${game_id}, ${user_id})`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        }
        resolve(result);
      }
    )
  })
}

function removeHelper(connection, game_id, user_id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `DELETE FROM helpers WHERE game_id = ${game_id} and user_id = ${user_id}`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        }
        resolve(result);
      }
    );
  });
}

function getHelpers(connection, game_id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT name helpers.user_id FROM helpers JOIN users ON helpers.user_id = users.id WHERE game_id = ${game_id}`,
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

function getUnverifiedUsers(connection) {
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
