import { useState,useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import Personsform from './components/Personform'
import Persons from './components/Persons'
import personsService from './services/persons'

const App = () => {

  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNum,setNewNum]=useState('')
  const [filter,setFilter]=useState('')
  
  useEffect(()=>{
    personsService
    .getAll()
      .then(initialPersons=>{
        setPersons(initialPersons)
      })

  },[])

  const deletePerson=(id)=>{
    const person=persons.find(p=>p.id===id)
    if(window.confirm(`Delete ${person.name} ?`)){
      //axios.delete(`http://localhost:3001/persons/${id}`)
      personsService
      .remove(id)
        .then(()=>{
          setPersons(persons.filter(p=>p.id!==id))
        })
    }
  }

  const addNote=(event)=>{
    event.preventDefault()

    if(persons.some(person=>person.name===newName)){
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
      personsService
      .update(persons.find(p=>p.name===newName).id,{...persons.find(p=>p.name===newName),number:newNum})
      .then(returnedPerson=>{
        setPersons(persons.map(p=>p.name!==newName ? p : returnedPerson))
        setNewName('')
        setNewNum('')
      })
    }
     // alert(`${newName} is already added to phonebook`)
      return
    }

    const newdetail={
      name:newName,
      number:newNum
    }
    personsService
    .create(newdetail)
      .then(returnedPerson=>{
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNum('')
      })
  }

  const handleNumChange=(event)=>{
      console.log(event.target.value)
      setNewNum(event.target.value)
  }

  const handleNameChange=(event)=>{
      console.log(event.target.value)
      setNewName(event.target.value)
  }
  
  const filterWork=(event)=>{
       setFilter(event.target.value)
  }
  const personToShow=persons.filter(person=>person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
     <div>
        <h2>Phonebook</h2>

          <Filter filter={filter} filterWork={filterWork}/>
    
        <h2>Add a new</h2>
          <Personsform  addNote={addNote}
                        newName={newName}
                        handleNameChange={handleNameChange}
                        newNum={newNum}
                        handleNumChange={handleNumChange} />
       
      <h2>Numbers</h2>
        <Persons persons={personToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App