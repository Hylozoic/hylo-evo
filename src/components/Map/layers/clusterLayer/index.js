import { CompositeLayer } from '@deck.gl/core'
import { IconLayer, TextLayer } from '@deck.gl/layers'
import Supercluster from 'supercluster'

const iconMapping = {
  '0DC39F-10': { 'x': 0, 'y': 0, 'width': 10, 'height': 10 },
  '0DC39F-16': { 'x': 50, 'y': 0, 'width': 16, 'height': 16 },
  '0DC39F-20': { 'x': 16, 'y': 16, 'width': 20, 'height': 20 },
  '40A1DD-10': { 'x': 10, 'y': 0, 'width': 10, 'height': 10 },
  '40A1DD-16': { 'x': 66, 'y': 0, 'width': 16, 'height': 16 },
  '40A1DD-20': { 'x': 36, 'y': 16, 'width': 20, 'height': 20 },
  'BB60A8-10': { 'x': 20, 'y': 0, 'width': 10, 'height': 10 },
  'BB60A8-16': { 'x': 82, 'y': 0, 'width': 16, 'height': 16 },
  'BB60A8-20': { 'x': 56, 'y': 16, 'width': 20, 'height': 20 },
  'FD6A49-10': { 'x': 40, 'y': 0, 'width': 10, 'height': 10 },
  'FD6A49-16': { 'x': 0, 'y': 16, 'width': 16, 'height': 16 },
  'FD6A49-20': { 'x': 96, 'y': 16, 'width': 20, 'height': 20 },
  'FDD549-10': { 'x': 30, 'y': 0, 'width': 10, 'height': 10 },
  'FDD549-16': { 'x': 98, 'y': 0, 'width': 16, 'height': 16 },
  'FDD549-20': { 'x': 76, 'y': 16, 'width': 20, 'height': 20 }
}

export function createIconLayerFromPosts ({ posts, onHover, onClick }) {
  let data = posts.filter(post => post.locationObject && post.locationObject.center)
    .map(post => {
      return {
        id: post.id,
        type: post.type,
        color: 'FDD549', // TODO: do a post filter function; map post type to color
        message: post.title,
        summary: post.details,
        coordinates: [parseFloat(post.locationObject.center.lng), parseFloat(post.locationObject.center.lat)]
      }
    })
  return new PostClusterLayer({ data, onHover, onClick, sizeScale: 60, getPosition: d => d.coordinates })
}

export default class PostClusterLayer extends CompositeLayer {
  shouldUpdateState ({ changeFlags }) {
    return changeFlags.somethingChanged
  }

  updateState ({ props, oldProps, changeFlags }) {
    const rebuildIndex = changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale

    if (rebuildIndex) {
      const index = new Supercluster({ maxZoom: 16, radius: props.sizeScale }) // sizeScale here also adjusts how aggressively this layer clusters
      index.load(
        props.data.map(d => ({
          geometry: { coordinates: props.getPosition(d) },
          properties: d
        }))
      )
      this.setState({ index })
    }

    const z = Math.floor(this.context.viewport.zoom)
    if (rebuildIndex || z !== this.state.z) {
      this.setState({
        data: this.state.index.getClusters([-180, -85, 180, 85], z),
        z
      })
    }
  }

  // getPickingInfo ({ info, mode }) {
  //   const pickedObject = info.object && info.object.properties
  //   if (pickedObject) {
  //     if (pickedObject.cluster && mode !== 'hover') {
  //       info.objects = this.state.index
  //         .getLeaves(pickedObject.cluster_id, 25)
  //         .map(f => f.properties)
  //     }
  //     info.object = pickedObject
  //   }
  //   return info
  // }
  //
  // TODO: add attribute `pickable: true` to experiment with this. https://github.com/visgl/deck.gl/blob/8.1-release/examples/website/icon/icon-cluster-layer.js

  renderLayers () {
    const { data } = this.state
    const {
      iconAtlas = '/iconAtlas.png',
      sizeScale } = this.props

    const iconSubLayer = new IconLayer(
      this.getSubLayerProps({
        id: 'icon-cluster',
        data,
        iconAtlas,
        iconMapping,
        sizeScale, // TODO: play with these to get 'appropriate' marker size at all scales
        getPosition: d => d.geometry.coordinates,
        getIcon: d => d.properties.cluster ? `BB60A8-20` : `${d.properties.color}-20`, // TODO: accommodate all icons and/or adjust to proper iconAtlas
        getSize: d => d.properties.cluster ? 10 : 5, // TODO: play with these to get 'appropriate' marker size
        sizeUnits: 'meters',
        sizeMinPixels: 20 // TODO: play with these to get 'appropriate' marker size at all scales
      })
    )

    const textSubLayer = new TextLayer(
      this.getSubLayerProps({
        id: 'text-cluster',
        data,
        sizeScale,
        getPosition: d => d.geometry.coordinates,
        getTextAnchor: 'middle',
        getAlignmentBaseline: 'center',
        getText: d => d.properties.cluster ? `${d.properties.point_count}` : '',
        getSize: d => d.properties.cluster ? 12 : 0,
        sizeUnits: 'meters',
        sizeMinPixels: 12
      })
    )

    return [iconSubLayer, textSubLayer]
  }
}
