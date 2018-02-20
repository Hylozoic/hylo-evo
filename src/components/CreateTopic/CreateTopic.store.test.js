import { get, has } from 'lodash/fp'

import reducer, {
  CREATE_TOPIC,
  FETCH_COMMUNITY_TOPIC,
  createTopic,
  fetchCommunityTopic
} from './CreateTopic.store'

it('matches the last snapshot for createTopic', () => {
  expect(createTopic('wombats', '1')).toMatchSnapshot()
})

it('matches the last snapshot for fetchCommunityTopic', () => {
  expect(fetchCommunityTopic('wombats', 'wombat-community')).toMatchSnapshot()
})

describe('reducer', () => {
  it('removes the topic name from the component store (CREATE_TOPIC)', () => {
    const state = {
      wombats: {
        'wombat-community': false
      }
    }
    const action = {
      type: CREATE_TOPIC,
      payload: {
        data: {
          createTopic: {
            name: 'wombats'
          }
        }
      }
    }
    const hasTopic = has('wombats', reducer(state, action))
    expect(hasTopic).toBeFalsy()
  })

  it('sets flag to false if topic does not exist (FETCH_COMMUNITY_TOPIC)', () => {
    const action = {
      type: FETCH_COMMUNITY_TOPIC,
      meta: {
        communitySlug: 'wombat-community',
        topicName: 'wombats'
      },
      payload: {
        data: {
          communityTopic: null
        }
      }
    }
    const communityFlag = get('wombats.wombat-community', reducer({}, action))
    expect(communityFlag).toBe(false)
  })

  it('sets flag to true if topic exists (FETCH_COMMUNITY_TOPIC)', () => {
    const action = {
      type: FETCH_COMMUNITY_TOPIC,
      meta: {
        communitySlug: 'wombat-community',
        topicName: 'wombats'
      },
      payload: {
        data: {
          communityTopic: {
            id: '1',
            topic: {
              id: '1',
              name: 'wombats'
            }
          }
        }
      }
    }
    const communityFlag = get('wombats.wombat-community', reducer({}, action))
    expect(communityFlag).toBe(true)
  })
})
