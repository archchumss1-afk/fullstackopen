import { useState, useEffect } from 'react'
import axios from 'axios'

const App =() =>{
  const [search , setSearch]= useState('')
  const [allCountries, setAllCountries] = useState([])
  const [weather,setWeather] =useState(null)

  useEffect(()=>{
    console.log('effect')
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
         .then(response =>{
            console.log(response.data)
            setAllCountries(response.data)
         })
  }, [])


  const handleSearchChange =(event) =>{
    setSearch(event.target.value)
  }
  const countriesToShow = allCountries.filter(country => {
    if(country.name && country.name.common){
      return country.name.common.toLowerCase().includes(search.toLowerCase())
    }
    return false
  })


  useEffect(()=>{
    if(countriesToShow.length===1){
      const country =countriesToShow[0]
      const capital =country.capital ? country.capital[0] : null
      const apiKey=import.meta.env.VITE_WEATHER_API_KEY
      
      if(capital && apiKey){
          console.log('Fetching weather data for', capital)
          axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
          )
          .then(response =>{
            console.log('Weather data:', response.data)
            setWeather(response.data)

          })
          .catch(error =>{
            console.error('Error fetching weather data:', error)
          
          })
      }
    }else{
        setWeather(null)
      }
      
    },[search])

  const renderContent = () => {
    if(search === ''){
      return <p>Please enter a search term</p>
    }
    if (countriesToShow.length >10){
      return <p>Too many matches, please be more specific</p>
    }
    if(countriesToShow.length === 1){
      const country= countriesToShow[0]
      const capital =country.capital ? country.capital[0] : null

      
      return(
        <div>
          <h2>{country.name.common}</h2>
          <p>Capital: {country.capital ? country.capital : 'N/A'}</p>
          <p>Area: {country.area ? country.area : 'N/A'}</p>

          <div style={{ display: 'inline-block', textAlign: 'left', margin: 0, paddingLeft: '1.2em' }}>
            <h3 style={{ margin: '0 0 0.5rem' }}>Languages:</h3>
            <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
              {country.languages ? Object.values(country.languages).map((language,index) =>(
                <li key={index}>{language}</li>

              )): <li>No language data available</li>}
            </ul>
            {country.flags && country.flags.png ? (
              <img src={country.flags.png} alt={`Flag of ${country.name.common}`} style={{ display: 'block', width: '150px', border: '1px solid #ccc', marginTop: '10px' }} />
            ) : (
              <p>Flag not available</p>
            )}
          </div>
        

          {weather && (
            <div>
              <h3>Weather in {capital}</h3>
              <p>Temperature: {weather.main.temp} °C</p>

              <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={`Weather icon for ${weather.weather[0].description}`} />
              <p>Wind Speed: {weather.wind.speed} m/s</p>
            </div>
          )}
        </div>
      )
    }

    if(countriesToShow.length>1 && countriesToShow.length<=10){
      return(
        <ul>
          {countriesToShow.map(country =>(
            <li key={country.cca3 || country.name.common}>
              {country.name.common}
              <button onClick={()=>{
                setSearch(country.name.common)
              }}>show</button>
            

          
            </li>
            
          ))}
        </ul>
      )
    }
  }

  return(
    <div style={{padding: '20px'}}>
       Find Countries: <input value={search} onChange={handleSearchChange} />
       <p>Current search: {search}</p>
       {renderContent()}
    </div>
  )
}
export default App