const express = require("express");
const routines_activitiesRouter = express.Router();
const { requireUser } = require("./utils");
const {
  getRoutineActivityById,
  destroyRoutineActivity,
  getRoutineById,
  updateRoutineActivity,
} = require("../db");

// PATCH /api/routine_activities/:routineActivityId
routines_activitiesRouter.patch(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    try {
      const routineActivityId = req.params.routineActivityId;

      const originalRoutineActivity = await getRoutineActivityById(
        routineActivityId
      );

      const routine = await getRoutineById(originalRoutineActivity.routineId);
      const fields = req.body;

      if (originalRoutineActivity) {
        if (routine.creatorId === req.user.id) {
          const updatedRoutineActivity = await updateRoutineActivity({
            id: routineActivityId,
            ...fields,
          });

          res.send(updatedRoutineActivity);
        } else {
          res.statusCode = 403;
          next({
            error: "403Error",
            name: "UnauthorizedUserError",
            message: `User ${req.user.username} is not allowed to update ${routine.name}`,
          });
        }
      } else {
        next({
          error: "noRoutine",
          name: "Does not exist",
          message: `${routineActivityId} does not exist`,
        });
      }
    } catch ({ error, name, message }) {
      next({ error, name, message });
    }
  }
);

// DELETE /api/routine_activities/:routineActivityId
routines_activitiesRouter.delete(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    try {
      const routineActivityId = req.params.routineActivityId;

      const routineActivity = await getRoutineActivityById(routineActivityId);

      const routine = await getRoutineById(routineActivity.routineId);

      if (routineActivity) {
        if (routineActivityId && routine.creatorId === req.user.id) {
          const destroyedRoutineActivity = await destroyRoutineActivity(
            routineActivityId
          );

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
  }
);

module.exports = routines_activitiesRouter;
