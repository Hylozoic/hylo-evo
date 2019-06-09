import { invert } from 'lodash/fp'
import { currentDateString } from 'util/holochain'

// Data mapping from zome <> Hylo UI
export const zomeDefaultAttribsMap = () => ({
  post: {
    announcement: false,
    timestamp: currentDateString()
  },
  comment: {
    attachments: []
  }
})

export const toZomeKeyMap = {
  global: {
    'createdAt': 'timestamp',
    'id': 'address',
    'avatarUrl': 'avatar_url'
  },
  post: {
    'type': 'post_type'
  },
  person: {
    'id': 'agent_id'
  },
  comment: {
    'postId': 'base',
    'creator': 'agent_id'
  }
}

export const toUiKeyMap = {}
for (let key in toZomeKeyMap) {
  toUiKeyMap[key] = invert(toZomeKeyMap[key])
}

export const createDataRemapper = initialDataMap => (type, data) => {
  const dataMapForType = type in initialDataMap
    ? initialDataMap[type]
    : {}
  const dataMap = Object.assign({}, initialDataMap['global'], dataMapForType)
  let remappedData = {}

  for (let key in data) {
    const mappedKey = key in dataMap
      ? dataMap[key]
      : key
    remappedData[mappedKey] = data[key]
    // Mutating passed object. Used a cloned copy or do another way
    delete data[key]
  }

  return {
    ...data,
    ...remappedData
  }
}

export const toZomeData = (...args) => {
  const results = createDataRemapper(toZomeKeyMap)(...args)

  return {
    ...zomeDefaultAttribsMap()[args[0]],
    ...results
  }
}

export const toUiData = createDataRemapper(toUiKeyMap)

export const toUiQuerySet = results => ({
  total: results.length,
  items: results,
  hasMore: false
})
