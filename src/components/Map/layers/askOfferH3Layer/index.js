import { H3HexagonLayer } from '@deck.gl/geo-layers'
import { geoToH3 } from 'h3-js'

export function createH3LayerFromPosts (posts, resolution) {
  return createAskOfferH3Layer(posts.filter(post => post.location && post.location.center)
    .map(post => { return { type: post.type, summary: post.details, coordinates: [parseFloat(post.location.center.lat), parseFloat(post.location.center.lng)], hex: '8b283470d921fff' } }))
}

export function createAskOfferH3Layer (data, resolution) {
  return new H3HexagonLayer({
    id: `h3-add-offer-layer-${resolution}`,
    data,
    getHexagon: (d) => geoToH3(d.coordinates[0], d.coordinates[1], resolution - 3),
    getFillColor: (d) => d.type === 'request' ? [200, 220, 0] : [150, 0, 160],
    filled: true,
    extruded: false,
    opacity: 0.4
  })
}
