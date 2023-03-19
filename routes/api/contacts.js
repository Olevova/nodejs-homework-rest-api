const express = require('express');

const { checkUserDate, checkStatusContact } = require('../../middlewares/userMiddlewares');
const {userAuth} = require("../../middlewares/loginMiddleware")
const {userSchema,userUpdateSchema, userUpdateStatusSchema} = require('../../schema/userschema')
const { listContacts, getContactById, addContact, updateContact, removeContact, updateStatus } = require('../../models/contacts');


const router = express.Router();

router
    .route('/')
    .get(userAuth, listContacts)
    .post(userAuth,checkUserDate(userSchema), addContact);

router 
    .route('/:contactId')
    .get(getContactById)
    .put(checkUserDate(userUpdateSchema),updateContact)
    .delete(removeContact);
router
    .route('/:contactId/favorite')
    .patch(checkStatusContact(userUpdateStatusSchema), updateStatus);

module.exports = router
