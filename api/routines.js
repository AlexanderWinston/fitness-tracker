const express = require('express');
const { getAllPublicRoutines, createRoutine, getUserById, getRoutineById, updateRoutine,  } = require('../db');
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
routinesRouter.patch('/:routineId', requireUser, async (req, res, next)=> {
	const{routineId} =req.params
	const {creatorId, isPublic, name, goal } = req.body
	const updateFields = {}

	if (isPublic){
		updateFields.isPublic=isPublic
	}
	if (name){
		updateFields.name=name
	}
	if (goal){
		updateFields.goal=goal
	}
	try {
		const originalRoutine = await getRoutineById(routineId)
		console.log(originalRoutine, "original Routine!!")
		if(originalRoutine.creatorId === req.user.id){
			const updatedRoutine = await updateRoutine(routineId, updateFields)
			res.send({routine:updatedRoutine})
		} else {
			
				res.statusCode= 403
				next({
				name: "UnauthorizedUserError",
				message: "You cannot update a routine that is not yours"
			})
		
		}

	} catch({name,message}){
		next({name,message})
	}
	
})

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = routinesRouter;
