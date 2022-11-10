const express = require('express');
const { getUserByUsername, createUser } = require('../db');
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

// POST /api/users/login
usersRouter.post("/login", async (req, res, next) =>{
	const { username, password} = req.body;
	if(!username || !password){
		next({
			name:"MissingCredentialsError",
			message:"Please supply both a username and password",
		})
	}
	try{
		const user = await getUserByUsername(username)
		if(user && user.password == password){
			const token = jwt.sign({ id: user.id, username }, JWT_SECRET) 
				res.send({ message: "you're logged in!", token, user})
		
		} else{
			next({
				name: "IncorrectCredentialsError",
				message: "Username or Password is incorrect",
			})
		}
	} catch(error){
		next(error);
	}
})

// POST /api/users/register
usersRouter.post("/register",async (req, res, next) =>{
	
	const { username, password } = req.body;
	if (!username || !password) {
		next({
		name: "MissingCredentialsError",
		message: "Please supply both a username and password",
		});
	}
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
