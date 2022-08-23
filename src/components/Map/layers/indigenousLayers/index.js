import { GeoJsonLayer, TextLayer } from '@deck.gl/layers'
import { CompositeLayer } from '@deck.gl/core'
import { rgb } from 'd3-color'
import area from '@turf/area'
import centerOfMass from '@turf/center-of-mass'
import { polygon } from '@turf/helpers'

const defaultProps = {
  // Inherit all of GeoJsonLayer's props
  // ...GeoJsonLayer.defaultProps,
  // Label for each feature
  getLabel: { type: 'accessor', value: x => x.text },
  // Label size for each feature
  getLabelSize: { type: 'accessor', value: 32 },
  // Label color for each feature
  getLabelColor: { type: 'accessor', value: [0, 0, 0, 255] },
  // Label always facing the camera
  billboard: true,
  // Label size units
  labelSizeUnits: 'pixels',
  // Label background color
  labelBackground: { type: 'color', value: null, optional: true },
  // Label font
  fontFamily: 'Monaco, monospace'
}

// Extract anchor positions from features. We will be placing labels at these positions.
const getLabelAnchors = function (feature) {
  const { type, coordinates } = feature.geometry
  switch (type) {
    case 'Point':
      return [coordinates]
    case 'MultiPoint':
      return coordinates
    case 'Polygon':
      return [centerOfMass(feature).geometry.coordinates]
    case 'MultiPolygon': {
      const polygons = coordinates.map(rings => polygon(rings))
      const areas = polygons.map(area)
      const maxArea = Math.max.apply(null, areas)
      // Filter out the areas that are too small
      return polygons.filter((f, index) => areas[index] > maxArea * 0.5)
        .map(f => centerOfMass(f).geometry.coordinates)
    }
    default:
      return []
  }
}

// Our custom layer class
class LabeledGeoJsonLayer extends CompositeLayer {
  shouldUpdateState ({ changeFlags }) {
    return changeFlags.somethingChanged
  }

  updateState ({ props, oldProps, changeFlags }) {
    const { data } = this.props

    const labelData = (data.features || data)
      .flatMap((feature, index) => {
        const labelAnchors = getLabelAnchors(feature)
        return labelAnchors.map(p => this.getSubLayerRow({ position: p }, feature, index))
      })

    this.setState({ labelData })
  }

  renderLayers () {
    const {
      billboard,
      // fontFamily,
      getLabel,
      getLabelSize,
      getLabelColor,
      labelSizeUnits,
      labelBackground,
      onHover
    } = this.props

    return [
      new GeoJsonLayer(this.props, this.getSubLayerProps({ id: 'geojson' }), {
        data: this.props.data
      }),

      new TextLayer(this.getSubLayerProps({ id: 'text' }), {
        data: this.state.labelData,
        billboard,
        sizeUnits: labelSizeUnits,
        background: labelBackground,
        getPosition: d => d.position,
        getText: this.getSubLayerAccessor(getLabel),
        getSize: this.getSubLayerAccessor(getLabelSize),
        getColor: this.getSubLayerAccessor(getLabelColor),
        onHover
      })
    ]
  }
}

LabeledGeoJsonLayer.layerName = 'LabeledGeoJsonLayer'
LabeledGeoJsonLayer.defaultProps = defaultProps

export function indigenousTerritoriesLayer ({ onHover }) {
  return new LabeledGeoJsonLayer({
    id: `native-territories-${Date.now()}`,
    data: 'https://hylo-app.s3.amazonaws.com/map/indigenousTerritories.json',
    filled: true,
    stroked: true,
    billboard: false,
    pickable: true,
    getLineColor: [0, 0, 0, 130],
    getFillColor: t => { const c = rgb(t.properties.color); return [c.r, c.g, c.b, 50] },
    getLabel: f => f.properties.Name,
    // getLabelSize: f => Math.pow(2, Math.log10(area(f))) * 2,
    // labelSizeUnits: 'meters',
    getLabelSize: 16,
    labelSizeUnits: 'pixels',
    getLabelColor: [0, 64, 128],
    lineWidthUnits: 'pixels',
    lineWidthMinPixels: 1,
    onHover
  })
}
