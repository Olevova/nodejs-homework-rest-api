const User = require('./usersModels');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { Conflict, Unauthorized } =  require('http-errors');

const{SECRET_KEY} = process.env

const userRegistretion = async (req, res, next) => {
    const { password, email, subscription } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    if (user) {
        return next(Conflict(`"message": "${email} in use"`))
    }
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const newUser = await User.create({ password: hashPassword, email, subscription })
    return res.status(201).json(
        {
            "user": {
                "email": newUser.email,
                "subscription": newUser.subscription
            }
        })
};

const userLogin = async (req, res, next) => {
    const { password, email, subscription } = req.body;
    if (!password || !email) {
        return next(Unauthorized("message : Email or password is wrong"));
    };
    const user = await User.findOne({ email });
    const userPassword = bcrypt.compareSync(password.toString(), user.password);
    console.log(userPassword);
    if (!user || !userPassword) {
        return next(Unauthorized("message : Email or password is wrong"));
    };
    const payload = {
        id: user._id
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    await User.findByIdAndUpdate(user._id, { token });
    res.status(200).json({
        token,
        user: {
            email,
            "subscription": user.subscription
        }
    })
};

const getCurrent = async (req, res, next) => {
    const { subscription, email } = req.user;
     res.status(200).json({
            email,
            subscription
        })
}

const userLogout = async (req, res, next) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { token: null });
        res.status(204).json({});

    } catch (error) {
         res.status(401).json({
            "message": "Not authorized"
        })
    }
}

module.exports = {
    userRegistretion,
    userLogin,
    getCurrent,
    userLogout
}