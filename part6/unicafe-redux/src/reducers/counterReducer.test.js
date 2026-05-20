import { describe, test, expect } from 'vitest'
import deepFreeze from 'deep-freeze'
import counterReducer from './counterReducer'

describe('unicafe reducer', () => {

  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('returns proper initial state when state is undefined', () => {
    const state = undefined
    const action = { type: 'DO_NOTHING' }

    const newState = counterReducer(state, action)

    expect(newState).toEqual(initialState)
  })

  test('GOOD is incremented', () => {
    const state = initialState

    const action = { type: 'GOOD' }

    deepFreeze(state)

    const newState = counterReducer(state, action)

    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })

})