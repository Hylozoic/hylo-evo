import { CompositeLayer } from '@deck.gl/core'
import { IconLayer } from '@deck.gl/layers'
import Supercluster from 'supercluster'

// function getIconName ({color, size}) {
//   return `${color}-${size}`
// }

function getIconSize (size) {
  return Math.min(100, size) / 100 + 1
}

export default class clusterLayer extends CompositeLayer {
  shouldUpdateState ({ changeFlags }) {
    return changeFlags.somethingChanged
  }

  updateState ({ props, oldProps, changeFlags }) {
    const rebuildIndex = changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale

    if (rebuildIndex) {
      const index = new Supercluster({ maxZoom: 16, radius: props.sizeScale })
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

  renderLayers () {
    const { data } = this.state
    const { iconAtlas, iconMapping, sizeScale } = this.props

    return new IconLayer(
      this.getSubLayerProps({
        id: 'cluster',
        data,
        iconAtlas,
        iconMapping,
        sizeScale,
        getPosition: d => d.geometry.coordinates,
        getIcon: d => d.properties.cluster ? `BB60A8-20` : `${d.color}-10`,
        getSize: d => getIconSize(d.properties.cluster ? d.properties.point_count : 1)
      })
    )
  }
}
