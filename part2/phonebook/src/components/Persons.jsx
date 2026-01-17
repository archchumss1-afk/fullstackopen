import Person from './Person'
const Persons=({persons,deletePerson})=>{
    return(
      <div>
        {persons.map(person =>
         <Person
          key={person.id}
          name={person.name}
          number={person.number}
          onDelete={()=>deletePerson(person.id)}
        />
        )}
     </div>
    )

}
export default Persons