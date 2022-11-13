const express = require("express");
const {
  getUserByUsername,
  createUser,
  getUserById,
  getPublicRoutinesByUser,
} = require("../db");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");

// POST /api/users/login
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  console.log(password, "this is password");

  try {
    const user = await getUserByUsername(username);
    if (!user.password === password) {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or Password is incorrect",
        error: "Incorrect credentials",
      });
    } else {
      console.log(user.password, "this is user.password");
      const token = jwt.sign({ id: user.id, username }, JWT_SECRET);
      res.send({ message: "you're logged in!", token, user });
    }
  } catch ({ error, message, name }) {
    next({
      error,
      message,
      name,
    });
  }
});

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }
  if (password.length < 8) {
    next({
      name: "PasswordLengthError",
      message: "Password Too Short!",
    });
  }
  try {
    const _user = await getUserByUsername(username);
    if (_user) {
      next({
        name: "UserExistError",
        message: `User ${username} is already taken.`,
      });
    } else {
      console.log(username);
      const user = await createUser({ username, password });
      const token = jwt.sign({ id: user.id, username }, JWT_SECRET, {
        expiresIn: "1w",
      });
      res.send({ message: "Thank you for signing up!", token, user });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/users/me
usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    await getUserById(req.user.id);
    res.send({
      id: req.user.id,
      username: req.user.username,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/users/:username/routines
usersRouter.get("/:username/routines", async (req, res, next) => {
  try {
    const user = await getPublicRoutinesByUser(req.params);
    res.send(user);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = usersRouter;
