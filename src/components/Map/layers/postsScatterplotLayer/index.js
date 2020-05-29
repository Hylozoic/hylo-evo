import { ScatterplotLayer } from '@deck.gl/layers'

export function createScatterplotLayerFromPosts (posts, onHover, onClick) {
  return createPostsScatterplotLayer(posts.filter(post => post.locationObject && post.locationObject.center)
    .map(post => {
      return {
        id: post.id,
        type: post.type,
        message: post.title,
        summary: post.details,
        coordinates: [parseFloat(post.locationObject.center.lng), parseFloat(post.locationObject.center.lat)]
      }
    }), onHover, onClick)
}

export function createPostsScatterplotLayer (data, onHover, onClick) {
  return new ScatterplotLayer({
    id: `scatterplot-posts-layer`,
    data,
    getPosition: d => d.coordinates,
    getRadius: 300,
    getFillColor: (d) => d.type === 'request' ? [253, 106, 73] : [13, 195, 159],
    // Enable picking
    pickable: true,
    // Update app state
    onHover,
    onClick
  })
}
