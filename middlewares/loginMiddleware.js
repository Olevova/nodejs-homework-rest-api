const  User  = require('../models/usersModels');
const { Unauthorized } = require('http-errors');
const jwt = require("jsonwebtoken");

const registerUser = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json({
                message: error.message
            })
        }
        next();
    }
}


const userAuth = async(req, res, next) => {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(" ");
    const { SECRET_KEY } = process.env;

    if (bearer !== "Bearer") {
        return next(Unauthorized("Not authorized"));
    }
    try {
        const { id } = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id)
        if (!user) {
         return next(Unauthorized("Not authorized"));
    }
        req.user = user;
        next()
       
    }
    catch (error) {
        if (error.message === 'invalid signature') {
            res.status(401).json(
                { "message": "Not authorized" }
            )
        }
        next(error)
    }
}

module.exports = {
    userAuth,
    registerUser
}