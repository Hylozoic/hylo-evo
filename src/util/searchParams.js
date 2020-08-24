const parseCommunity = community => `Community: ${community.name}`
const parseNetwork = network => `Network: ${network.name}`
const parsePostTypes = postTypes => `Post types: ${postTypes.join(', ')}`
const parseSearch = searchText => `Search term: "${searchText}"`
const parseTopics = topics => `Topics: ${ topics.map(t => t.name).join(', ')}`

export function currentFilters (filters) {
  const { featureTypes, search, topics } = filters

  const postTypes = Object.keys(featureTypes).reduce((selected, type) => {
    if (featureTypes[type]) selected.push(type)
    return selected;
  }, [])

  const parsedFilters = []
  
  if (postTypes.length) parsedFilters.push(parsePostTypes(postTypes))
  if (topics.length) parsedFilters.push(parseTopics(topics))
  if (search.length) parsedFilters.push(parseSearch(search))

  return parsedFilters.length ? parsedFilters.join(' • ') : 'No filters'
}

export function formatParams (search) {
  const { community, context, network, postTypes, searchText, topics  } = search;
  return [
    ['all', 'public'].includes(context) ? `Context: ${context}` : '',
    community ? parseCommunity(community) : '',
    network ? parseNetwork(network) : '',
    searchText ?  parseSearch(searchText): '',
    postTypes ? parsePostTypes(postTypes) : '',
    topics.length ? parseTopics(topics) : '',
  ].filter(p => p.length).join('<br/>')
}

export function formatParamPreview (search) {
  const { context, community, network, postTypes } = search;
  const contextDetails = {
    community: community ? parseCommunity(community) : '',
    network: network ? parseNetwork(network) : '',
    public: `Public communities`,
    all: `All communities`
  }
  return `${contextDetails[context]} • ${parsePostTypes(postTypes)}`
}

export function generateViewParams (search) {
  const { context, community, network, postTypes, searchText, topics } = search

  let { boundingBox } = search
  boundingBox[0] = { lat: parseFloat(boundingBox[0].lat), lng: parseFloat(boundingBox[0].lng) }
  boundingBox[1] = { lat: parseFloat(boundingBox[1].lat), lng: parseFloat(boundingBox[1].lng) }

  let mapPath, networkSlug, slug, subject
  switch (context) {
    case 'all': {
      mapPath = `/all/map`
      subject = 'all-communities'
      break
    }
    case 'public': {
      mapPath = `/public/map`
      subject = 'public-communities'
      break
    }
    case 'network': {
      mapPath = `/n/${network.slug}/map`
      subject = 'network'
      networkSlug = network.slug
      break
    }
    case 'community': {
      mapPath = `/c/${community.slug}/map`
      slug = community.slug
      subject = 'community'
      break
    }
    default: {
      mapPath = `/public/map`
      subject = 'public-communities'
    }
  }

  const featureTypes = postTypes.reduce((map, type) => {
    map[type] = true
    return map
  }, {})

  return { boundingBox, featureTypes, mapPath, networkSlug, searchText, slug, subject, topics }
}
