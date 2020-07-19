import { ScatterplotLayer } from '@deck.gl/layers'
import { FEATURE_TYPES } from 'routes/MapExplorer/MapExplorer.store'

export function createScatterplotLayerFromPublicCommunities (publicCommunities, onHover, onClick) {
  return createScatterplotLayer('scatterplot-public-communities-layer', publicCommunities.filter(community => community.locationObject && community.locationObject.center)
    .map(community => {
      return {
        id: community.id,
        type: 'community',
        message: 'Community: ' + community.name,
        color: FEATURE_TYPES['community'].primaryColor,
        coordinates: [parseFloat(community.locationObject.center.lng), parseFloat(community.locationObject.center.lat)]
      }
    }), onHover, onClick)
}

export function createScatterplotLayer (id, data, onHover, onClick) {
  return new ScatterplotLayer({
    id: id || `scatterplot-layer`,
    data,
    getPosition: d => d.coordinates,
    getRadius: 10,
    radiusMinPixels: 5,
    radiusMaxPixels: 12,
    getFillColor: (d) => d.color,
    // Enable picking
    pickable: true,
    // Update app state
    onHover,
    onClick
  })
}
