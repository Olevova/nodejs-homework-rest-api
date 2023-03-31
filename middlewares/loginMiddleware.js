const  User  = require('../models/usersModels');
const { Unauthorized } = require('http-errors');
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
const {v4: uuidv4} = require('uuid');
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

const veryfyEmail = async (req, res, next) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        res.status(404).json(
            {
                message: 'User not found'
            }
        )
    };
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });
    res.status(200).json({
        message: 'Verification successful',
    })
};


const upload = multer(
    {
        storage: storage,
    }
)

module.exports = {
    userAuth,
    registerUser,
    veryfyEmail,
    upload
}

