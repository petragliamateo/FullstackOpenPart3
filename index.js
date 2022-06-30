const express = require('express')
const persons = require('./db.json')
const app = express()

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
  console.log(persons);
})

app.get('/api/persons', (request, response) => {
  response.json(persons);
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
