export function formatParams (search) {
  const { community, network, isPublic, searchText, postTypes } = search;
  return [
    community ? `Community: ${community.name}` : '',
    network ? `Network: ${network.slug}` : '',
    `Public posts: ${isPublic}`,
    searchText ? `Search term: "${searchText}"` : '',
    postTypes ? `Post types: ${postTypes.join(', ')}` : ''
  ].filter(p => p.length).join('<br/>')
}
