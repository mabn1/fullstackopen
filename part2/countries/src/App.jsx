import { useState, useEffect } from 'react'
import countryService from './services/countries'
import CountriesList from './components/CountriesList'
import CountryDetail from './components/CountryDetail'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countryService.getAll().then(data => setCountries(data))
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const handleShow = (country) => {
    setSelectedCountry(country)
  }

  const filtered = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  const countriesToShow = selectedCountry ? [selectedCountry] : filtered

  return (
    <div>
      <div>
        find countries{' '}
        <input value={search} onChange={handleSearchChange} />
      </div>

      {!selectedCountry && filtered.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}

      {!selectedCountry && filtered.length <= 10 && filtered.length > 1 && (
        <CountriesList countries={filtered} onShow={handleShow} />
      )}

      {countriesToShow.length === 1 && (
        <CountryDetail country={countriesToShow[0]} />
      )}
    </div>
  )
}

export default App