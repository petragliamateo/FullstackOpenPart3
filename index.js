require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons');

const app = express()
const date = new Date;

// Middlewares iniciales:
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
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

// Rutas:
app.get('/info', (request, response) => {
  Person.find({}).then((p) => {
    response.send(`
    <div>
      <p>Phonebook has info for ${p.length} people</p>
      <p>${date}</p>
    </div>
    `);
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const newPeople = {
    name: req.body.name,
    number: req.body.number,
  }

  Person.findByIdAndUpdate(req.params.id, newPeople, { new: true })
    .then((updatedPeople) => {
      res.json(updatedPeople)
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response) => {
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({error: 'name or number missing'})
  }
  const people = new Person({
    name: request.body.name,
    number: request.body.number,
  })

  Person.find({ name: people.name })
    .then((p) => {
      if (p.length) {
        return response.status(400).json({error: 'name must be unique'})
      }

      people.save().then((savedPeople) => {
        response.json(savedPeople);
      })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})

// Manejo de errores:
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)
