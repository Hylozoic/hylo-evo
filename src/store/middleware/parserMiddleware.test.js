import parserMiddleware from './parserMiddleware'
import { data } from './parserMiddleware.test.json'

it('Returns a function to handle next', () => {
  const nextHandler = parserMiddleware({ action: 'ADD_POST' })
  expect(typeof nextHandler).toBe('function')
  expect(nextHandler.length).toBe(1)
})

it('Returns a function to handle action', () => {
  const actionHandler = parserMiddleware({ action: 'ADD_POST' })()
  expect(typeof actionHandler).toBe('function')
  expect(actionHandler.length).toBe(1)
})

it('Returns the value of next', () => {
  const expected = 'Wombat'
  const nextHandler = parserMiddleware({ action: 'ADD_POST' })
  const actionHandler = nextHandler(() => expected)
  const actual = actionHandler()
  expect(actual).toBe(expected)
})

it('Dispatches an ADD_POST action when payload contains a post', () => {
})
