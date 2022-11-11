function requireUser(req, res, next) {
    if (!req.user) {
        res.statusCode = 401
        res.send({
            error: "UserError",
            name:"Unauthorized User Error",
            message:"You must be logged in to perform this action"
        })
    }

    next();
}
module.exports={requireUser}