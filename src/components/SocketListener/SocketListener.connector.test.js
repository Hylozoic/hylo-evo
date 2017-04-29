import { mapDispatchToProps } from './SocketListener.connector'

// just a placeholder for a real test
it('returns the expected value', () => {
  const dispatch = jest.fn()
  const props = {}
  expect(mapDispatchToProps(dispatch, props)).toMatchSnapshot()
})
