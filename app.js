const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
console.log(process.env.DB_HOST);
const authRouter = require('./routes/api/auth');
const contactsRouter = require('./routes/api/contacts');


const app = express();
  const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

  app.use(logger(formatsLogger));
  app.use(cors());
  app.use(express.json());

  app.use(express.static('public'));

  app.use('/api/users', authRouter)
  app.use('/api/contacts', contactsRouter);
  console.log("ok");
  try {
  mongoose.connect(process.env.DB_HOST);
    console.log("Connect!!!!!");
   module.exports = app.listen(process.env.PORT || 4040, () => {
      console.log(`Server running. Use our API on port: ${process.env.PORT}`)
    }); 
  } catch (error) {
    console.log(error.message);
  }
  app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

  app.use((err, req, res, next) => {
  const{message, statusCode = 500} = err
  res.status(statusCode).json({ message: message})
  })



// const startConnection = () => {
//   const app = express();
//   const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

//   app.use(logger(formatsLogger));
//   app.use(cors());
//   app.use(express.json());

//   app.use(express.static('public'));

//   app.use('/api/users', authRouter)
//   app.use('/api/contacts', contactsRouter);
//   console.log("ok");
//   try {
//     mongoose.connect(process.env.DB_HOST);
//     console.log("Connect!!!!!");
//     app.listen(process.env.PORT || 4040, () => {
//       console.log(`Server running. Use our API on port: ${process.env.PORT}`)
//     }); 
//   } catch (error) {
//     console.log(error.message);
//   }
//   app.use((req, res) => {
//   res.status(404).json({ message: 'Not found' })
// })

//   app.use((err, req, res, next) => {
//   const{message, statusCode = 500} = err
//   res.status(statusCode).json({ message: message})
// })
// }

// startConnection();

// module.exports = {
//   startConnection
// }
