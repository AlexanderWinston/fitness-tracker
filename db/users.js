/* eslint-disable no-useless-catch */
const client = require("./client");

async function createUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    INSERT INTO users(username, password)
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;`,
      [username, password]
    );
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT * 
    FROM users
    WHERE username=$1;
    `,
      [username]
    );
    if (user && user.password == password) {
      delete user.password;
      return user;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
    SELECT * FROM users
    WHERE "id" = ${userId};
    `);
    if (!user) {
      return null;
    }
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT * FROM users
    WHERE username =$1;
    `,
      [username]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};

// async function getUser({ username, password }) {
//   const user = await getUserByUsername(username);
//   const hashedPassword = user.password;
//   const passwordsMatch = await bcrypt.compare(password, hashedPassword);
//   try {
//     const { rows:[user], } = await client.query(`
//     SELECT *
//     FROM users
//     WHERE username=$1;
//     `,[username])
//     if (passwordsMatch) {
//       // return the user object (without the password)
//       return user
//     } else {
//       throw SomeError;
//     }
//     // if(user && user.password == password){
//       delete user.password
//       return user
//     // }else {
//     // return null

//   } catch(error){
//     throw error
//   }

// }
