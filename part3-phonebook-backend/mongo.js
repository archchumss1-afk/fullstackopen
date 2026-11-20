const mongoose = require('mongoose')
const dns = require('node:dns')

// Optional workaround for networks that fail MongoDB's SRV or TXT lookups.
if (process.env.MONGODB_DNS_SERVERS) {
  dns.setServers(process.env.MONGODB_DNS_SERVERS.split(','))
}

const [password, name, number] = process.argv.slice(2)

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('Usage: node mongo.js <password> ["Full Name" number]')
  process.exit(1)
}

const username = 'archchumss1_db_user'
const host = 'cluster0.ynovzhy.mongodb.net'
const url = `mongodb+srv://${username}:${encodeURIComponent(password)}@${host}/phonebook?retryWrites=true&w=majority&appName=Cluster0`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const main = async () => {
  try {
    await mongoose.connect(url, { serverSelectionTimeoutMS: 15000 })

    if (name !== undefined) {
      await new Person({ name, number }).save()
      console.log(`added ${name} number ${number} to phonebook`)
    } else {
      const persons = await Person.find({})
      console.log('phonebook:')
      persons.forEach(person => console.log(`${person.name} ${person.number}`))
    }
  } catch (error) {
    console.error('Database operation failed.')
    console.error('Error type:', error.name)
    if (error.code !== undefined) console.error('Error code:', error.code)
    if (error.cause?.code !== undefined) console.error('Cause code:', error.cause.code)

    if (/auth|bad credentials/i.test(error.message)) {
      console.error('Atlas rejected the login. Check your database username and current database password.')
    } else if (/ENOTFOUND|ECONNREFUSED|ETIMEOUT|querySrv/i.test(error.message)) {
      console.error('Could not reach MongoDB. Check your internet connection and DNS settings.')
    } else if (error.name === 'MongooseServerSelectionError') {
      console.error('Could not select a database server. Check Atlas Network Access and that the cluster is running.')
    }
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

main().catch(() => {
  console.error('Could not close the database connection.')
  process.exitCode = 1
})
