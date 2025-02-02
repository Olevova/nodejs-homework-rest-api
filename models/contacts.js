// const { findOneAndUpdate } = require('./contactModels');
const Contact = require('./contactModels');

const listContacts = async (req, res, some) => {
  try {
    const { _id } = req.user;
    console.log(req.query);
    const { page, limit, favorite = false } = req.query;
    const skip = (page - 1) * limit;
    const contacts = await Contact.find({owner:_id, favorite},"", {skip, limit:+limit}).populate("owner", "email subscription")
    return res.json(contacts)
  
  } catch (error) {
    console.log(error.message);
  }
};

const addContact = async (req, res, next) => {
  try {
    const {_id} = req.user;
    const contact = await Contact.create({ ...req.body, owner: _id });
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
   const contact = await Contact.findByIdAndRemove({ _id: contactId });
  if (!contact) {
    return res.status(404).json({
      "message": "contact not found"
    })
  }  
  
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
  const contact = await Contact.findByIdAndUpdate({ _id: contactId }, req.body, { new: true });
  if (!contact) {
    return res.status(404).json({
      "message": "contact not found"
    })
  };

  return res.status(200).json(
   await Contact.findOne({ _id: contactId})
    )

}

const updateStatus = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const updateFavorite = await Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });
  if (!updateFavorite) {
      return res.status(404).json(
        { "message": " Not found " }
      )
    };
  
    return res.status(200).json(updateFavorite);
}


  module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatus
  }