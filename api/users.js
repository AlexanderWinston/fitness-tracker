const express = require('express');
const { getUserByUsername, createUser, getUserById, getPublicRoutinesByUser } = require('../db');
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const {requireUser} = require("./utils")

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
usersRouter.get("/me", requireUser,async (req, res, next)=>{
	
// if (!req.user){
// 	res.statusCode = 401
// 	res.send({
// 		error: "UserError",
// 		name:"Unauthorized User Error",
// 		message:"You must be logged in to perform this action"
// 	})
// }

	try {
		await getUserById(req.user.id)
		res.send({
			id: req.user.id,
			username : req.user.username
		})
		// const user = await getUserByUsername(username);
		// console.log(user, 'this is user')
		// const token =jwt.sign({ id: user.id, username}, JWT_SECRET)
	
		// if(user.token == token ){
		// 	console.log(token)
		// 	res.send({ user })
	
		// }

	} catch({name, message}){
		next({name, message});
	}

})

// GET /api/users/:username/routines
usersRouter.get("/:username/routines", async (req, res, next) => {
	try {
		const user = await getPublicRoutinesByUser(req.params)
		res.send(user)
	} catch ({name,message}){
		next({name,message})
	}
})

module.exports = usersRouter;
