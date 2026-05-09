import { useEffect, useState } from 'react'
import weatherService from '../services/weather'

const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    weatherService
      .getWeather(
        country.capital[0],
        country.latlng[0],
        country.latlng[1]
      )
      .then(data => setWeather(data))
  }, [country])

  if (!country) return null

  const iconUrl = weather
    ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    : null

  return (
    <div>
      <h2>{country.name.common}</h2>

      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>

      <h3>languages</h3>
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img src={country.flags.png} alt="flag" width="150" />

      {weather && (
        <>
          <h3>Weather in {country.capital[0]}</h3>
          <p>temperature {weather.main.temp} °C</p>
          <img src={iconUrl} alt="weather icon" />
          <p>wind {weather.wind.speed} m/s</p>
        </>
      )}
    </div>
  )
}

export default CountryDetail