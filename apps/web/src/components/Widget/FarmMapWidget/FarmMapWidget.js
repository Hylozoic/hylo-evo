import cx from 'classnames'
import { groupBy } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Map from 'components/Map'
import { createIconLayerFromPostsAndMembers } from 'components/Map/layers/clusterLayer'
import { createIconLayerFromGroups } from 'components/Map/layers/iconLayer'
import useEnsureSearchedGroups from 'hooks/useEnsureSearchedGroups'

import classes from './FarmMap.module.scss'

export default function FarmMapWidget ({ group, items }) {
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
  const { navigate } = useNavigate()
  const [viewport, setViewport] = useState(defaultViewport)
  const [groupIconLayer, setGroupIconLayer] = useState(null)
  const [postsLayer, setPostsLayer] = useState([])
  const [pointerX, setPointerX] = useState(null)
  const [pointerY, setPointerY] = useState(null)
  const [hoveredObject, setHoveredObject] = useState(null)
  const { groups } = useEnsureSearchedGroups({ sortBy: 'nearest', nearCoord: coord, groupType: 'farm' })

  const onMapHover = (info) => {
    setHoveredObject(info.objects || info.object)
    setPointerX(info.x)
    setPointerY(info.y)
  }

  const onMapClick = (info) => {
    if (info.object && info.object.type === 'group') {
      navigate(`/groups/${info.object.slug}`)
    } else if (info.object && info.object.id) {
      navigate(`/groups/${info.object.slug}/post/${info.object.id}`)
    }
  }

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
      }

      return (
        <div className={cx(classes.postTip, type)} style={{ left: pointerX + 15, top: pointerY }}>
          {message}
        </div>
      )
    }
    return ''
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

  return (
    <div className={classes.farmMapContainer}>
      <Map
        hyloLayers={[groupIconLayer, postsLayer]}
        children={_renderTooltip()}
        viewport={viewport}
        onViewportUpdate={setViewport}
      />
    </div>
  )
}
