import { CompositeLayer } from '@deck.gl/core'
import { IconLayer, TextLayer } from '@deck.gl/layers'
import Supercluster from 'supercluster'

import mapSpriteData from 'components/Map/layers/clusterLayer/mapIconAtlas.js'
import { FEATURE_TYPES } from 'routes/MapExplorer/MapExplorer.store'

const iconMapping = Object.keys(mapSpriteData).reduce((result, sprite) => {
  const data = mapSpriteData[sprite].frame
  result[sprite] = {
    x: data.x,
    y: data.y,
    width: data.w,
    height: data.h
  }
  return result
}, {})

export function createIconLayerFromPostsAndMembers ({ boundingBox, members, posts, onHover, onClick }) {
  // TODO: shouldn't need to filter by locationObject, should all have one for map...?
  let data = posts.filter(post => post.locationObject && post.locationObject.center)
    .map(post => {
      return {
        id: post.id,
        type: post.type,
        message: post.title,
        coordinates: [parseFloat(post.locationObject.center.lng), parseFloat(post.locationObject.center.lat)]
      }
    })
  data = data.concat(members.map(member => {
    return {
      id: member.id,
      type: 'member',
      message: member.name,
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
      const index = new Supercluster({ maxZoom: 25, radius: 20 })
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
        data: this.state.index.getClusters(boundingBox, z),
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
      info.expansionZoom = Math.min(this.state.index.getClusterExpansionZoom(pickedObject.cluster_id, this.context.viewport.zoom), 14)
    }
    return info
  }

  renderLayers () {
    const { data } = this.state
    const {
      iconAtlas = '/mapIconAtlas.png'
    } = this.props

    const layers = []

    // When zoomed in show the feature text on the map
    if (this.context.viewport.zoom > 14) {
      layers.push(new TextLayer(
        this.getSubLayerProps({
          id: 'text-feature-name',
          data,
          fontFamily: '"Circular Bold", sans-serif',
          sizeScale: 1,
          backgroundColor: [255, 255, 255],
          getColor: d => d.properties.cluster ? [255, 255, 255, 255] : FEATURE_TYPES[d.properties.type].primaryColor,
          getPosition: d => d.geometry.coordinates,
          getTextAnchor: 'middle',
          getAlignmentBaseline: 'top',
          getPixelOffset: [0, 15],
          getText: d => d.properties.cluster ? ' ' : d.properties.message.length > 20 ? d.properties.message.slice(0, 19) + '...' : d.properties.message,
          getSize: d => d.properties.cluster ? 0 : 14,
          // wordBreak: 'break-word',
          // maxWidth: 600,
          sizeUnits: 'pixels'
        })
      ))
    }

    layers.push(new IconLayer(
      this.getSubLayerProps({
        id: 'icon-cluster',
        data,
        iconAtlas,
        iconMapping,
        sizeScale: 1,
        getPosition: d => d.geometry.coordinates,
        getIcon: d => {
          if (d.properties.cluster) {
            const features = this.state.index
              .getLeaves(d.properties.cluster_id, 25)
              .map(f => f.properties)

            const sprite = ['event', 'member', 'offer', 'request', 'resource', 'project'].reduce((result, type) => {
              return features.find(feature => feature.type === type) ? result.concat(type + 's') : result
            }, [])

            if (sprite.length === 1) {
              return sprite + '.png'
            } else {
              return sprite.join('-') + '.png'
            }
          }

          return d.properties.type + '.png'
        },
        getSize: d => d.properties.cluster ? 34 : 15,
        sizeUnits: 'pixels',
        pickable: true
      })
    ))

    // Feature count inside of clusters
    layers.push(new TextLayer(
      this.getSubLayerProps({
        id: 'text-cluster-count',
        data,
        fontFamily: '"Circular Bold", sans-serif',
        sizeScale: 1,
        getColor: [255, 255, 255, 255],
        getPosition: d => d.geometry.coordinates,
        getTextAnchor: 'middle',
        getAlignmentBaseline: 'center',
        getText: d => d.properties.cluster ? `${d.properties.point_count}` : ' ',
        getSize: d => d.properties.cluster ? 14 : 0,
        sizeUnits: 'pixels',
        sizeMinPixels: 14
      })
    ))

    return layers
  }
}
