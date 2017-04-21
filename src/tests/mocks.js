// call store.transformAction(action.type, callback) in test setup if you want
// store.dispatch(action) to return a specific value
export const mockReduxStore = function (state) {
  let dispatched = []
  let actionTransforms = {}

  return {
    subscribe: jest.fn(() => {}),
    getState: () => ({...state}),
    dispatched,
    dispatch: jest.fn(action => {
      dispatched.push(action)
      const callback = actionTransforms[action.type]
      return callback ? callback(action) : action
    }),
    transformAction: (actionType, response) => {
      actionTransforms[actionType] = response
    }
  }
}
