/* eslint-disable no-useless-catch */
const client = require('./client')

async function getRoutineActivityById(id){
  try {
    const { rows: [routineActivity] } = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE id=$1;
    `,[id])
    return routineActivity
  } catch(error){
    throw error
  }
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const { rows: [activity] } = 
    await client.query(`
    INSERT INTO routine_activities("routineId", "activityId", count, duration)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT ("routineId", "activityId") DO NOTHING
    RETURNING *;
    `, [routineId, activityId, count, duration])
    
    return activity
  } catch (error) {
    throw error;
  }
    
}

async function getRoutineActivitiesByRoutine({id}) {
  // console.log({id})
  try {
    const { rows } = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE "routineId"=$1;
    `, [id])
    console.log(rows,"!!!!")
    return rows
  } catch(error){
    throw error
  }
  
}

async function updateRoutineActivity ({id, ...fields}) {

  const setString = Object.keys(fields).map(
    ((key, index) => `"${key}"=$${index + 1}`)
  ).join(', ')

  try {
    if (setString.length > 0) {
      await client.query(`
      UPDATE routine_activities
      SET ${setString}
      WHERE id = ${id}
      RETURNING *;
      `, Object.values(fields));
    
    return await getRoutineActivityById(id);}
  } catch(error){
    throw error
  }
}

async function destroyRoutineActivity(id) {
  try{
   const {
    rows:[routineActivityDestroy]
   } = await client.query(`
    DELETE FROM routine_activities
    WHERE id = $1
    RETURNING *;
    `, [id])
   console.log(routineActivityDestroy)
   return routineActivityDestroy
    
  } catch(error){
    throw error
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
