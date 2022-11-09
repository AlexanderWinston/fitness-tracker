/* eslint-disable no-useless-catch */
const client = require('./client');
const { attachActivitiesToRoutines } = require('./activities')
const { getUserByUsername } = require('./users')

async function getRoutineById(id){
  try {
    const { rows: [routine]} = await client.query(`
    SELECT *
    FROM routines
    WHERE id=$1;`,[id])
    return routine;
  } catch(error){
    throw error
  }
}

async function getRoutinesWithoutActivities(){
  try {
    const { rows } = await client.query(`
    SELECT *
    FROM routines;
    `)
    return rows
  } catch(error){
    throw error
  }
  
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines."isPublic", routines."creatorId", routines.goal, routines.name, routines.id, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id; 
   `)
    // console.log(routines, 'this is routines')
    const result = await attachActivitiesToRoutines(routines)
    // console.log(result, 'this is result')
    return result
  }
catch (error){
  throw error
}
}

async function getAllRoutinesByUser({username}) {
  try{
    const user = await getUserByUsername(username)

    const {rows: routineId } = await client.query(`
    SELECT routines."isPublic", routines."creatorId", routines.goal, routines.name, routines.id, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE routines."creatorId"=$1;
    `,[user.id])
    const result = await attachActivitiesToRoutines(routineId)
    return result
  } catch(error){
    throw error
  }
}

async function getPublicRoutinesByUser({username}) {
  try{
    const user = await getUserByUsername(username)

    const {rows: publicRoutine } = await client.query(`
    SELECT routines."isPublic", routines."creatorId", routines.goal, routines.name, routines.id, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE routines."creatorId"=$1
    AND "isPublic"=true;
    `,[user.id])
    const result = await attachActivitiesToRoutines(publicRoutine)
    return result
  } catch(error){
    throw error
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: publicRoutines} = await client.query(`
    SELECT routines."isPublic", routines."creatorId", routines.goal, routines.name, routines.id, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE "isPublic" = true;
    `)
    const result = await attachActivitiesToRoutines(publicRoutines)
    console.log(publicRoutines,'this is publicRoutines')
    return result
  } catch(error){
    throw error
  }

}

async function getPublicRoutinesByActivity({id}) {
}

async function createRoutine({creatorId, isPublic, name, goal}) {
  try {
  const { rows: [routine]} = await client.query(`
  INSERT INTO routines("creatorId", "isPublic", name, goal)
  VALUES ($1,$2, $3, $4)
  RETURNING *;

  `,[creatorId, isPublic, name, goal])
  return routine
  } catch(error){
    throw error
  }
}


async function updateRoutine({id, ...fields}) {
}

async function destroyRoutine(id) {
  try{
    const {
     rows:[routineDestroy]
    } = await client.query(`
     DELETE FROM routines
     WHERE id = $1;
     `, [id])
     
    
    return routineDestroy
     
   } catch(error){
     throw error
   }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
}