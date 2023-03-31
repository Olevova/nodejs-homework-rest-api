const User = require('./usersModels');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { Conflict, Unauthorized } = require('http-errors');
const gravatar = require('gravatar');
const {v4: uuidv4} = require('uuid');
const path = require('path');
const fs = require('fs').promises;
const Jimp = require('jimp');
const sendMail = require('../helper/sendMail');
const { log } = require('console');


const{SECRET_KEY} = process.env
const resizeImg = async (pathfile) => {
    await Jimp.read(pathfile).then((image) => {
        return image
            .resize(256, 256) // resize
            .write(pathfile); // save
    })
        .catch((err) => {
            console.error(err, 123333);
        });
}

const userRegistretion = async (req, res, next) => {
    const { password, email, subscription } = req.body;
    const user = await User.findOne({ email });
    const verificationToken = uuidv4();
    console.log(user);
    if (user) {
        return next(Conflict(`"message": "${email} in use"`))
    }
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const avatar = gravatar.url(email, {
        s: 250,
        r: 'pg'
    });
    const newUser = await User.create({ password: hashPassword, email, subscription, avatarURL: avatar, verificationToken})
    const mail = {
        to: email,
        subject: "confir you email",
        html: `<a href='http://localhost:3030/api/users/verify/${verificationToken}'> confirm your mail</a>`
    };
    await sendMail(mail)
    
    return res.status(201).json(
        {
            "user": {
                "email": newUser.email,
                "subscription": newUser.subscription,
                "avatarURL": newUser.avatarURL
            }
        })
};

const userLogin = async (req, res, next) => {
    const { password, email, subscription, verificationToken } = req.body;
    console.log(verificationToken);
    if (!password || !email) {
        return next(Unauthorized("message : Email or password is wrong or you not verify"));
    };
    const user = await User.findOne({ email });
    const userPassword = bcrypt.compareSync(password.toString(), user.password);
    console.log(verificationToken);

    if (!user || user.verificationToken || !userPassword) {
        return next(Unauthorized("message : Email or password is wrong or you not verify"));
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

const renewalAvatar = async (req, res, next) => {
    const { path: filePath, originalname } = req.file;
    console.log(req.file);
    await resizeImg(filePath);
    try {
        const publicDir = path.join(__dirname, '../', 'public', 'avatars', originalname);
        console.log(publicDir);
        await fs.rename(filePath, publicDir);
        
        const avatarURL = path.join('public', 'avatars', originalname);
        await User.findByIdAndUpdate(req.user._id, { avatarURL });

        res.status(200).json({
            avatarURL
        })
    } catch (error) {
        await fs.unlink(filePath);
        res.status(401).json({ "message": "Not authorized" })
        
    }
};

const newVerify = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        res.status(400).json({
            "message": "missing required field email"
        })
    }
    if (!user.verify) {
        const mail = {
            to: email,
            subject: "retry confir you email",
            html: `<a href='http://localhost:3030/api/users/verify/${user.verificationToken}'> confirm your mail</a>`
        };
        await sendMail(mail);
        return res.status(201).json(
        {
  "message": "Verification email sent"
})
    }
    res.status(400).json({
    message: "Verification has already been passed"
})

};

module.exports = {
    userRegistretion,
    userLogin,
    getCurrent,
    userLogout,
    renewalAvatar,
    newVerify,
}