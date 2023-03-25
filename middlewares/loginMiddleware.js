const  User  = require('../models/usersModels');
const { Unauthorized } = require('http-errors');
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
// const fs = require('fs').promises;

const tmpDir = path.join(__dirname, '../', "tmp");


const registerUser = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json({
                message: error.message
                
            })
           next(error);
            return
        }
        next();
    }
}


const userAuth = async (req, res, next) => {
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
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        cb(null, tmpDir);
    },
    filename: (req, file, cb) => {
        console.log(file.originalname);
        cb(null, file.originalname);
    },
    limits: {
        fileSize: 2048,
    }
});

const upload = multer(
    {
        storage: storage,
    }
)

module.exports = {
    userAuth,
    registerUser,
    upload
}