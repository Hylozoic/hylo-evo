import React, { useEffect, useState } from 'react'
import { groupBy } from 'lodash'
import Map from 'components/Map'
import { createIconLayerFromPostsAndMembers } from 'components/Map/layers/clusterLayer'
import { createIconLayerFromGroups } from 'components/Map/layers/iconLayer'
import useEnsureSearchedGroups from 'hooks/useEnsureSearchedGroups'
import useRouter from 'hooks/useRouter'

import './FarmMap.scss'


export default function FarmMapWidget ({ group, items }) {
  /*
    - Source group from the props, and its location
    - Source the posts from props; that will get you farm posts on the map
    - make a separate query for nearby groups, probably the same as the groupExplorer fetch
  */
  const coord = group.locationObject && group.locationObject.center && { lng: parseFloat(group.locationObject.center.lng), lat: parseFloat(group.locationObject.center.lat) }
  const defaultViewport = {
    width: 400,
    height: 300,
    latitude: coord.lat,
    longitude: coord.lng,
    zoom: 8,
    bearing: 0,
    pitch: 0,
    mapBoundingBox: null
  }
  const { push } = useRouter()
  const [viewport, setViewport] = useState(defaultViewport)
  const [groupIconLayer, setGroupIconLayer] = useState(null)
  const [postsLayer, setPostsLayer] = useState([])
  const [pointerX, setPointerX] = useState(null)
  const [pointerY, setPointerY] = useState(null)
  const [hoveredObject, setHoveredObject] = useState(null)
  const { pending, groups } = useEnsureSearchedGroups({ sortBy: 'nearest', nearCoord: coord, groupType: 'farm' })

  const onMapHover = (info) => {
    setHoveredObject(info.objects || info.object)
    setPointerX(info.x)
    setPointerY(info.y)
  }

  const onMapClick = (info) => {
    console.log(info)
    if (info.object && info.object.type === 'group') {
      push(`/groups/${info.object.slug}`)
    } else if (info.object && info.object.id) {
      push(`/groups/${info.object.slug}/post/${info.object.id}`)
    }
  }

  useEffect(() => {
    const viewGroups = groups.filter(group => {
      const locationObject = group.ref.locationObject
      return locationObject && locationObject.center && locationObject.center.lng && locationObject.center.lat
    }).map((group) => {
      return { ...group, locationObject: group.ref.locationObject, name: group.ref.name, slug: group.ref.slug, avatarUrl: group.ref.avatarUrl }
    })

    setGroupIconLayer(createIconLayerFromGroups({
      groups: viewGroups,
      onHover: onMapHover,
      onClick: onMapClick
    }))
  }, [groups])

  useEffect(() => {
    const viewPosts = items.filter(post => {
      const locationObject = post.locationObject
      return locationObject && locationObject.center && locationObject.center.lng && locationObject.center.lat
    }).map((post) => {
      return { ...post, slug: group.slug }
    })

    setPostsLayer(createIconLayerFromPostsAndMembers({
      members: [],
      posts: viewPosts,
      onHover: onMapHover,
      onClick: onMapClick,
      boundingBox: viewport.mapBoundingBox,
      forceUpdate: true
    }))
  }, [items, viewport])

  const _renderTooltip = () => {
    if (hoveredObject) {
      let message
      let type
      if (Array.isArray(hoveredObject) && hoveredObject.length > 0) {
        // cluster
        const types = groupBy(hoveredObject, 'type')
        message = Object.keys(types).map(type => <p key={type}>{types[type].length} {type}{types[type].length === 1 ? '' : 's'}</p>)
        type = 'cluster'
      } else {
        message = hoveredObject.message
        type = hoveredObject.type
        console.log(type, 'type')
      }

      return (
        <div styleName='postTip' className={type} style={{ left: pointerX + 15, top: pointerY }}>
          {message}
        </div>
      )
    }
    return ''
  }

  return (
    <div styleName='farm-map-container'>
      <Map
        layers={[groupIconLayer, postsLayer]}
        children={_renderTooltip()}
        viewport={viewport}
        onViewportUpdate={setViewport}
      />
    </div>
  )
}
