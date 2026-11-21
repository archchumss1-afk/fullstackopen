const mongoose =require('mongoose')
const dns= require('dns')

if (process.env.MONGODB_DNS_SERVERS){
  dns.setServers(process.env.MONGODB_DNS_SERVERS.split(','))
}

const url= process.env.MONGODB_URI

mongoose.connect(url,{ family:4 })
  .then(() => {
    console.log('Connected to Mongodb')
  })
  .catch(error => {
    console.log('MongoDB connection failed: ', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required : true,
    minlength: 3,
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: value => /^\d{2,3}-\d+$/.test(value),
      message: 'Phone number must have 2 or 3 digits, a hyphen, then digits',
    }
  },
})

personSchema.set('toJSON' ,{
  transform: (document, returnedObject) => {
    returnedObject.id=returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person',personSchema)

