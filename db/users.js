/* eslint-disable no-useless-catch */
const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  console.log('starting to create user line 8')
  try {
    const { rows: [user], } = await client.query(`
    INSERT INTO users(username, password)
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;`,[username, password])
    console.log(user, '!!!!!!22222')
    return user;
  }
  catch (error){
    throw error
  }

  
}

async function getUser({ username, password }) {


}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
