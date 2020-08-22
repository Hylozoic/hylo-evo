export function formatParams (search) {
  const { community, context, network, searchText, postTypes } = search;
  return [
    ['all', 'public'].includes(context) ? `Context: ${context}` : '',
    community ? `Community: ${community.name}` : '',
    network ? `Network: ${network.name}` : '',
    searchText ? `Search term: "${searchText}"` : '',
    postTypes ? `Post types: ${postTypes.join(', ')}` : ''
  ].filter(p => p.length).join('<br/>')
}

export function paramPreview (search) {
  const { context, community, network } = search;
  const contextDetails = {
    community: community ? `Community: ${community.name}` : '',
    network: network ? `Network: ${network.name}` : '',
    public: `Public communities`,
    all: `All communities`
  }
  return contextDetails[context]
}