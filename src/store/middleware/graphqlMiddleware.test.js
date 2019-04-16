import graphqlMiddleware from 'store/middleware/graphqlMiddleware'

describe('graphqlMiddleware', () => {
  let next, middleware

  const expectMetaThenToReject = (shouldReject, action) =>
    middleware(next)(action)
      .then(({ meta }) => {
        expect(next).toHaveBeenCalled()
        const then = meta.then
        let rejected = false
        return Promise.resolve(action.payload)
          .then(then)
          .then(result => result, reject => { rejected = true })
          .then(() => {
            expect(rejected).toEqual(shouldReject)
          })
      })

  beforeEach(() => {
    middleware = graphqlMiddleware({})
    next = jest.fn(val => Promise.resolve(val))
  })

  it('adds a then that rejects when there are errors', () => {
    const action = {
      type: 'FOO',
      graphql: true,
      payload: {
        errors: [{ message: 'problems' }]
      }
    }
    return expectMetaThenToReject(true, action)
  })

  it('adds a then that passes through the payload when there are no errors', () => {
    const action = {
      type: 'FOO',
      graphql: true,
      payload: {
        data: 'no problems'
      }
    }
    return expectMetaThenToReject(false, action)
  })
})
