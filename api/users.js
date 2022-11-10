const express = require('express');
const { getUserByUsername, createUser } = require('../db');
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

// POST /api/users/login

// POST /api/users/register
usersRouter.post("/register",async (req, res, next) =>{
	const { username, password } = req.body;
	if(password.length < 8){
		next({
			name:"PasswordLengthError",
			message:"Password Too Short!"});
	}
	try {
		const _user = await getUserByUsername(username);
		if( _user ){
			next({
				name: "UserExistError",
				message: `User ${username} is already taken.`,
			})
		}else {
		console.log(username)
		const user = await createUser({username, password});
		const token = jwt.sign({ id: user.id, username }, JWT_SECRET, {
			expiresIn: "1w",
		});
		res.send({ message: "Thank you for signing up!", token, user})}
	} catch({ name, message }) {
		next({ name, message });
	}
})

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = usersRouter;
