import extractModelMiddleware from './extractModel'
import { EXTRACT_MODEL } from 'store/constants'
import { get } from 'lodash/fp'

var next, store, middleware

beforeEach(() => {
  store = {dispatch: jest.fn()}
  next = jest.fn()
  middleware = extractModelMiddleware(store)(next)
})

it('ignores an action without meta.extractModel', () => {
  const action = {type: 'FOO'}
  middleware(action)
  expect(next).toBeCalledWith(action)
  expect(store.dispatch).not.toBeCalled()
})

it('ignores promise actions', () => {
  const action = {
    type: 'FOO',
    payload: new Promise(() => {}),
    meta: {
      extractModel: 'Post'
    }
  }

  middleware(action)
  expect(next).toBeCalledWith(action)
  expect(store.dispatch).not.toBeCalled()
})

it('transforms an action with a string meta.extractModel', () => {
  const action = {
    type: 'FOO',
    payload: {
      data: {
        post: postData
      }
    },
    meta: {
      extractModel: 'Post'
    }
  }

  middleware(action)
  expect(next).toBeCalledWith(action)
  expect(store.dispatch).toBeCalledWith({
    type: EXTRACT_MODEL,
    payload: postData,
    meta: {modelName: 'Post'}
  })
})

it('transforms an action with an object meta.extractModel', () => {
  const action = {
    type: 'FOO',
    payload: {
      data: {
        flarg: postData
      },
      cruft: {wow: 1}
    },
    meta: {
      extractModel: {
        getRoot: get('flarg'),
        modelName: 'Post'
      }
    }
  }

  middleware(action)
  expect(next).toBeCalledWith(action)
  expect(store.dispatch).toBeCalledWith({
    type: EXTRACT_MODEL,
    payload: postData,
    meta: {modelName: 'Post'}
  })
})

it('transforms an action with an array meta.extractModel', () => {
  const action = {
    type: 'FOO',
    payload: {
      data: {
        flarg: postData,
        arg: personData
      },
      cruft: {wow: 1}
    },
    meta: {
      extractModel: [
        {
          getRoot: get('arg'),
          modelName: 'Person'
        },
        {
          getRoot: get('flarg'),
          modelName: 'Post'
        }
      ]
    }
  }

  middleware(action)
  expect(next).toBeCalledWith(action)
  expect(store.dispatch.mock.calls.length).toEqual(2)
  expect(store.dispatch.mock.calls[0][0]).toEqual({
    type: EXTRACT_MODEL,
    payload: personData,
    meta: {modelName: 'Person'}
  })
  expect(store.dispatch.mock.calls[1][0]).toEqual({
    type: EXTRACT_MODEL,
    payload: postData,
    meta: {modelName: 'Post'}
  })
})

const postData = {
  id: '1',
  title: 'Cat on the loose',
  communities: [
    {
      id: '1',
      name: 'Neighborhood'
    }
  ],
  creator: {
    id: '2',
    name: 'Greg'
  }
}

const personData = {
  id: '2',
  name: 'Alice'
}
