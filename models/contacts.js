const { findOneAndUpdate } = require('./contactModels');
const Contact = require('./contactModels');

const listContacts = async (req, res, some) => {
  try {
    const contacts = await Contact.find();
    return res.json(contacts)
  
  } catch (error) {
    console.log(error.message);
  }
};

const addContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(200).json(contact)
    
  } catch (error) {
    console.log(error);
  }
}

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactById = await Contact.findOne({ _id: contactId});
    console.log(contactById);
    if (!contactById) {
      return res.status(404).json({
        message: "Not found"
      })
    }
    return res.status(200).json(contactById)
  } catch (error) {
    console.log(error.message);
    return res.status(404).json(
      {"message": "Not found"}
    )
  }
};


const removeContact = async (req, res, next) => {
  const { contactId } = req.params;
   Contact.findByIdAndRemove({ _id: contactId });
    return res.status(200).json(
    {
      "message": "contact deleted"
    }
  );
};

const updateContact = async (req, res, next) => { 
  const { contactId } = req.params;

  if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "missing fields"
      })
    }
  await Contact.findByIdAndUpdate({ _id: contactId }, req.body, { new: true });
  return res.status(200).json(
   await Contact.findOne({ _id: contactId})
    )

}

const updateStatus = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  const updateFavorite = await Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });
  if (!updateFavorite) {
    res.status(404).json(
      { message: " Not found " }
    )
  }
  return res.status(200).json(
    {
      updateFavorite,
    }
  );
}


  module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatus
  }