import { get, has } from 'lodash/fp'

import reducer, {
  CREATE_TOPIC,
  FETCH_GROUP_TOPIC,
  createTopic,
  fetchGroupTopic
} from './CreateTopic.store'

it('matches the last snapshot for createTopic', () => {
  expect(createTopic('wombats', '1')).toMatchSnapshot()
})

it('matches the last snapshot for fetchGroupTopic', () => {
  expect(fetchGroupTopic('wombats', 'wombat-group')).toMatchSnapshot()
})

describe('reducer', () => {
  it('removes the topic name from the component store (CREATE_TOPIC)', () => {
    const state = {
      wombats: {
        'wombat-group': false
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

  it('sets flag to false if topic does not exist (FETCH_GROUP_TOPIC)', () => {
    const action = {
      type: FETCH_GROUP_TOPIC,
      meta: {
        groupSlug: 'wombat-group',
        topicName: 'wombats'
      },
      payload: {
        data: {
          groupTopic: null
        }
      }
    }
    const groupFlag = get('wombats.wombat-group', reducer({}, action))
    expect(groupFlag).toBe(false)
  })

  it('sets flag to true if topic exists (FETCH_GROUP_TOPIC)', () => {
    const action = {
      type: FETCH_GROUP_TOPIC,
      meta: {
        groupSlug: 'wombat-group',
        topicName: 'wombats'
      },
      payload: {
        data: {
          groupTopic: {
            id: '1',
            topic: {
              id: '1',
              name: 'wombats'
            }
          }
        }
      }
    }
    const groupFlag = get('wombats.wombat-group', reducer({}, action))
    expect(groupFlag).toBe(true)
  })
})
