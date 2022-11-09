/* eslint-disable no-useless-catch */
const client = require('./client');
const { attachActivitiesToRoutines } = require('./')

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
    SELECT *
    FROM routines;
    `)
    const routinesWithActivities = await attachActivitiesToRoutines(routines)
    console.log(routines)
    return routinesWithActivities
  }
catch (error){
  throw error
}
}

async function getAllRoutinesByUser({username}) {
}

async function getPublicRoutinesByUser({username}) {
}

async function getAllPublicRoutines() {

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