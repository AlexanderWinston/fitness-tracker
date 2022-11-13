const express = require("express");
const {
  getAllPublicRoutines,
  createRoutine,
  getUserById,
  getRoutineById,
  updateRoutine,
  destroyRoutine,
  getActivityById,
  attachActivitiesToRoutines,
  getRoutineActivitiesByRoutine,
  addActivityToRoutine
} = require("../db");
const { requireUser } = require("./utils");
const routinesRouter = express.Router();

// GET /api/routines
routinesRouter.get("/", async (req, res) => {
  const allRoutines = await getAllPublicRoutines();
  console.log(allRoutines);
  res.send(allRoutines);
});

// POST /api/routines
routinesRouter.post("/", requireUser, async (req, res, next) => {
  const { creatorId, isPublic, name, goal } = req.body;
  // const routineData = { creatorId, isPublic, name, goal };
  try {
    // const routines = await createRoutine(routineData);
   
    // if (creatorId == req.user.id){
    res.send({
      creatorId: req.user.id,
      isPublic,
      name,
      goal,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/routines/:routineId
routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
  try {
    const routineId = req.params.routineId;
    const originalRoutine = await getRoutineById(routineId);
    if (originalRoutine) {
      if (originalRoutine.creatorId === req.user.id) {
        const fields = req.body;

        const updatedRoutine = await updateRoutine({
          id: routineId,
          ...fields,
        });

        res.send(updatedRoutine);
      } else {
        res.statusCode = 403;
        next({
          error: "403Error",
          name: "UnauthorizedUserError",
          message: `User ${req.user.username} is not allowed to update ${originalRoutine.name}`,
        });
      }
    } else {
      next({
        error: "noRoutine",
        name: "Does not exist",
        message: `${routineId} does not exist`,
      });
    }
  } catch ({ error, name, message }) {
    next({ error, name, message });
  }
});

// DELETE /api/routines/:routineId
routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
  try {
    const routineId = req.params.routineId;
    const routine = await getRoutineById(routineId);
    if (routine) {
      if (routineId && routine.creatorId === req.user.id) {
        const destroyedRoutine = await destroyRoutine(routineId);
		
        res.send(destroyedRoutine);
      } else {
        res.statusCode = 403;
        next({
          error: "deleteError",
          name: "not authorized user",
          message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
        });
      }
    } else {
      next({
        error: "noRoutineError",
        name: "Does not exist",
        message: `${routineId} does not exist`,
      });
    }
  } catch ({ error, name, message }) {
    next({ error, name, message });
  }
});

// POST /api/routines/:routineId/activities
routinesRouter.post('/:routineId/activities', async(req, res, next)=> {
	
  const originalRoutineId = req.params.routineId
  
  // const { id, creatorId, isPublic, name, goal} = req.body;
  
  // const activityData = {id, name, description};
  // console.log(activityData)
const routine = await getRoutineById(originalRoutineId)
console.log(routine, "this is routine")
try {
  
  if (routine){
    console.log(routine)
    const {routineId, activityId, count, duration} = req.body
    const routineAct =  (await getRoutineActivitiesByRoutine({id: originalRoutineId})).map(element => element.activityId)


    console.log(routineAct.includes(activityId),"this is routineAct with activity id" )
    console.log(getRoutineActivitiesByRoutine, "line 123")
    console.log(routineAct, "this is routine activities line 119")
      if(!routineAct.includes(activityId)){ 
        console.log("it works!")
        console.log(activityId, "activityId")
        const addActivity = await addActivityToRoutine({routineId, activityId, count, duration})
        console.log(addActivityToRoutine, "line 131")
        console.log(addActivity, "this is line 132")
        res.send(addActivity)
      }else {
        next({
          error:"ActivityError",
          message:`Activity ID ${activityId} already exists in Routine ID ${routineId}`,
          name:"Error Activity"
        })

      }

    } else {
      next({
        error: "NotARoutineError",
        message: "This function does not exist",
        name: "NoRoutine"
        
      })
    }
    
  } catch ({ error, name, message }) {
    next(error, name, message);
  }
})


module.exports = routinesRouter;
