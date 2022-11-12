const express = require("express");
const {
  getAllActivities,
  createActivity,
  getActivityByName,
  getPublicRoutinesByActivity,
  getActivityById,
  updateActivity
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
 
  const { id, name, description } = req.body;
  // const activityData = {id, name, description};
  // console.log(activityData)
  try {
    const alreadyMadeActivity = await getActivityByName(name);
   ;

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
activitiesRouter.patch("/:activityId", requireUser, async (req,res,next)=>{
  //need to troubleshoot error if updated name = original name
    try {
      const activityId = req.params.activityId;
      const originalActivity = await getActivityById(activityId);
      
      const fields = req.body;
        const updatedActivity = await updateActivity({
          id: activityId,
          ...fields,
        })
          
      if (originalActivity) {
          
          console.log(updatedActivity.name, "this is updated activity")
          console.log(originalActivity.name, "this is original activity")
          if  (updatedActivity.name !== originalActivity.name){
            res.send(updatedActivity)
            // next ({
            //   error:"activityAlreadyExistsError",
            //   message:`An activity with name ${originalActivity.name} already exists`,
            //   name: "ActivityExists"
            // })
          }else {
            // res.send(updatedActivity)
            next({
              error:"activityAlreadyExistsError",
              message:`An activity with name ${originalActivity.name} already exists`,
              name: "ActivityExists"
            })
          }
          
//           if (updatedActivity.name !== originalActivity.name){
// console.log(originalActivity.name, " this is activity name")
// console.log(updatedActivity.name, "this is updated name")
            // res.send(updatedActivity);
          // } else {
          //     next ({
          //     error:"activityAlreadyExistsError",
          //     message:`An activity with name ${originalActivity.name} already exists`,
          //     name: "ActivityExists"
          //   })
            

          } 
        
       else {
        next({
          error: "noActivity",
          name: "Does not exist",
          message: `Activity ${activityId} not found`,
        });
      }
    } catch ({ error, name, message }) {
      next({ error, name, message });
    }
  });



module.exports = activitiesRouter;
