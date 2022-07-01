const mongoose = require('mongoose');

console.log('Connecting to DB');
mongoose.connect(process.env.MONGODB_URI)
  .then((result) => {
    console.log('Connected!');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB', error.message);
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})

module.exports = mongoose.model('Person', personSchema);
