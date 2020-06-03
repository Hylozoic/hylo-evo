import { CompositeLayer } from '@deck.gl/core'
import { IconLayer } from '@deck.gl/layers'
import Supercluster from 'supercluster'
import { createPostsScatterplotLayer } from '../postsScatterplotLayer'
import { iconAtlas } from 'util/assets'

// function getIconName ({color, size}) {
//   return `${color}-${size}`
// }

// export function createClusterLayerFromPosts ({ posts, onHover, onClick }) {
//   console.log(posts)
//   return new PostClusterLayer({ data: posts.filter(post => post.locationObject && post.locationObject.center)
//     .map(post => {
//       return {
//         id: post.id,
//         type: post.type,
//         color: 'FDD549',
//         message: post.title,
//         summary: post.details,
//         coordinates: [parseFloat(post.locationObject.center.lng), parseFloat(post.locationObject.center.lat)]
//       }
//     }),
//   onHover,
//   onClick,
//   getPosition: d => d.coordinates,
//   sizeScale: 60 })
// }

// function getIconSize (size) {
//   return Math.min(100, size) / 100 + 1
// }

const iconMapping = {
  "0DC39F-10": {"x":0,"y":0,"width":10,"height":10, "anchorY": 128, mask: true},
  "0DC39F-16": {"x":50,"y":0,"width":16,"height":16, "anchorY": 128, mask: true},
  "0DC39F-20": {"x":16,"y":16,"width":20,"height":20, "anchorY": 128, mask: true},
  "40A1DD-10": {"x":10,"y":0,"width":10,"height":10, "anchorY": 128, mask: true},
  "40A1DD-16": {"x":66,"y":0,"width":16,"height":16, "anchorY": 128, mask: true},
  "40A1DD-20": {"x":36,"y":16,"width":20,"height":20, "anchorY": 128, mask: true},
  "BB60A8-10": {"x":20,"y":0,"width":10,"height":10, "anchorY": 128, mask: true},
  "BB60A8-16": {"x":82,"y":0,"width":16,"height":16, "anchorY": 128, mask: true},
  "BB60A8-20": {"x":56,"y":16,"width":20,"height":20, "anchorY": 128, mask: true},
  "FD6A49-10": {"x":40,"y":0,"width":10,"height":10, "anchorY": 128, mask: true},
  "FD6A49-16": {"x":0,"y":16,"width":16,"height":16, "anchorY": 128, mask: true},
  "FD6A49-20": {"x":96,"y":16,"width":20,"height":20, "anchorY": 128, mask: true},
  "FDD549-10": {"x":30,"y":0,"width":10,"height":10, "anchorY": 128, mask: true},
  "FDD549-16": {"x":98,"y":0,"width":16,"height":16, "anchorY": 128, mask: true},
  "FDD549-20": {"x":76,"y":16,"width":20,"height":20, "anchorY": 128, mask: true}
}

export function createIconLayerFromPosts ({ posts, onHover, onClick }) {
  return createIconLayer({ data: posts.filter(post => post.locationObject && post.locationObject.center)
    .map(post => {
      return {
        id: post.id,
        type: post.type,
        color: 'FDD549',
        message: post.title,
        summary: post.details,
        coordinates: [parseFloat(post.locationObject.center.lng), parseFloat(post.locationObject.center.lat)]
      }
    }), onHover, onClick, sizeScale: 60 })
}

export function createIconLayer ({ data, onHover, onClick, getPosition, sizeScale }) {
  // console.log(iconAtlas, iconMapping)
  console.log(data)
  return new IconLayer({
    id: 'icon',
    data,
    iconAtlas: 'iconAtlas.png',
    iconMapping,
    sizeScale: 40,
    getPosition: d => {
      console.log(d, 'getPosition is called', d.coordinates)
      return d.coordinates
    },
    getIcon: d => {
      return d.type === 'offer' ? `BB60A8-20` : `${d.color}-10`
    },
    // getSize: d => getIconSize(d.properties.cluster ? d.properties.point_count : 1)
    getSize: d => 5,
    sizeUnits: 'meters',
    sizeMinPixels: 30
  })
}

// TODO: do a post filter function; map post type to color

export default class PostClusterLayer extends CompositeLayer {
  shouldUpdateState ({ changeFlags }) {
    return changeFlags.somethingChanged
  }

  updateState ({ props, oldProps, changeFlags }) {
    const rebuildIndex = changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale

    if (rebuildIndex) {
      const index = new Supercluster({ maxZoom: 16, radius: props.sizeScale })
      index.load(
        props.data.map(d => ({
          geometry: { coordinates: props.getPosition(d) }, // TODO: make this work with post.location
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

  renderLayers () {
    const { data } = this.state
    const {
      iconAtlas = 'iconAtlas.png',
      iconMapping = 'iconAtlas.json',
      sizeScale } = this.props

    console.log('render layers')
    return new IconLayer(
      this.getSubLayerProps({
        id: 'cluster',
        data,
        iconAtlas,
        iconMapping,
        sizeScale,
        getPosition: d => {
          console.log(d, 'getPosition is called', d.geometry.coordinates)
          return d.geometry.coordinates
        },
        getIcon: d => {
          console.log(d.properties.cluster ? `BB60A8-20` : `${d.properties.color}-10`)
          return d.properties.cluster ? `BB60A8-20` : `${d.properties.color}-10`
        },
        // getSize: d => getIconSize(d.properties.cluster ? d.properties.point_count : 1)
        getSize: d => 50
      })
    )
  }
}
