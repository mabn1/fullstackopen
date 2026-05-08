import { useState, useEffect } from 'react'
import countryService from './services/countries'
import CountriesList from './components/CountriesList'
import CountryDetail from './components/CountryDetail'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    countryService.getAll().then(data => setCountries(data))
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const filtered = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div>
        find countries <input value={search} onChange={handleSearchChange} />
      </div>

      {filtered.length > 10 && <p>Too many matches, specify another filter</p>}

      {filtered.length <= 10 && filtered.length > 1 && (
        <CountriesList countries={filtered} />
      )}

      {filtered.length === 1 && (
        <CountryDetail country={filtered[0]} />
      )}
    </div>
  )
}

export default App