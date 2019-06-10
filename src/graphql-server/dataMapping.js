import { invert } from 'lodash/fp'
import { currentDateString } from 'util/holochain'

// Data mapping, zome <> Hylo UI
export const zomeDefaultAttribsMap = () => ({
  post: {
    announcement: false,
    timestamp: currentDateString()
  },
  comment: {
    attachments: []
  }
})

const uiDefaultAttribsMap = () => ({
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
  },
  message: {
    'messageThreadId': 'thread_addr'
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
    // TODO: Mutating passed object. Used a cloned copy or do another way
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

export const toUiData = (...args) => {
  const results = createDataRemapper(toUiKeyMap)(...args)

  return {
    ...uiDefaultAttribsMap()[args[0]],
    ...results
  }
}

export const toUiQuerySet = results => ({
  total: results.length,
  items: results,
  hasMore: false
})
