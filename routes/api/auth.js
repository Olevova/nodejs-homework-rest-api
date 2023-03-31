const express = require('express');
const { userRegistretion ,newVerify, userLogin ,getCurrent, userLogout, renewalAvatar} = require('../../models/users');
const {userAuth, registerUser,veryfyEmail, upload} = require('../../middlewares/loginMiddleware')

const { authSchema } = require('../../schema/userschema');
const router = express.Router();

router.post('/register', registerUser(authSchema), userRegistretion);
router.post('/login', userLogin);
router.post('/logout', userAuth, userLogout);
router.post('/current', userAuth, getCurrent);
router.patch('/avatars', userAuth, upload.single('avatar'), renewalAvatar )
router.get('/verify/:verificationToken', veryfyEmail);
router.post('/verify', newVerify);
module.exports = router;