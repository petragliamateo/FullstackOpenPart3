const express = require('express')
const persons = require('./db.json')
const app = express()
const date = new Date;

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
  console.log(persons);
})

app.get('/api/persons', (request, response) => {
  response.json(persons);
})

app.get('/info', (request, response) => {
  response.send(`
  <div>
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  </div>
  `);
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
