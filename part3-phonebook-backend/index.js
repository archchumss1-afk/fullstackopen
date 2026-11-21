require('dotenv').config()
const Person =require('./models/person')

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app =express()

app.use(cors())
app.use(express.json())

app.use(express.static('dist'))

morgan.token('body',(request,response)=>{
    if(request.method === 'POST'){
        return JSON.stringify(request.body)
    }
    return ''
})
app.use(morgan(':method :url :status :res[content-Length] - :response-time ms :body'))


app.get('/api/persons', (request, response,next)=>{
    Person.find({})
    .then(persons => {
        response.json(persons)
    })
    .catch(error => next(error))
})
 

app.get('/info',(request, response,next) =>{
    const date = new Date()
    Person.countDocuments({})
    .then(count => {
        response.send(
            `<p>Phonebook has info for ${count} people</p>
            <p>${date}</p>`
        )
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id',(request,response,next)=>{
   Person.findById(request.params.id)
   .then(person => {
     if(!person) {
        return response.status(404).end()
     }
     response.json(person)
   })
   .catch(error => next(error))
    
})

app.get('/', (request, response) => {
  response.send('<h1>Welcome to the Phonebook Backend!</h1>')
})

app.delete('/api/persons/:id',(request, response,next) =>{
    Person.findByIdAndDelete(request.params.id)
    .then(()=>{
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons',(request, response,next) =>{
    const body =request.body
    if(!body.name || !body.number){
        return response.status(400).json({
            error : 'name or number is missing'
        })
    }

   const person =new Person({
    name: body.name,
    number: body.number,
   })

   person.save()
   .then(savedPerson => {
    response.json(savedPerson)
   })
   .catch(error =>next(error))
})

app.put('/api/persons/:id',(request,response,next)=>{
    const body =request.body

    Person.findById(request.params.id)
    .then(person =>{
        if(!person){
            return response.status(404).end()
        }
        person.number = body.number

        return person.save().then(updatedPerson =>{
            response.json(updatedPerson)
        })
    })
    .catch(error =>next(error))
})

const errorHandler = (error, request, response, next) =>{
    console.error(error.name)

    if(error.name === 'CastError') {
        return response.status(400).json({
            error: 'Invalid contact ID',
        })
    }
    if(error.name === 'ValidationError'){
        return response.status(400).json({
            error:error.message,
        })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)

})