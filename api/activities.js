const express = require("express");
const {
  getAllActivities,
  createActivity,
  getActivityByName,
} = require("../db");
const { requireUser } = require("./utils");
const activitiesRouter = express.Router();
// GET /api/activities/:activityId/routines
// activitiesRouter.get('/', async (res, next) => {
// 	const
// })

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

module.exports = activitiesRouter;
