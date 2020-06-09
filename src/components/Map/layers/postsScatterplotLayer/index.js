import { ScatterplotLayer } from '@deck.gl/layers'
import { POST_TYPES } from 'store/models/Post'
import { hexToRgb } from 'util/index'

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
    getRadius: 10,
    radiusMinPixels: 5,
    radiusMaxPixels: 12,
    getFillColor: (d) => hexToRgb(POST_TYPES[d.type].primaryColor),
    // Enable picking
    pickable: true,
    // Update app state
    onHover,
    onClick
  })
}
