import { H3HexagonLayer } from '@deck.gl/geo-layers'
import { geoToH3 } from 'h3-js'

export default function createAskOfferH3Layer (data, resolution) {
  return new H3HexagonLayer({
    id: `h3-add-offer-layer-${resolution}`,
    data,
    getHexagon: (d) => geoToH3(d.coordinates[0], d.coordinates[1], resolution - 3),
    getFillColor: (d) => d.type === 'ask' ? [200, 220, 0] : [150, 0, 160],
    filled: true,
    extruded: false,
    opacity: 0.4
  })
}
