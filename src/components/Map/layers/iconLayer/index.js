import { CompositeLayer } from '@deck.gl/core'
import { IconLayer } from '@deck.gl/layers'

const defaultGroupUrl = '/assets/default_group_avatar.png'

// Icon Layer for Groups
export function createIconLayerFromGroups ({ boundingBox, groups, onHover, onClick }) {
  let data = groups.filter(group => group.locationObject && group.locationObject.center)
    .map(group => {
      return {
        id: group.id,
        type: 'group',
        message: 'Group: ' + group.name,
        avatarUrl: group.avatarUrl,
        coordinates: [parseFloat(group.locationObject.center.lng), parseFloat(group.locationObject.center.lat)]
      }
    })

  return new IconLayer({
    loadOptions: {
      mode: 'no-cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'yes',
        'Origin': 'bloop'
      }
    },
    id: 'group-icon-layer',
    data,
    sizeScale: 1,
    getPosition: d => d.coordinates,
    // getIcon return an object which contains url to fetch icon of each data point
    // d.avatarUrl || defaultGroupUrl
    getIcon: d => ({
      url: defaultGroupUrl, // process.env.NODE_ENV === 'development' ? defaultGroupUrl : d.avatarUrl,
      width: 48,
      height: 48,
      anchorY: 0
    }),
    getSize: d => 48,
    sizeUnits: 'pixels',
    // sizeMinPixels: 20,
    pickable: true,
    onHover,
    onClick
  })
  // return new GroupIconLayer({ boundingBox, data, onHover, onClick, getPosition: d => d.coordinates })
}

export default class GroupIconLayer extends CompositeLayer {
  getPickingInfo ({ info, mode }) {
    const pickedObject = info.object && info.object.properties
    if (pickedObject) {
      info.object = pickedObject
    }
    return info
  }

  renderLayers () {
    const { data, onHover, onClick } = this.props

    const groupIconLayer = new IconLayer({
      loadOptions: {
        mode: 'no-cors',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      },
      id: 'group-icon-layer',
      data,
      sizeScale: 1,
      getPosition: d => d.coordinates,
      // getIcon return an object which contains url to fetch icon of each data point
      //  || '/assets/all-groups-avatar.png'
      getIcon: d => ({
        url: d.avatarUrl,
        width: 40,
        height: 40,
        anchorY: 40
      }),
      getSize: d => 40,
      sizeUnits: 'pixels',
      sizeMinPixels: 20,
      pickable: true,
      onHover,
      onClick
    })

    return [groupIconLayer]
  }
}
