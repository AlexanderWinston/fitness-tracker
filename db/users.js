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
    // console.log(user, '!!!!!!22222')
    return user;
  }
  catch (error){
    throw error
  }

  
}

async function getUser({ username, password }) {
  console.log("starting to get user ")
  try {
    const { rows } = await client.query(`
    SELECT id, username, password 
    FROM users;
    `)
    console.log("user line 31!!!")
    return rows
  } catch(error){
    throw error
  }


}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
    SELECT * FROM users
    WHERE "id" = ${userId};
    `)
    if (!user){
      return null
    }
    console.log(user, "line 52")
    return user
  } catch(error){
    throw error
  }

}

async function getUserByUsername(username) {
console.log("getUserByUsername line 60")

  try {
    const {
      rows : [user]
    } = await client.query(`
    SELECT * FROM users
    WHERE username =$1;
    `, [username])
    return user
  } catch(error){
    throw error
  }


}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
