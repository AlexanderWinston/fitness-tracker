const express = require('express');
const { getAllActivities, createActivity } = require('../db');
const { requireUser } = require('./utils');
const activitiesRouter = express.Router();
// GET /api/activities/:activityId/routines
// activitiesRouter.get('/', async (res, next) => {
// 	const 
// })

// GET /api/activities
activitiesRouter.get('/', async (req, res) => {
	const activities = await getAllActivities()
	res.send(activities)
})

// POST /api/activities
// requireUser not included below?
activitiesRouter.post('/', async (req, res, next) =>{
	const { id, name, description } = req.body;
	const activityData = {id, name, description};
	try {
		const activity = await createActivity(activityData)
		console.log(activityData)
		if(activity){
			res.send (activity)

		}else{
			next ({name: "noActivityError",
				message: "Valid activity is necessary",
				})
}
		} catch({name, message}){
			next({name, message:`An activity with name ${activityData.name} already exists`})


		}
	
})

// PATCH /api/activities/:activityId


module.exports = activitiesRouter;
