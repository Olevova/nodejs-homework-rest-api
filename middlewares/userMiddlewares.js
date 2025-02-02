const checkUserDate = (schema) => {
    return (req, res, next) => {
      const { error } = schema.validate(req.body);
      console.log( req.body);
        if (error) {
            const field = error.message.split('"')[1];
            const message = `missing required ${field} field`;
            res.status(400).json({
                message,})
            next(error);
            return
        }
        next();
    }
}

const checkStatusContact = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({
        "message":"missing field favorite"
      })
      next(error);  
    }
    next();
  };
};

module.exports = {
    checkUserDate,
    checkStatusContact
}