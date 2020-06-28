import { CompositeLayer } from '@deck.gl/core'
import { IconLayer } from '@deck.gl/layers'

const defaultCommunityUrl = `${window.location.origin}/assets/default_community_avatar.png`

// Icon Layer for Communities
export function createIconLayerFromCommunities ({ boundingBox, communities, onHover, onClick }) {
  let data = communities.filter(community => community.locationObject && community.locationObject.center)
    .map(community => {
      return {
        id: community.id,
        type: 'Community',
        message: 'Community: ' + community.name,
        avatarUrl: community.avatarUrl,
        coordinates: [parseFloat(community.locationObject.center.lng), parseFloat(community.locationObject.center.lat)]
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
    id: 'community-icon-layer',
    data,
    sizeScale: 1,
    getPosition: d => d.coordinates,
    // getIcon return an object which contains url to fetch icon of each data point
    // d.avatarUrl || defaultCommunityUrl
    getIcon: d => ({
      url: process.env.NODE_ENV === 'development' ? defaultCommunityUrl : d.avatarUrl,
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
  // return new CommunityIconLayer({ boundingBox, data, onHover, onClick, getPosition: d => d.coordinates })
}

export default class CommunityIconLayer extends CompositeLayer {
  getPickingInfo ({ info, mode }) {
    const pickedObject = info.object && info.object.properties
    if (pickedObject) {
      info.object = pickedObject
    }
    return info
  }

  renderLayers () {
    const { data, onHover, onClick } = this.props

    const communityIconLayer = new IconLayer({
      loadOptions: {
        mode: 'no-cors',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      },
      id: 'community-icon-layer',
      data,
      sizeScale: 1,
      getPosition: d => d.coordinates,
      // getIcon return an object which contains url to fetch icon of each data point
      //  || '/assets/all-communities-avatar.png'
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

    return [communityIconLayer]
  }
}
