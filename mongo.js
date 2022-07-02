const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}
if (process.argv.length === 4) {
  console.log('please provide the name and number: node mongo.js <pass> <name> <number>');
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://petragliamateo:${password}@cluster0.ocojbqe.mongodb.net/agenda?retryWrites=true&w=majority`;
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 5) {
  const people = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });
  people.save().then((result) => {
    console.log(`Added ${result.name} number ${result.number} to phonebook!`);
    mongoose.connection.close();
  });
}
if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook:');
    result.forEach((people) => {
      console.log(`${people.name} ${people.number}`);
    });
    mongoose.connection.close();
  });
}
