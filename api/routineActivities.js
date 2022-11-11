const express = require('express');
const routines_activitiesRouter = express.Router();
const {requireUser} = require("./utils")
const {getRoutineActivityById, destroyRoutineActivity, getRoutineById} = require ("../db")

// PATCH /api/routine_activities/:routineActivityId

// DELETE /api/routine_activities/:routineActivityId
routines_activitiesRouter.delete("/:routineActivityId", requireUser, async(req, res, next)=> {
    try {
        const routineActivityId = req.params.routineActivityId;
        console.log(routineActivityId, " routineActivityId")
        const routineActivity = await getRoutineActivityById(routineActivityId);
        console.log(routineActivity.name, "this is routineActivity")
        const routine = await getRoutineById(routineActivity.routineId)
        console.log(routine, " this is routine!")
        if (routineActivity) {
          if (routineActivityId && routine.creatorId === req.user.id) {
            const destroyedRoutineActivity = await destroyRoutineActivity(routineActivityId);
            console.log(destroyedRoutineActivity, 'this is destroyed routine activity')
            res.send(destroyedRoutineActivity);
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
            message: `${routineActivityId} does not exist`,
          });
        }
      } catch ({ error, name, message }) {
        next({ error, name, message });
      }
})


module.exports = routines_activitiesRouter;
