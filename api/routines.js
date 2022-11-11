const express = require('express');
const { getAllPublicRoutines, createRoutine, getUserById,  } = require('../db');
const { requireUser} = require('./utils')
const routinesRouter = express.Router();

// GET /api/routines
routinesRouter.get('/', async (req, res) =>{
	const allRoutines = await getAllPublicRoutines();
	console.log(allRoutines)
	res.send(allRoutines)
})

// POST /api/routines
routinesRouter.post('/', requireUser, async (req, res, next) =>{
	const {  creatorId, isPublic, name, goal } = req.body;
	const routineData = {creatorId, isPublic, name, goal};
	try {
		const routines = await createRoutine(routineData)
		console.log(routines)
		// if (creatorId == req.user.id){
		res.send({
			creatorId:req.user.id, 
			isPublic,
			name,
			goal
		})
	}catch({name, message}){
			next({name, message})


		}
	
})

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = routinesRouter;
