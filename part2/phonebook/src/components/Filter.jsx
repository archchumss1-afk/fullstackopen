const Filter=({filter,filterWork})=>{
    return(
     <div>
        filterwithshown<input  value={filter} onChange={filterWork}/>
      </div>
    )
}
export default Filter