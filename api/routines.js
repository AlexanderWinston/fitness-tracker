const express = require('express');
const { getAllRoutines, createRoutine, getUserById,  } = require('../db');
const { requireUser} = require('./utils')
const routinesRouter = express.Router();

// GET /api/routines
routinesRouter.get('/', async (req, res) =>{
	const allRoutines = await getAllRoutines();
	console.log(allRoutines)
	res.send(allRoutines)
})

// POST /api/routines
routinesRouter.post('/', requireUser, async (req, res, next) =>{
	const { id, creatorId, isPublic, name, goal } = req.body;
	const routineData = {id, creatorId, isPublic, name, goal};
	try {
		const routines = await createRoutine(routineData)
		const user = await getUserById(id); 
		
		if(routines && creatorId === user.id){
			res.send (routines)

		}else{
			next ({name: "noRoutineError",
				message: "Valid routine is necessary",
				})
}
		} catch({name, message}){
			next({name, message:`An routine with ${routineData.id} already exists`})


		}
	
})

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = routinesRouter;
