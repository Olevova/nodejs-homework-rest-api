const express = require('express');
const { userRegistretion , userLogin ,getCurrent, userLogout, renewalAvatar} = require('../../models/users');
const {userAuth, registerUser, upload} = require('../../middlewares/loginMiddleware')

const { authSchema } = require('../../schema/userschema');
const router = express.Router();

router.post('/register', registerUser(authSchema), userRegistretion);
router.post('/login', userLogin);
router.post('/logout', userAuth, userLogout);
router.post('/current', userAuth, getCurrent);
router.patch('/avatars', userAuth, upload.single('avatar'), renewalAvatar )

module.exports = router;