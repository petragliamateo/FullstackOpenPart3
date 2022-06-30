const express = require('express')
let persons = require('./db.json')
const app = express()
const date = new Date;

app.use(express.json())

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

app.post('/api/persons', (request, response) => {
  console.log(request.body);
  if (!request.body.name) {
    return response.status(400).json({error: 'name missing'})
  }
  const person = {
    name: request.body.name,
    number: request.body.number,
    id: Math.floor(Math.random() * 10000)
  }
  persons = persons.concat(person);
  response.json(persons);
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
