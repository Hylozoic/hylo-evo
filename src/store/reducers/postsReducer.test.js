import React from 'react'
import { shallow } from 'enzyme'
import postsReducer from './postsReducer'
import { FETCH_POST } from './constants'
import { samplePost } from 'components/PostCard/samplePost'

const initialState = {}

it('stores posts by id', () => {
  const action = {
    type: FETCH_POST,
    payload: samplePost
  }
  const result = postsReducer(initialState, action)
  expect(result).toEqual({})
})
