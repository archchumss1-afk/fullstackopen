
const Personform=({  addNote,
  newName,
  handleNameChange,
  newNum,
  handleNumChange
})=>{
    return(
    <form onSubmit={addNote}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNum} onChange={handleNumChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}
export default Personform