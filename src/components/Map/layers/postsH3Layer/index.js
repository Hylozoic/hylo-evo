// import { H3HexagonLayer } from '@deck.gl/geo-layers'
import { ScatterplotLayer } from '@deck.gl/layers'
// import { geoToH3 } from 'h3-js'

export function createH3LayerFromPosts (posts, resolution, onHover, onClick) {
  return createPostsH3Layer(posts.filter(post => post.location && post.location.center)
    .map(post => {
      return {
        id: post.id,
        type: post.type,
        message: post.title,
        summary: post.details,
        coordinates: [parseFloat(post.location.center.lng), parseFloat(post.location.center.lat)],
        hex: '8b283470d921fff'
      }
    }), resolution, onHover, onClick)
}

export function createPostsH3Layer (data, resolution, onHover, onClick) {
  return new ScatterplotLayer({
    id: `h3-posts-layer-${resolution}`,
    data,
    getPosition: d => d.coordinates,
    getRadius: 300,
    getFillColor: (d) => d.type === 'request' ? [200, 220, 0] : [150, 0, 160],
    // Enable picking
    pickable: true,
    // Update app state
    onHover,
    onClick
  })

  // return new H3HexagonLayer({
  //   id: `h3-posts-layer-${resolution}`,
  //   data,
  //   getHexagon: (d) => geoToH3(d.coordinates[0], d.coordinates[1], resolution),
  //   getFillColor: (d) => d.type === 'request' ? [200, 220, 0] : [150, 0, 160],
  //   filled: true,
  //   extruded: false,
  //   opacity: 0.4,
  //   pickable: true,
  //   onHover
  // })
}
