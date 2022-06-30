const express = require('express')
let persons = require('./db.json')
const app = express()
const date = new Date;

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
  console.log(persons);
})

app.get('/api/persons', (request, response) => {
  response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);
  if (!person) {
    response.status(404).end();
    return;
  }
  response.json(person);
})

app.get('/info', (request, response) => {
  response.send(`
  <div>
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  </div>
  `);
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
