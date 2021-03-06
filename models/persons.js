/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// mongoose-unique-validator es un package para validar valores únicos en el esquema.

// Connection
const url = process.env.MONGODB_URI;
console.log('Connecting to DB:', url);
mongoose.connect(url)
  .then(() => {
    console.log('Connected!');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB', error.message);
  });

// Schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  number: {
    type: String,
    required: true,
    minlength: 8,
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

// Se debe agregar el plugin uniqueValidator al esquema:
personSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Person', personSchema);
