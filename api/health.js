const express = require('express');
const healthRouter = express.Router();

healthRouter.get('/health', async (req,res)=>{
    return "All is well"
})



module.exports= healthRouter