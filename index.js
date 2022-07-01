const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

let persons = require('./db.json')
const app = express()
const date = new Date;

app.use(express.json())
app.use(cors())
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(morgan((tokens, req, res) => {
  return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body),
    ].join(' ')
}))

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
  const unique = persons.find((p) => p.name === request.body.name);

  if (!request.body.name || !request.body.number) {
    return response.status(400).json({error: 'name or number missing'})
  }
  if (unique) {
    return response.status(400).json({error: 'name must be unique'})
  }

  const person = {
    name: request.body.name,
    number: request.body.number,
    id: Math.floor(Math.random() * 10000)
  }
  persons = persons.concat(person);
  response.json(persons);
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
