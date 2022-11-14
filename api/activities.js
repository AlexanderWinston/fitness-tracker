const express = require("express");
const {
  getAllActivities,
  createActivity,
  getActivityByName,
  getPublicRoutinesByActivity,
  getActivityById,
  updateActivity,
} = require("../db");
const { requireUser } = require("./utils");
const activitiesRouter = express.Router();

// GET /api/activities/:activityId/routines
activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  try {
    const activityId = req.params.activityId;
    const activity = await getActivityById(activityId);
    if (!activity) {
      next({
        message: `Activity ${activityId} not found`,
        error: "noActivityError",
        name: "noActivity",
      });
    } else {
      const publicRoutinesByActivity = await getPublicRoutinesByActivity(
        activity
      );
      res.send(publicRoutinesByActivity);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/activities
activitiesRouter.get("/", async (req, res) => {
  const activities = await getAllActivities();
  res.send(activities);
});

// POST /api/activities
activitiesRouter.post("/", requireUser, async (req, res, next) => {
  const { id, name, description } = req.body;
  try {
    const alreadyMadeActivity = await getActivityByName(name);
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
activitiesRouter.patch("/:activityId", requireUser, async (req, res, next) => {
  //need to troubleshoot error if updated name = original name
  try {
    const activityId = req.params.activityId;
    const originalActivity = await getActivityById(activityId);

   
    // );
    // console.log(allActivities, "this is allActivities");
    if (originalActivity) {
      const {name, description} = req.body;
      const allActivities = (await getAllActivities()).map(
        (element) => element.name)
      
      // console.log(updatedActivity, "this is updatedActivity");
      if (!allActivities.includes(name)) {
      //   console.log(allActivities, "This is allActivities");
      //   console.log(
      //     allActivities.includes(
      //       updatedActivity.name,
      //       "this is allActivities & more"
      //     )
      //   );
      // const activity = await getActivityByName(name)

      // if (!activity){
      const updatedActivity = await updateActivity({
        id: activityId, name, description
      });
        res.send(updatedActivity);
      } else {
        next({
          error: "activityAlreadyExistsError",
          message: `An activity with name ${name} already exists`,
          name: "ActivityExists",
        });
        // next({
        //   error:"activityAlreadyExistsError",
        //   message:`An activity with name ${originalActivity.name} already exists`,
        //   name: "ActivityExists"
        // })
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
    } else {
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
