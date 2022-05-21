import { GeoJsonLayer } from '@deck.gl/layers'

export function createPolygonLayerFromGroups ({ groups, onHover }) {
  const data = groups.filter(group => group.geoShape).map(group => {
    return {
      geometry: group.geoShape || {},
      message: 'Group area: ' + group.name,
      properties: { name: group.name },
      type: 'GroupShape'
    }
  })

  return new GeoJsonLayer({
    id: 'geojson-layer',
    data,
    pickable: true,
    stroked: false,
    filled: true,
    extruded: false,
    pointType: 'circle',
    lineWidthScale: 20,
    lineWidthMinPixels: 2,
    getFillColor: [64, 161, 221, 51],
    getLineColor: 'black',
    getPointRadius: 100,
    getLineWidth: 1,
    onHover
  })
}
