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
    stroked: true,
    filled: true,
    extruded: false,
    pointType: 'circle',
    getPointRadius: 100,
    getFillColor: [64, 161, 221, 65],
    lineWidthScale: 20,
    lineWidthMinPixels: 1,
    getLineColor: [60, 100, 180, 100],
    getLineWidth: 1,
    onHover
  })
}
