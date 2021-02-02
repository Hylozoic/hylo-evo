import { getRoots } from './extractModelsFromAction'
import { get } from 'lodash/fp'

it('handles an action with a string meta.extractModel', () => {
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

  expect(getRoots(action)).toEqual([
    {
      payload: postData,
      modelName: 'Post',
      append: true
    }
  ])
})

it('handles an action with an object meta.extractModel', () => {
  const action = {
    type: 'FOO',
    payload: {
      data: {
        flarg: postData
      },
      cruft: { wow: 1 }
    },
    meta: {
      extractModel: {
        getRoot: get('flarg'),
        modelName: 'Post',
        append: false
      }
    }
  }

  expect(getRoots(action)).toEqual([
    {
      payload: postData,
      modelName: 'Post',
      append: false
    }
  ])
})

it('handles an action with an array meta.extractModel', () => {
  const action = {
    type: 'FOO',
    payload: {
      data: {
        flarg: postData,
        arg: personData
      },
      cruft: { wow: 1 }
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

  expect(getRoots(action)).toEqual([
    {
      payload: personData,
      modelName: 'Person'
    },
    {
      payload: postData,
      modelName: 'Post'
    }
  ])
})

const postData = {
  id: '1',
  title: 'Cat on the loose',
  groups: [
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
