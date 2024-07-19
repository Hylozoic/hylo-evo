import { ScatterplotLayer } from '@deck.gl/layers'
import { FEATURE_TYPES } from 'routes/MapExplorer/MapExplorer.store'

export function createScatterplotLayerFromPublicGroups (publicGroups, onHover, onClick) {
  return createScatterplotLayer('scatterplot-public-groups-layer', publicGroups.filter(group => group.locationObject && group.locationObject.center)
    .map(group => {
      return {
        id: group.id,
        type: 'group',
        message: 'Group: ' + group.name,
        color: FEATURE_TYPES['group'].primaryColor,
        coordinates: [parseFloat(group.locationObject.center.lng), parseFloat(group.locationObject.center.lat)]
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
