const express = require("express");
const {
  getAllPublicRoutines,
  getRoutineById,
  updateRoutine,
  destroyRoutine,
  getRoutineActivitiesByRoutine,
  addActivityToRoutine,
  getAllRoutines,
  createRoutine,
} = require("../db");
const { requireUser } = require("./utils");
const routinesRouter = express.Router();

// GET /api/routines
routinesRouter.get("/", async (req, res) => {
  const allRoutines = await getAllPublicRoutines();
  res.send(allRoutines);
});

// POST /api/routines
routinesRouter.post("/", requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  const existingRoutine = await getAllRoutines(name);
  try {
    if (existingRoutine.creatorId === req.user.id) {
      next({
        error: "existingRoutineError",
        message: "This routine already exists",
        name: "routineError",
      });
    } else {
      const newRoutine = await createRoutine({
        creatorId: req.user.id,
        isPublic,
        name,
        goal,
      });
      res.send(newRoutine);
    }
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
routinesRouter.post("/:routineId/activities", async (req, res, next) => {
  const originalRoutineId = req.params.routineId;

  const routine = await getRoutineById(originalRoutineId);
  try {
    if (routine) {
      const { routineId, activityId, count, duration } = req.body;
      const routineAct = (
        await getRoutineActivitiesByRoutine({ id: originalRoutineId })
      ).map((element) => element.activityId);

      if (!routineAct.includes(activityId)) {
        const addActivity = await addActivityToRoutine({
          routineId,
          activityId,
          count,
          duration,
        });
        res.send(addActivity);
      } else {
        next({
          error: "ActivityError",
          message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
          name: "Error Activity",
        });
      }
    } else {
      next({
        error: "NotARoutineError",
        message: "This function does not exist",
        name: "NoRoutine",
      });
    }
  } catch ({ error, name, message }) {
    next(error, name, message);
  }
});

module.exports = routinesRouter;
