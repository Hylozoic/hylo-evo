import { ScatterplotLayer } from '@deck.gl/layers'
import { FEATURE_TYPES } from 'routes/MapExplorer/MapExplorer'
import { hexToRgb } from 'util/index'

export function createScatterplotLayerFromPosts (posts, onHover, onClick) {
  return createScatterplotLayer('scatterplot-posts-layer', posts.filter(post => post.locationObject && post.locationObject.center)
    .map(post => {
      return {
        id: post.id,
        type: post.type,
        message: post.title,
        summary: post.details,
        color: hexToRgb(FEATURE_TYPES[post.type].primaryColor),
        coordinates: [parseFloat(post.locationObject.center.lng), parseFloat(post.locationObject.center.lat)]
      }
    }), onHover, onClick)
}

export function createScatterplotLayerFromMembers (members, onHover, onClick) {
  return createScatterplotLayer('scatterplot-members-layer', members.filter(member => member.locationObject && member.locationObject.center)
    .map(member => {
      return {
        id: member.id,
        type: 'member',
        message: 'Member: ' + member.name,
        color: FEATURE_TYPES['member'].primaryColor,
        coordinates: [parseFloat(member.locationObject.center.lng), parseFloat(member.locationObject.center.lat)]
      }
    }), onHover, onClick)
}

export function createScatterplotLayerFromPublicCommunities (publicCommunities, onHover, onClick) {
  return createScatterplotLayer('scatterplot-public-communities-layer', publicCommunities.filter(community => community.locationObject && community.locationObject.center)
    .map(community => {
      return {
        id: community.id,
        type: 'community',
        message: 'Community: ' + community.name,
        color: FEATURE_TYPES['community'].primaryColor,
        coordinates: [parseFloat(community.locationObject.center.lng), parseFloat(community.locationObject.center.lat)]
      }
    }), onHover, onClick)
}

export function createScatterplotLayer (id, data, onHover, onClick) {
  return new ScatterplotLayer({
    id: id || `scatterplot-layer`,
    data,
    getPosition: d => d.coordinates,
    getRadius: 10,
    radiusMinPixels: 5,
    radiusMaxPixels: 12,
    getFillColor: (d) => d.color,
    // Enable picking
    pickable: true,
    // Update app state
    onHover,
    onClick
  })
}
