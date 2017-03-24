import React from 'react'
import postsReducer from './postsReducer'
import { FETCH_POST } from '../constants'
import samplePost from 'components/PostCard/samplePost'

const initialState = {}

it('Adds a Post indexed by id', () => {
  const action = {
    type: FETCH_POST,
    payload: samplePost
  }
  const expected = "SAMPLE_POST"
  const actual = postsReducer(initialState, action)
  expect(actual).toHaveProperty(expected)
})
