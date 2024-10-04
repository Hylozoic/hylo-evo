import cx from 'classnames'
import React, { useState, useEffect, useMemo, useRef, useCallback, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { createSelector } from 'reselect'
import { debounce, get, groupBy, isEqual, isEmpty, pick, pickBy } from 'lodash'
import bbox from '@turf/bbox'
import bboxPolygon from '@turf/bbox-polygon'
import booleanWithin from '@turf/boolean-within'
import center from '@turf/center'
import combine from '@turf/combine'
import { featureCollection, point } from '@turf/helpers'
import isWebView from 'util/webView'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import LocationInput from 'components/LocationInput'
import Map from 'components/Map/Map'
import { createIconLayerFromPostsAndMembers } from 'components/Map/layers/clusterLayer'
import { createIconLayerFromGroups } from 'components/Map/layers/iconLayer'
import { createPolygonLayerFromGroups } from 'components/Map/layers/polygonLayer'
import SwitchStyled from 'components/SwitchStyled'
import Tooltip from 'components/Tooltip'
import LayoutFlagsContext from 'contexts/LayoutFlagsContext'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import { locationObjectToViewport } from 'util/geo'
import { isMobileDevice } from 'util/mobile'
import { generateViewParams } from 'util/savedSearch'
import { updateUserSettings } from 'routes/UserSettings/UserSettings.store'
import changeQuerystringParam, { changeQuerystringParams } from 'store/actions/changeQuerystringParam'
import { FETCH_FOR_GROUP } from 'store/constants'
import presentPost from 'store/presenters/presentPost'
import getGroupForSlug from 'store/selectors/getGroupForSlug'
import getMe from 'store/selectors/getMe'
import { personUrl, postUrl, groupDetailUrl, createUrl } from 'util/navigation'

import {
  fetchSavedSearches, deleteSearch, saveSearch, viewSavedSearch
} from '../UserSettings/UserSettings.store'

import {
  FEATURE_TYPES,
  FETCH_POSTS_MAP,
  FETCH_POSTS_MAP_DRAWER,
  fetchMembers,
  fetchPostsForDrawer,
  fetchPostsForMap,
  fetchGroups,
  formatBoundingBox,
  getCurrentTopics,
  getGroupsFilteredByTopics,
  getMembersFilteredByTopics,
  getSortedFilteredPostsForDrawer,
  getFilteredPostsForMap,
  storeClientFilterParams,
  updateState
} from './MapExplorer.store'

import MapDrawer from './MapDrawer'
import SavedSearches from './SavedSearches'

import classes from './MapExplorer.module.scss'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAP_BASE_LAYERS = [
  { id: 'light-v11', label: 'Basic (Light)' },
  { id: 'streets-v12', label: 'Streets' },
  { id: 'satellite-v9', label: 'Satellite' },
  { id: 'satellite-streets-v12', label: 'Satellite + Streets' }
]

export function presentMember (person, groupId) {
  return {
    ...pick(['id', 'name', 'avatarUrl', 'groupRoles', 'locationObject', 'tagline', 'skills'], person.ref),
    type: 'member',
    skills: person.skills.toModelArray(),
    group: person.memberships.first()
      ? person.memberships.first().group.name
      : null
  }
}

export function presentGroup (group) {
  return group.ref
}

function MapExplorer (props) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const routeParams = useParams()
  const layoutFlags = useContext(LayoutFlagsContext)

  const mapRef = useRef(null)

  const context = props.context
  const groupSlug = routeParams.groupSlug
  const group = useSelector(state => getGroupForSlug(state, groupSlug))
  const groupId = group?.id
  const queryGroupSlugs = getQuerystringParam('group', { location })
  const groupSlugs = group ? (queryGroupSlugs || []).concat(groupSlug) : queryGroupSlugs

  const currentUser = useSelector(state => getMe(state, { location }))
  const defaultChildPostInclusion = currentUser?.settings?.streamChildPosts || 'yes'
  const childPostInclusion = getQuerystringParam('c', { location }) || defaultChildPostInclusion

  const [hideDrawer, setHideDrawer] = useState(getQuerystringParam('hideDrawer', { location }) === 'true')
  console.log('hideDrawer mapexplorer', hideDrawer)
  const queryParams = getQuerystringParam(['search', 'sortBy', 'hide', 'topics', 'group'], { location })

  const reduxState = useSelector(state => state.MapExplorer)

  const totalBoundingBoxLoaded = reduxState.totalBoundingBoxLoaded

  const fetchPostsParams = {
    childPostInclusion,
    boundingBox: totalBoundingBoxLoaded,
    context,
    slug: groupSlug,
    groupSlugs
  }

  const topicsFromPosts = useSelector(state => getCurrentTopics(state, fetchPostsParams))

  const filters = useMemo(() => ({
    ...reduxState.clientFilterParams,
    ...pick(['search', 'sortBy'], queryParams)
  }), [reduxState.clientFilterParams, queryParams])

  if (queryParams.hide) {
    filters.featureTypes = Object.keys(filters.featureTypes).reduce((types, type) => { types[type] = !queryParams.hide.includes(type); return types }, {})
  }

  if (queryParams.topics) {
    filters.topics = topicsFromPosts.filter(t => queryParams.topics.includes(t.id))
  }

  const fetchPostsForDrawerParams = {
    childPostInclusion,
    context,
    slug: groupSlug,
    groupSlugs,
    ...filters,
    types: !isEmpty(filters.featureTypes) ? Object.keys(filters.featureTypes).filter(ft => filters.featureTypes[ft]) : null,
    currentBoundingBox: filters.currentBoundingBox || totalBoundingBoxLoaded
  }

  const fetchGroupParams = {
    boundingBox: totalBoundingBoxLoaded,
    context,
    parentSlugs: groupSlugs
  }

  const fetchMemberParams = {
    boundingBox: totalBoundingBoxLoaded,
    context,
    slug: groupSlug,
    sortBy: 'name'
  }

  const members = useSelector(
    createSelector(
      (state) => getMembersFilteredByTopics(state, fetchMemberParams),
      (members) => members.map(m => presentMember(m, groupId))
    )
  )
  const postsForDrawer = useSelector(
    createSelector(
      (state) => getSortedFilteredPostsForDrawer(state, fetchPostsForDrawerParams),
      (posts) => posts.map(p => presentPost(p, groupId))
    )
  )
  const postsForMap = useSelector(
    createSelector(
      (state) => getFilteredPostsForMap(state, fetchPostsParams),
      (posts) => posts.map(p => presentPost(p, groupId))
    )
  )
  const groups = useSelector(
    createSelector(
      (state) => getGroupsFilteredByTopics(state, fetchGroupParams),
      (groups) => groups.map(g => presentGroup(g))
    )
  )

  const centerParam = getQuerystringParam('center', { location })
  let centerLocation = useMemo(() => {
    if (centerParam) {
      const decodedCenter = decodeURIComponent(centerParam).split(',')
      return { lat: decodedCenter[0], lng: decodedCenter[1] }
    } else {
      return reduxState.centerLocation ||
        group?.locationObject?.center ||
        currentUser?.locationObject?.center ||
        null
    }
  }, [centerParam, reduxState.centerLocation, group?.locationObject?.center, currentUser?.locationObject?.center])

  let defaultZoom
  if (centerLocation) {
    centerLocation = { lat: parseFloat(centerLocation.lat), lng: parseFloat(centerLocation.lng) }
    defaultZoom = 10
  } else {
    centerLocation = { lat: 35.442845, lng: 7.916598 }
    defaultZoom = 0
  }

  const zoomParam = getQuerystringParam('zoom', { location })
  const zoom = zoomParam ? parseFloat(zoomParam) : reduxState.zoom || defaultZoom

  const baseStyleParam = getQuerystringParam('style', { location })
  const [baseLayerStyle, setBaseLayerStyle] = useState(baseStyleParam || reduxState.baseLayerStyle || currentUser?.settings?.mapBaseLayer || 'light-v11')
  if (!MAP_BASE_LAYERS.find(o => o.id === baseLayerStyle)) {
    setBaseLayerStyle('light-v11')
  }

  const possibleFeatureTypes = context === 'public'
    ? ['discussion', 'request', 'offer', 'resource', 'project', 'proposal', 'event', 'group']
    : ['discussion', 'request', 'offer', 'resource', 'project', 'proposal', 'event', 'member', 'group']

  const groupPending = useSelector(state => state.pending[FETCH_FOR_GROUP])
  const pendingPostsMap = useSelector(state => state.pending[FETCH_POSTS_MAP])
  const pendingPostsDrawer = useSelector(state => state.pending[FETCH_POSTS_MAP_DRAWER])
  const selectedSearch = useSelector(state => state.SavedSearches.selectedSearch) // TODO: need this?

  const [clusterLayer, setClusterLayer] = useState(null)
  const [currentBoundingBox, setCurrentBoundingBox] = useState(null)
  const [groupIconLayer, setGroupIconLayer] = useState(null)
  const [polygonLayer, setPolygonLayer] = useState(null)
  const [hoveredObject, setHoveredObject] = useState(null)
  const [creatingPost, setCreatingPost] = useState(false)
  // const [coordinates, setCoordinates] = useState(null)
  const [isAddingItemToMap, setIsAddingItemToMap] = useState(false)
  const [pointerCoords, setPointerCoords] = useState([0, 0])
  const [groupsForDrawer, setGroupsForDrawer] = useState(groups || [])
  const [membersForDrawer, setMembersForDrawer] = useState(members || [])
  const [otherLayers, setOtherLayers] = useState({})
  // const [selectedObject, setSelectedObject] = useState(null)
  const [showFeatureFilters, setShowFeatureFilters] = useState(false)
  const [showLayersSelector, setShowLayersSelector] = useState(false)
  const [totalPostsInView, setTotalPostsInView] = useState(postsForMap.length || 0)
  const [showSavedSearches, setShowSavedSearches] = useState(false)

  const [viewport, setViewport] = useState({
    width: 800,
    height: 600,
    latitude: parseFloat(centerLocation.lat),
    longitude: parseFloat(centerLocation.lng),
    zoom,
    bearing: 0,
    pitch: 0
  })

  const updateUrlFromStore = useCallback((params, replace) => {
    const querystringParams = getQuerystringParam(['sortBy', 'search', 'hide', 'topics'], { location })
    console.log('updateUrlFromStore', params)

    let newQueryParams = { ...pick(['search', 'sortBy'], params) }
    if (params.featureTypes) {
      newQueryParams.hide = Object.keys(params.featureTypes).filter(type => !params.featureTypes[type])
    }
    if (params.topics) {
      newQueryParams.topics = params.topics.map(t => t.id)
    }
    newQueryParams = pickBy((val, key) => {
      return !isEqual(val, querystringParams[key])
    }, newQueryParams)

    if (!isEmpty(newQueryParams)) {
      dispatch(changeQuerystringParams({ location }, newQueryParams, replace))
    }
  }, [dispatch, location])

  const changeChildPostInclusion = useCallback(childPostsBool => {
    dispatch(updateUserSettings({ settings: { streamChildPosts: childPostsBool } }))
    return dispatch(changeQuerystringParam({ location }, 'c', childPostsBool, 'yes'))
  }, [dispatch, location])

  const doFetchPostsForDrawer = useCallback((offset = 0, replace = true) => dispatch(fetchPostsForDrawer({ ...fetchPostsForDrawerParams, offset, replace })), [dispatch])
  const doFetchSavedSearches = useCallback(() => dispatch(fetchSavedSearches(currentUser.id)), [currentUser.id, dispatch])
  const handleDeleteSearch = useCallback((searchId) => dispatch(deleteSearch(searchId)), [dispatch])

  const handleSaveSearch = useCallback((name) => {
    const { featureTypes, search: searchText, topics } = filters

    const postTypes = Object.keys(featureTypes).reduce((selected, type) => {
      if (featureTypes[type]) selected.push(type)
      return selected
    }, [])

    const topicIds = topics.map(t => t.id)

    const boundingBox = [
      { lat: currentBoundingBox[1], lng: currentBoundingBox[0] },
      { lat: currentBoundingBox[3], lng: currentBoundingBox[2] }
    ]

    const attributes = { boundingBox, groupSlug, context, name, postTypes, searchText, topicIds, userId: currentUser.id }

    dispatch(saveSearch(attributes))
  }, [context, currentBoundingBox, currentUser.id, dispatch, filters, groupSlug])

  const showDetails = useCallback((postId) => dispatch(navigate(postUrl(postId, { ...routeParams, view: 'map' }, getQuerystringParam(['hideDrawer', 't', 'group'], { location })))), [dispatch, navigate, routeParams, location])

  const showGroupDetails = useCallback((groupSlug) => dispatch(navigate(groupDetailUrl(groupSlug, { ...routeParams, view: 'map' }, getQuerystringParam(['hideDrawer', 't', 'group'], { location })))), [dispatch, navigate, routeParams, location])

  const showCreateModal = useCallback((location) => dispatch(navigate(createUrl(routeParams, location))), [dispatch, navigate, routeParams])

  const gotoMember = useCallback((memberId) => dispatch(navigate(personUrl(memberId, groupSlug))), [dispatch, groupSlug, navigate])

  const toggleDrawer = useCallback(() => {
    dispatch(changeQuerystringParam({ location }, 'hideDrawer', !hideDrawer))
    console.log('toggleDrawer', !hideDrawer)
    setHideDrawer(!hideDrawer)
  }, [dispatch, hideDrawer, location])

  const doStoreClientFilterParams = useCallback(params => {
    console.log('doStoreClientFilterParams', params)
    return dispatch(storeClientFilterParams(params)).then(() => {
      updateUrlFromStore(params, true)
    })
  }, [dispatch, updateUrlFromStore])

  const updateBaseLayerStyle = useCallback((style) => {
    if (currentUser) {
      dispatch(updateUserSettings({ settings: { mapBaseLayer: style } }))
    }
    dispatch(changeQuerystringParams({ location }, { style }, true))
    setBaseLayerStyle(style)
  }, [dispatch, currentUser, location])

  const updateBoundingBox = useCallback(bbox => dispatch(updateState({ totalBoundingBoxLoaded: bbox })), [dispatch])

  const updateQueryParams = useCallback((params, replace) => updateUrlFromStore(params, replace), [updateUrlFromStore])

  const updateView = useCallback(({ centerLocation, zoom }) => {
    console.log('updateView', centerLocation, zoom)
    const newUrlParams = {
      zoom
    }
    newUrlParams.center = encodeURIComponent(centerLocation.lat + ',' + centerLocation.lng)
    dispatch(updateState({ centerLocation, zoom })).then(() => dispatch(changeQuerystringParams({ location }, newUrlParams, true)))
  }, [dispatch, location])

  const handleViewSavedSearch = useCallback((search) => {
    const { mapPath } = generateViewParams(search)
    dispatch(viewSavedSearch(search))
    dispatch(navigate(mapPath))
  }, [dispatch, navigate])

  const onMapHover = useCallback((info) => {
    setHoveredObject(info.objects || info.object)
    setPointerCoords([info.x, info.y])
  }, [setHoveredObject, setPointerCoords])

  const onMapClick = useCallback((info, e) => {
    if (info.objects) {
      if (viewport.zoom >= 20 && hideDrawer) {
        setHideDrawer(false)
      } else {
        const features = featureCollection(info.objects.map(o => point([o.coordinates[0], o.coordinates[1]])))
        const c = center(features)

        setViewport({
          ...viewport,
          longitude: c.geometry.coordinates[0],
          latitude: c.geometry.coordinates[1],
          zoom: Math.max(viewport.zoom, info.expansionZoom)
        })

        mapRef.current.flyTo({
          center: [c.geometry.coordinates[0], c.geometry.coordinates[1]],
          zoom: Math.max(viewport.zoom, info.expansionZoom),
          duration: 500,
          essential: true
        })
      }
    } else {
      // setSelectedObject(info.object)
      if (info.object.type === 'member') {
        gotoMember(info.object.id)
      } else if (info.object.type === 'group') {
        showGroupDetails(info.object.slug)
      } else {
        showDetails(info.object.id)
      }
    }
  }, [gotoMember, hideDrawer, showDetails, showGroupDetails, viewport])

  const onMapMouseDown = useCallback((e) => {
    const oneSecondInMs = 1000
    setCreatingPost(true)
    setTimeout(() => {
      if (creatingPost) {
        const newCoordinates = { lng: e.lngLat[0], lat: e.lngLat[1] }
        // setCoordinates(newCoordinates)
        const currentParams = Object.fromEntries(new URLSearchParams(location.search))
        showCreateModal({ ...currentParams, ...newCoordinates })
      }
    }, isAddingItemToMap ? 0 : oneSecondInMs)
  }, [isAddingItemToMap, creatingPost, location.search, showCreateModal])

  const onMapMouseUp = useCallback(() => {
    if (creatingPost) {
      setCreatingPost(false)
      setIsAddingItemToMap(false)
    }
  }, [creatingPost])

  const updatedMapFeatures = useCallback((boundingBox) => {
    console.log('updatedMapFeatures', boundingBox)
    const bbox = bboxPolygon(boundingBox)
    const viewMembers = members.filter(member => {
      const locationObject = member.locationObject
      if (locationObject && locationObject.center) {
        const centerPoint = point([locationObject.center.lng, locationObject.center.lat])
        return booleanWithin(centerPoint, bbox)
      }
      return false
    })
    const viewPosts = postsForMap.filter(post => {
      const locationObject = post.locationObject
      if (locationObject && locationObject.center) {
        const centerPoint = point([locationObject.center.lng, locationObject.center.lat])
        return booleanWithin(centerPoint, bbox)
      }
      return false
    })
    const viewGroups = groups.filter(group => {
      const locationObject = group.locationObject
      if (group.geoShape) {
        const coords = group.geoShape.coordinates[0]
        const outOfBounds = []
        coords.forEach((coord, i) => {
          if (!booleanWithin(point(coord), bbox)) {
            outOfBounds.push(i)
          }
        })
        return outOfBounds.length < coords.length
      }
      if (locationObject && locationObject.center) {
        const centerPoint = point([locationObject.center.lng, locationObject.center.lat])
        return booleanWithin(centerPoint, bbox)
      }
      return false
    }).concat(get(group, 'locationObject.center') || get(group, 'geoShape') ? group : [])

    setClusterLayer(createIconLayerFromPostsAndMembers({
      members: viewMembers,
      posts: viewPosts,
      onHover: onMapHover,
      onClick: onMapClick,
      boundingBox
    }))

    setGroupIconLayer(createIconLayerFromGroups({
      groups: viewGroups,
      onHover: onMapHover,
      onClick: onMapClick,
      boundingBox
    }))

    setPolygonLayer(context !== 'public' && createPolygonLayerFromGroups({
      groups: viewGroups,
      onHover: onMapHover,
      boundingBox
    }))

    setCurrentBoundingBox(boundingBox)
    setGroupsForDrawer(viewGroups)
    setMembersForDrawer(viewMembers)
    setTotalPostsInView(viewPosts.length)
  }, [members, postsForMap, groups, group, onMapHover, onMapClick, context])

  const updateViewportWithBbox = useCallback((bbox) => {
    console.log('updateViewportWithBbox', bbox)
    setViewport(locationObjectToViewport(viewport, { bbox }))
  }, [viewport])

  useEffect(() => {
    if (!groupPending && centerLocation) {
      console.log('useEffect !groupPending && centerLocation')
      setViewport({
        ...viewport,
        latitude: centerLocation.lat,
        longitude: centerLocation.lng,
        zoom
      })
    }
  }, [groupPending])

  /* Lifecycle methods */
  useEffect(() => {
    console.log('useEffect first time is mobile')
    if (isMobileDevice()) {
      setHideDrawer(true)
    }

    doFetchSavedSearches()

    const missingInUrl = {}
    const missingInState = {}
    Object.keys(reduxState.clientFilterParams).forEach(key => {
      if (isEmpty(queryParams[key])) {
        missingInUrl[key] = filters[key]
      } else if (!isEqual(reduxState.clientFilterParams[key], filters[key])) {
        missingInState[key] = filters[key]
      }
    })
    if (!isEmpty(missingInUrl)) {
      updateQueryParams(missingInUrl, true)
    }
    if (!isEmpty(missingInState)) {
      doStoreClientFilterParams(missingInState)
    }
  }, [])

  useEffect(() => {
    console.log('useEffect totalBoundingBoxLoaded', totalBoundingBoxLoaded)
    if (totalBoundingBoxLoaded) {
      doFetchPostsForDrawer()
      dispatch(fetchMembers({ ...fetchMemberParams }))
      dispatch(fetchPostsForMap({ ...fetchPostsParams }))
      dispatch(fetchGroups({ ...fetchGroupParams }))
    }
  }, [totalBoundingBoxLoaded])

  useEffect(() => {
    if (currentBoundingBox) {
      console.log('useEffect currentBoundingBox')
      updatedMapFeatures(currentBoundingBox)
    }
  }, [currentBoundingBox])

  useEffect(() => {
    if (selectedSearch) {
      console.log('useEffect selectedSearch')
      const { boundingBox, featureTypes, searchText, topics } = generateViewParams(selectedSearch)
      // updateQueryParams({ boundingBox, featureTypes, search: searchText, topics })
      updateBoundingBoxQuery(boundingBox)
      doStoreClientFilterParams({ featureTypes, search: searchText, topics })
      updateViewportWithBbox(formatBoundingBox(boundingBox))
    }
  }, [selectedSearch])

  const handleLocationInputSelection = useCallback((value) => {
    if (value.mapboxId) {
      value.bbox
        ? updateViewportWithBbox(value.bbox)
        : setViewport({ ...viewport, latitude: value.center.lat, longitude: value.center.lng, zoom: 12 })
    }
  }, [updateViewportWithBbox, viewport])

  // const mapViewPortUpdate = useCallback((update) => {
  //   setViewport(update)
  //   setCreatingPost(false)
  // }, [])

  const updateBoundingBoxQuery = debounce((newBoundingBox) => {
    let finalBbox
    console.log('updateBoundingBoxQuery', newBoundingBox)
    if (totalBoundingBoxLoaded) {
      const curBbox = bboxPolygon(totalBoundingBoxLoaded)
      const newBbox = bboxPolygon(newBoundingBox)
      const fc = featureCollection([curBbox, newBbox])
      const combined = combine(fc)
      finalBbox = bbox(combined)
    } else {
      finalBbox = newBoundingBox
    }

    if (!isEqual(finalBbox, totalBoundingBoxLoaded)) {
      updateBoundingBox(finalBbox)
    }

    if (!isEqual(filters.currentBoundingBox, newBoundingBox)) {
      doStoreClientFilterParams({ currentBoundingBox: newBoundingBox })
    }

    updatedMapFeatures(newBoundingBox)
  }, 200)

  const afterViewportUpdate = useCallback((update) => {
    console.log('afterViewportUpdate', update)
    if (mapRef.current) {
      let bounds = mapRef.current.getBounds()
      bounds = [bounds._sw.lng, bounds._sw.lat, bounds._ne.lng, bounds._ne.lat]
      updateBoundingBoxQuery(bounds)
      const newCenter = { lat: update.latitude, lng: update.longitude }
      if (!isEqual(centerLocation, newCenter) || !isEqual(zoom, update.zoom)) {
        updateView({ centerLocation: newCenter, zoom: update.zoom })
      }
    }
  }, [updateBoundingBoxQuery, centerLocation, zoom, updateView])

  const toggleFeatureType = useCallback((type, checked) => {
    const newFeatureTypes = { ...filters.featureTypes }
    newFeatureTypes[type] = checked
    doStoreClientFilterParams({ featureTypes: newFeatureTypes })
  }, [doStoreClientFilterParams, filters.featureTypes])

  const renderTooltip = useCallback(() => {
    if (hoveredObject) {
      let message
      let type
      if (Array.isArray(hoveredObject) && hoveredObject.length > 0) {
        const types = groupBy(hoveredObject, 'type')
        message = Object.keys(types).map(type => <p key={type}>{types[type].length} {type}{types[type].length === 1 ? '' : 's'}</p>)
        type = 'cluster'
      } else {
        message = hoveredObject.message
        type = hoveredObject.type
      }

      return (
        <div className={cx(classes.postTip, classes[type])} style={{ left: pointerCoords[0] + 15, top: pointerCoords[1] }}>
          {message}
        </div>
      )
    }
    return ''
  }, [hoveredObject, pointerCoords])

  const toggleMapLayer = useCallback((layer) => {
    const newLayers = { ...otherLayers }
    if (otherLayers[layer]) {
      delete newLayers[layer]
    } else {
      switch (layer) {
        case 'native_territories':
          newLayers[layer] = true
          break
      }
    }
    setOtherLayers(newLayers)
  }, [otherLayers])

  const handleAddItemToMap = useCallback(() => {
    setIsAddingItemToMap(!isAddingItemToMap)
  }, [isAddingItemToMap])

  const toggleFeatureFilters = useCallback(() => {
    setShowFeatureFilters(!showFeatureFilters)
  }, [showFeatureFilters])

  const toggleLayersSelector = useCallback(() => {
    setShowLayersSelector(!showLayersSelector)
  }, [showLayersSelector])

  const toggleSavedSearches = useCallback(() => {
    setShowSavedSearches(!showSavedSearches)
  }, [showSavedSearches])

  const { hideNavLayout } = layoutFlags
  const withoutNav = isWebView() || hideNavLayout

  const locationParams = location !== undefined ? getQuerystringParam(['zoom', 'center', 'lat', 'lng'], { location }) : null

  return (
    <div className={cx(classes.container, { [classes.noUser]: !currentUser, [classes.withoutNav]: withoutNav })}>
      <Helmet>
        <title>Map | {group ? `${group.name} | ` : context === 'public' ? 'Public | ' : ' All My Groups | '}Hylo</title>
      </Helmet>

      <div className={classes.mapContainer}>
        <Map
          afterViewportUpdate={afterViewportUpdate}
          baseLayerStyle={baseLayerStyle}
          hyloLayers={[polygonLayer, groupIconLayer, clusterLayer]}
          isAddingItemToMap={isAddingItemToMap}
          otherLayers={Object.keys(otherLayers)}
          mapRef={mapRef}
          onMouseDown={onMapMouseDown}
          onMouseUp={onMapMouseUp}
          setViewport={setViewport}
          viewport={viewport}
        >
          {renderTooltip()}
        </Map>
        {pendingPostsMap && <Loading className={classes.loading} />}
      </div>
      <button
        data-tooltip-id='helpTip'
        data-tooltip-content={hideDrawer ? t('Open Drawer') : t('Close Drawer')}
        className={cx(classes.toggleDrawerButton, classes.drawerAdjacentButton, { [classes.drawerOpen]: !hideDrawer })}
        onClick={toggleDrawer}
      >
        <Icon name='Hamburger' className={classes.openDrawer} />
        <Icon name='Ex' className={classes.closeDrawer} />
      </button>
      {!hideDrawer && (
        <MapDrawer
          changeChildPostInclusion={changeChildPostInclusion}
          childPostInclusion={childPostInclusion}
          context={context}
          locationParams={locationParams}
          currentUser={currentUser}
          fetchPostsForDrawer={doFetchPostsForDrawer}
          filters={filters}
          group={group}
          groups={groupsForDrawer}
          members={membersForDrawer}
          numFetchedPosts={postsForDrawer.length}
          numTotalPosts={totalPostsInView}
          onUpdateFilters={doStoreClientFilterParams}
          pendingPostsDrawer={pendingPostsDrawer}
          posts={postsForDrawer}
          queryParams={queryParams}
          routeParams={routeParams}
          topics={filters.topics}
        />
      )}
      <div className={classes.searchAutocomplete}>
        <LocationInput saveLocationToDB={false} onChange={handleLocationInputSelection} />
      </div>
      <button className={cx(classes.toggleFeatureFiltersButton, { [classes.open]: showFeatureFilters, [classes.withoutNav]: withoutNav })} onClick={toggleFeatureFilters}>
        {t('Features:')} <strong>{possibleFeatureTypes.filter(t => filters.featureTypes[t]).length}/{possibleFeatureTypes.length}</strong>
      </button>

      {currentUser && (
        <>
          <Icon
            name='Heart'
            onClick={toggleSavedSearches}
            className={cx(classes.savedSearchesButton, { [classes.open]: showSavedSearches })}
          />
          {showSavedSearches && (
            <SavedSearches
              deleteSearch={handleDeleteSearch}
              filters={filters}
              saveSearch={handleSaveSearch}
              searches={reduxState.searches}
              toggle={toggleSavedSearches}
              viewSavedSearch={handleViewSavedSearch}
            />
          )}
        </>
      )}

      <div className={cx(classes.featureTypeFilters, { [classes.open]: showFeatureFilters, [classes.withoutNav]: withoutNav })}>
        <h3>{t('What do you want to see on the map?')}</h3>
        {possibleFeatureTypes.map(featureType => {
          const color = FEATURE_TYPES[featureType].primaryColor
          return (
            <div
              key={featureType}
              className={classes.featureTypeSwitch}
            >
              <SwitchStyled
                backgroundColor={`rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`}
                name={featureType}
                checked={filters.featureTypes[featureType]}
                onChange={(checked, name) => toggleFeatureType(name, !checked)}
              />
              <span>{featureType.charAt(0).toUpperCase() + featureType.slice(1)}s</span>
            </div>
          )
        })}
        <div className={classes.pointer} />
      </div>

      <button
        data-tooltip-id='helpTip'
        data-tooltip-content={showLayersSelector ? null : t('Change Map Layers')}
        onClick={toggleLayersSelector}
        className={cx(classes.toggleLayersSelectorButton, classes.drawerAdjacentButton, { [classes.open]: showLayersSelector, [classes.withoutNav]: withoutNav, [classes.drawerOpen]: !hideDrawer })}
      >
        <Icon name='Stack' />
      </button>
      <div className={cx(classes.layersSelectorContainer, { [classes.open]: showLayersSelector, [classes.withoutNav]: withoutNav, [classes.drawerOpen]: !hideDrawer })}>
        <h3>{t('Base Layer:')}
          <Dropdown
            className={classes.layersDropdown}
            menuAbove
            toggleChildren={(
              <span className={classes.layersDropdownLabel}>
                {MAP_BASE_LAYERS.find(o => o.id === baseLayerStyle).label}
                <Icon name='ArrowDown' />
              </span>
            )}
            items={MAP_BASE_LAYERS.map(({ id, label }) => ({
              label,
              onClick: () => updateBaseLayerStyle(id)
            }))}
          />
        </h3>

        <h3 className={classes.layersHeader}>{t('Other Layers')}</h3>
        <div className={classes.layersList}>
          <SwitchStyled
            backgroundColor='rgb(0, 163, 227)'
            name={t('Native Territories')}
            checked={!!otherLayers.native_territories}
            onChange={(checked, name) => toggleMapLayer('native_territories')}
          />
          <span className={classes.layerLabel}>
            {t('Native Territories')}
            <a href='https://native-land.ca' target='__blank'>
              <Icon name='Info' tooltipContent='Credit to native-land.ca' tooltipId='helpTipTwo' />
            </a>
          </span>
        </div>

        <div className={classes.pointer} />
      </div>

      {currentUser && (
        <button
          data-tooltip-id='helpTip'
          data-tooltip-content='Add item to map'
          className={cx(classes.addItemToMapButton, classes.drawerAdjacentButton, { [classes.active]: isAddingItemToMap, [classes.drawerOpen]: !hideDrawer })}
          onClick={handleAddItemToMap}
        >
          <Icon name='Plus' className={cx({ [classes.openDrawer]: !hideDrawer, [classes.closeDrawer]: hideDrawer })} />
        </button>
      )}
      <Tooltip
        delay={550}
        id='helpTip'
        position='left'
      />
      <Tooltip
        delay={550}
        id='helpTipTwo'
        position='bottom'
        className={classes.helpTipTwo}
      />
    </div>
  )
}

export default MapExplorer
