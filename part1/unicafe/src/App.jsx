import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)
const StatisticsLine = ({ texto, valor }) =>(
  <tr>
    <td>{texto}</td>
    <td>{valor}</td>
  </tr>
) 

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad
  const average = (good - bad) / total
  const positive = (good / total) * 100
  if (good === 0 && neutral === 0 && bad === 0) {
    return <p>No feedback given</p>
  }

  return (
    <div>
      <h1>statistics</h1>      
        <StatisticsLine texto="good" valor={good} />
        <StatisticsLine texto="neutral" valor={neutral} />
        <StatisticsLine texto="bad" valor={bad} />
        <StatisticsLine texto="all" valor={total} />
        <StatisticsLine texto="average" valor={average} />
        <StatisticsLine texto="positive" valor={positive + " %"} />
    </div>
  )
}

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
  }

  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
  }

  const handleBadClick = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodClick} text='good' />
      <Button handleClick={handleNeutralClick} text='neutral' />
      <Button handleClick={handleBadClick} text='bad' />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App