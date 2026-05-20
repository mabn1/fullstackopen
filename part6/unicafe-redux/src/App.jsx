const App = ({ store }) => {
  const state = store.getState()

  return (
    <div>
      <button onClick={() => store.dispatch({ type: 'GOOD' })}>
        good
      </button>

      <button onClick={() => store.dispatch({ type: 'OK' })}>
        ok
      </button>

      <button onClick={() => store.dispatch({ type: 'BAD' })}>
        bad
      </button>

      <button onClick={() => store.dispatch({ type: 'ZERO' })}>
        reset stats
      </button>

      <div>good {state.good}</div>
      <div>ok {state.ok}</div>
      <div>bad {state.bad}</div>
    </div>
  )
}

export default App