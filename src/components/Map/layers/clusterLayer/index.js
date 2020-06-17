import { CompositeLayer } from '@deck.gl/core'
import { IconLayer, TextLayer } from '@deck.gl/layers'
import Supercluster from 'supercluster'
import { FEATURE_TYPES } from 'routes/MapExplorer/MapExplorer.store'
import { hexToRgb } from 'util/index'

const iconMapping = {
  'cluster': { 'x': 0, 'y': 0, 'width': 30, 'height': 30 },
  'event': { 'x': 30, 'y': 0, 'width': 20, 'height': 20 },
  'member': { 'x': 50, 'y': 0, 'width': 20, 'height': 20 },
  'offer': { 'x': 70, 'y': 0, 'width': 20, 'height': 20 },
  'request': { 'x': 90, 'y': 0, 'width': 20, 'height': 20 },
  'resource': { 'x': 110, 'y': 0, 'width': 20, 'height': 20 }
}

export function createIconLayerFromPostsAndMembers ({ boundingBox, members, posts, onHover, onClick }) {
  // TODO: shouldn't need to filter by locationObject, should all have one for map...?
  let data = posts.filter(post => post.locationObject && post.locationObject.center)
    .map(post => {
      return {
        id: post.id,
        type: post.type,
        color: hexToRgb(FEATURE_TYPES[post.type].primaryColor),
        message: post.title,
        summary: post.details,
        coordinates: [parseFloat(post.locationObject.center.lng), parseFloat(post.locationObject.center.lat)]
      }
    })
  data = data.concat(members.map(member => {
    return {
      id: member.id,
      type: 'member',
      message: 'Member: ' + member.name,
      coordinates: [parseFloat(member.locationObject.center.lng), parseFloat(member.locationObject.center.lat)]
    }
  }))
  return new PostClusterLayer({ boundingBox, data, onHover, onClick, getPosition: d => d.coordinates })
}

export default class PostClusterLayer extends CompositeLayer {
  shouldUpdateState ({ changeFlags }) {
    return changeFlags.somethingChanged
  }

  updateState ({ props, oldProps, changeFlags }) {
    const { boundingBox, data, getPosition } = props

    if (!boundingBox) {
      return
    }

    const rebuildIndex = changeFlags.dataChanged
    if (rebuildIndex) {
      // Radius here also adjusts how aggressively this layer clusters, lower means less clusters
      const index = new Supercluster({ maxZoom: 16, radius: 20 })
      index.load(
        data.map(d => ({
          geometry: { coordinates: getPosition(d) },
          properties: d
        }))
      )
      this.setState({ index })
    }

    const z = Math.floor(this.context.viewport.zoom)
    if (rebuildIndex || z !== this.state.z) {
      this.setState({
        data: this.state.index.getClusters([boundingBox[0].lng, boundingBox[0].lat, boundingBox[1].lng, boundingBox[1].lat], z),
        z
      })
    }
  }

  getPickingInfo ({ info, mode }) {
    const pickedObject = info.object && info.object.properties
    if (pickedObject) {
      if (pickedObject.cluster) {
        info.objects = this.state.index
          .getLeaves(pickedObject.cluster_id, 25)
          .map(f => f.properties)
      }
      info.object = pickedObject
    }
    return info
  }

  renderLayers () {
    const { data } = this.state
    const {
      iconAtlas = '/mapIconAtlas.png'
    } = this.props

    const iconSubLayer = new IconLayer(
      this.getSubLayerProps({
        id: 'icon-cluster',
        data,
        iconAtlas,
        iconMapping,
        sizeScale: 1,
        getPosition: d => d.geometry.coordinates,
        getIcon: d => d.properties.cluster ? 'cluster' : d.properties.type,
        getSize: d => d.properties.cluster ? 30 : 20,
        sizeUnits: 'pixels',
        sizeMinPixels: 20,
        pickable: true
      })
    )

    const textSubLayer = new TextLayer(
      this.getSubLayerProps({
        id: 'text-cluster',
        data,
        sizeScale: 1,
        getPosition: d => d.geometry.coordinates,
        getTextAnchor: 'middle',
        getAlignmentBaseline: 'center',
        getText: d => d.properties.cluster ? `${d.properties.point_count}` : ' ',
        getSize: d => d.properties.cluster ? 22 : 0,
        sizeUnits: 'pixels',
        sizeMinPixels: 22
      })
    )

    return [iconSubLayer, textSubLayer]
  }
}
