import moment from 'moment'

const parsegroup = group => `Group: ${group.name}`
const parsePostTypes = postTypes => `Post types: ${postTypes.join(', ')}`
const parseSearch = searchText => `Search term: "${searchText}"`
const parseTopics = topics => `Topics: ${topics.map(t => t.name).join(', ')}`

export function currentFilters (filters) {
  const { featureTypes, search, topics } = filters

  const postTypes = Object.keys(featureTypes).reduce((selected, type) => {
    if (featureTypes[type]) selected.push(type)
    return selected
  }, [])

  const parsedFilters = []

  if (postTypes.length) parsedFilters.push(parsePostTypes(postTypes))
  if (topics.length) parsedFilters.push(parseTopics(topics))
  if (search && search.length) parsedFilters.push(parseSearch(search))

  return parsedFilters.length ? parsedFilters.join(' • ') : 'No filters'
}

export function formatParams (search) {
  const { group, context, createdAt, postTypes, searchText, topics } = search
  return [
    `Created on ${moment(createdAt).format('MMMM Do YYYY')}`,
    ['all', 'public'].includes(context) ? `Context: ${context}` : '',
    group ? parsegroup(group) : '',
    searchText ? parseSearch(searchText) : '',
    postTypes ? parsePostTypes(postTypes) : '',
    topics.length ? parseTopics(topics) : ''
  ].filter(p => p.length).join('<br/>')
}

export function formatParamPreview (search) {
  const { context, group, postTypes } = search
  const contextDetails = {
    group: group ? parsegroup(group) : '',
    public: `Public Groups`,
    all: `All Groups`
  }
  return `${contextDetails[context]} • ${parsePostTypes(postTypes)}`
}

export function generateViewParams (search) {
  const { boundingBox, context, group, postTypes, searchText, topics } = search

  let mapPath, slug, subject
  switch (context) {
    case 'all': {
      mapPath = `/all/map`
      subject = 'all'
      break
    }
    case 'public': {
      mapPath = `/public/map`
      subject = 'public'
      break
    }
    case 'group': {
      mapPath = `/g/${group.slug}/map`
      slug = group.slug
      subject = 'group'
      break
    }
    default: {
      mapPath = `/public/map`
      subject = 'public-groups'
    }
  }

  const featureTypes = postTypes.reduce((map, type) => {
    map[type] = true
    return map
  }, {})

  return { boundingBox, featureTypes, mapPath, searchText, slug, subject, topics }
}
