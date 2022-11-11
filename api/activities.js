const express = require("express");
const {
  getAllActivities,
  createActivity,
  getActivityByName,
  getPublicRoutinesByActivity,
  getActivityById
} = require("../db"); 
const { requireUser } = require("./utils");
const activitiesRouter = express.Router();
// GET /api/activities/:activityId/routines
activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
	try{
	const activityId = req.params.activityId
	const activity = await getActivityById(activityId)
	if(!activity){
		next({
			message:`Activity ${activityId} not found`,
			error:"noActivityError",
			name:"noActivity",
		})
	}else{
	const publicRoutinesByActivity = await getPublicRoutinesByActivity(activity)
		res.send(publicRoutinesByActivity)

	}
	// console.log(publicRoutinesByActivity, 'this is public routines by activity')
} catch({name, message}){
	next({name, message})

}
})

// GET /api/activities
activitiesRouter.get("/", async (req, res) => {
  const activities = await getAllActivities();
  res.send(activities);
});

// POST /api/activities
// requireUser not included below?
activitiesRouter.post("/", requireUser, async (req, res, next) => {
  console.log("this is a random string");
  const { id, name, description } = req.body;
  // const activityData = {id, name, description};
  // console.log(activityData)
  try {
    const alreadyMadeActivity = await getActivityByName(name);
    console.log(alreadyMadeActivity, "this is alreadyMadeActivity");

    if (alreadyMadeActivity) {
      next({
        error: "activityError",
        message: `An activity with name ${name} already exists`,
        name: "createActivityError",
      });
    } else {
      const activity = await createActivity({ id, name, description });

      res.send(activity);
    }
  } catch ({ error, name, message }) {
    next(error, name, message);
  }
});

// PATCH /api/activities/:activityId
activitiesRouter
module.exports = activitiesRouter;
