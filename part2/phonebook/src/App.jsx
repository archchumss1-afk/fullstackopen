import { useState,useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import Personsform from './components/Personform'
import Persons from './components/Persons'

const App = () => {

  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNum,setNewNum]=useState('')
  const [filter,setFilter]=useState('')
  
  useEffect(()=>{
    axios.get('http://localhost:3001/persons')
      .then(response=>{
        setPersons(response.data)
      })

  },[])
  const addNote=(event)=>{
    event.preventDefault()

    if(persons.some(person=>person.name===newName)){
      alert(`${newName} is already added to phonebook`)
      return
    }

    const newdetail={
      name:newName,
      number:newNum,
      id: persons.length + 1
    }

    setPersons(persons.concat(newdetail))
    setNewName('')
    setNewNum('')
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
        <Persons persons={personToShow}/>
    </div>
  )
}

export default App