const express = require("express");
const {
  getAllPublicRoutines,
  createRoutine,
  getUserById,
  getRoutineById,
  updateRoutine,
  destroyRoutine,
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
  const routineData = { creatorId, isPublic, name, goal };
  try {
    const routines = await createRoutine(routineData);
    console.log(routines);
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
		console.log(destroyedRoutine, 'this is destroy routine')
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

module.exports = routinesRouter;
