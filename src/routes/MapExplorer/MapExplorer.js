import React from 'react'
import { useHistory } from 'react-router-dom'
import { debounce, get, groupBy, isEqual, isEmpty } from 'lodash'
import cx from 'classnames'
import bbox from '@turf/bbox'
import bboxPolygon from '@turf/bbox-polygon'
import booleanWithin from '@turf/boolean-within'
import center from '@turf/center'
import combine from '@turf/combine'
import { featureCollection, point } from '@turf/helpers'
import { FlyToInterpolator } from 'react-map-gl'

import { isMobileDevice } from 'util/mobile'
import LayoutFlagsContext from 'contexts/LayoutFlagsContext'
import { generateViewParams } from 'util/savedSearch'
import { locationObjectToViewport } from 'util/geo'
import { FEATURE_TYPES, formatBoundingBox } from './MapExplorer.store'
import { createIconLayerFromPostsAndMembers } from 'components/Map/layers/clusterLayer'
import { createIconLayerFromGroups } from 'components/Map/layers/iconLayer'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import Map from 'components/Map/Map'
import Tooltip from 'components/Tooltip'
import MapDrawer from './MapDrawer'
import SavedSearches from './SavedSearches'
import SwitchStyled from 'components/SwitchStyled'
import LocationInput from 'components/LocationInput'
import getQuerystringParam from 'store/selectors/getQuerystringParam'

import styles from './MapExplorer.scss'
import 'mapbox-gl/dist/mapbox-gl.css'

export class UnwrappedMapExplorer extends React.Component {
  static defaultProps = {
    centerLocation: { lat: 35.442845, lng: 7.916598 },
    filters: {},
    members: [],
    postsForDrawer: [],
    postsForMap: [],
    groups: [],
    routeParams: {},
    hideDrawer: false,
    topics: [],
    zoom: 0
  }

  static contextType = LayoutFlagsContext

  constructor (props) {
    super(props)

    const defaultViewport = {
      width: 800,
      height: 600,
      latitude: parseFloat(props.centerLocation.lat),
      longitude: parseFloat(props.centerLocation.lng),
      zoom: props.zoom,
      bearing: 0,
      pitch: 0
    }

    this.state = {
      clusterLayer: null,
      currentBoundingBox: null,
      groupIconLayer: null,
      hideDrawer: props.hideDrawer,
      hoveredObject: null,
      creatingPost: false,
      coordinates: null,
      isAddingItemToMap: false,
      pointerX: 0,
      pointerY: 0,
      // Need this in the state so we can filter them by currentBoundingBox
      groupsForDrawer: props.groups || [],
      membersForDrawer: props.members || [],
      selectedObject: null,
      showFeatureFilters: false,
      totalPostsInView: get(props, 'postsForMap.length') || 0,
      viewport: defaultViewport
    }
  }

  componentDidMount () {
    this.refs = {}

    // Drawer hidden by default on mobile devices
    if (isMobileDevice()) {
      this.setState({ hideDrawer: true })
    }

    // Relinquishes route handling within the Map entirely to Mobile App
    // e.g. react router / history push
    const { mobileSettingsLayout } = this.context
    if (mobileSettingsLayout) {
      this.props.history.block(tx => {
        const path = tx.pathname
        // when in embedded view of map allow web navigation within map
        // the keeps saved search retrieval from reseting group context in the app
        if (path.match(/\/map$/)) return true
        // url will be deprecated for path
        const messageData = { path, url: path }
        window.ReactNativeWebView.postMessage(JSON.stringify(messageData))
        return false
      })
    }

    Object.keys(FEATURE_TYPES).forEach(featureType => {
      this.refs[featureType] = React.createRef()
    })

    this.props.fetchSavedSearches()

    if (this.props.selectedSearch) {
      this.updateSavedSearch(this.props.selectedSearch)
    }

    if (get(this.props, 'fetchPostsParams.boundingBox')) {
      this.props.fetchPostsForDrawer()
      this.props.fetchMembers()
      this.props.fetchPostsForMap()
      this.props.fetchGroups()
    }

    const { filters, queryParams } = this.props

    // Sync up the values in the state and the URL
    const missingInUrl = {}
    const missingInState = {}
    Object.keys(this.props.stateFilters).forEach(key => {
      if (isEmpty(queryParams[key])) {
        missingInUrl[key] = filters[key]
      } else if (!isEqual(this.props.stateFilters[key], filters[key])) {
        missingInState[key] = filters[key]
      }
    })
    if (!isEmpty(missingInUrl)) {
      this.props.updateQueryParams(missingInUrl, true)
    }
    if (!isEmpty(missingInState)) {
      this.props.storeClientFilterParams(missingInState)
    }
  }

  componentDidUpdate (prevProps) {
    if (!prevProps) return

    const {
      centerLocation,
      fetchGroups,
      fetchGroupParams,
      fetchMembers,
      fetchMemberParams,
      fetchPostsForDrawer,
      fetchPostsForDrawerParams,
      fetchPostsForMap,
      fetchPostsParams,
      groupPending,
      groups,
      members,
      postsForMap,
      zoom
    } = this.props

    // When group finishes loading we may want to move the map to the group's location
    if (prevProps.groupPending !== groupPending && centerLocation && !isEqual(prevProps.centerLocation, centerLocation)) {
      this.setState({ viewport: { ...this.state.viewport, latitude: centerLocation.lat, longitude: centerLocation.lng, zoom } })
    }

    if (!isEqual(prevProps.fetchPostsParams, fetchPostsParams)) {
      fetchPostsForMap()
    }
    if (!isEqual(prevProps.fetchPostsForDrawerParams, fetchPostsForDrawerParams)) {
      fetchPostsForDrawer()
    }
    if (!isEqual(prevProps.fetchGroupParams, fetchGroupParams)) {
      fetchGroups()
    }
    if (!isEqual(prevProps.fetchMemberParams, fetchMemberParams)) {
      fetchMembers()
    }

    const { currentBoundingBox } = this.state
    if (currentBoundingBox && (
      !isEqual(prevProps.postsForMap, postsForMap) ||
        !isEqual(prevProps.members, members) ||
         !isEqual(prevProps.groups, groups))) {
      this.setState(this.updatedMapFeatures(currentBoundingBox))
    }

    if (prevProps.selectedSearch !== this.props.selectedSearch) {
      this.updateSavedSearch(this.props.selectedSearch)
    }
  }

  updateSavedSearch (search) {
    const { boundingBox, featureTypes, searchText, topics } = generateViewParams(search)
    this.updateBoundingBoxQuery(boundingBox)
    this.props.storeClientFilterParams({ featureTypes, search: searchText, topics })
    this.updateViewportWithBbox(formatBoundingBox(boundingBox))
  }

  updatedMapFeatures (boundingBox) {
    const {
      group,
      groups,
      members,
      postsForMap
    } = this.props

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
      if (locationObject && locationObject.center) {
        const centerPoint = point([locationObject.center.lng, locationObject.center.lat])
        return booleanWithin(centerPoint, bbox)
      }
      return false
    }).concat(get(group, 'locationObject.center') ? group : [])

    // TODO: update the existing layers instead of creating a new ones?
    return {
      clusterLayer: createIconLayerFromPostsAndMembers({
        members: viewMembers,
        posts: viewPosts,
        onHover: this.onMapHover,
        onClick: this.onMapClick,
        boundingBox: boundingBox
      }),
      groupIconLayer: createIconLayerFromGroups({
        groups: viewGroups,
        onHover: this.onMapHover,
        onClick: this.onMapClick,
        boundingBox: boundingBox
      }),
      currentBoundingBox: boundingBox,
      groupsForDrawer: viewGroups,
      membersForDrawer: viewMembers,
      totalPostsInView: viewPosts.length
    }
  }

  handleLocationInputSelection = (value) => {
    if (value.mapboxId) {
      // If a bounding box area then show the whole area
      value.bbox ? this.updateViewportWithBbox(value.bbox)
        // If a specific location without a bounding box zoom to it
        : this.setState({ viewport: { ...this.state.viewport, latitude: value.center.lat, longitude: value.center.lng, zoom: 12 } })
    }
  }

  updateViewportWithBbox = (bbox) => {
    this.setState({ viewport: locationObjectToViewport(this.state.viewport, { bbox }) })
  }

  mapViewPortUpdate = (update) => {
    this.setState({ viewport: update, creatingPost: false })
  }

  afterViewportUpdate = (update, mapRef) => {
    if (mapRef) {
      let bounds = mapRef.getBounds()
      bounds = [bounds._sw.lng, bounds._sw.lat, bounds._ne.lng, bounds._ne.lat]
      this.updateBoundingBoxQuery(bounds)
      const newCenter = { lat: update.latitude, lng: update.longitude }
      if (!isEqual(this.props.centerLocation, newCenter) || !isEqual(this.props.zoom, update.zoom)) {
        this.updateView({ centerLocation: newCenter, zoom: update.zoom })
      }
    }
  }

  updateBoundingBoxQuery = debounce((newBoundingBox) => {
    let finalBbox
    const { totalBoundingBoxLoaded } = this.props
    if (totalBoundingBoxLoaded) {
      const curBbox = bboxPolygon(totalBoundingBoxLoaded)
      const newBbox = bboxPolygon(newBoundingBox)
      const fc = featureCollection([curBbox, newBbox])
      const combined = combine(fc)
      finalBbox = bbox(combined)
    } else {
      finalBbox = newBoundingBox
    }

    // Check if we need to look for more posts and groups
    if (!isEqual(finalBbox, totalBoundingBoxLoaded)) {
      this.updateBoundingBox(finalBbox)
    }

    // Update currentBoundingBox in the filters to reload MapDrawer posts
    if (!isEqual(this.props.filters.currentBoundingBox, newBoundingBox)) {
      this.props.storeClientFilterParams({ currentBoundingBox: newBoundingBox })
    }

    this.setState({
      ...this.updatedMapFeatures(newBoundingBox)
    })
  }, 200)

  updateBoundingBox = debounce((params) => this.props.updateBoundingBox(params), 500)

  updateView = debounce((params) => this.props.updateView(params), 500)

  onMapHover = (info) => this.setState({ hoveredObject: info.objects || info.object, pointerX: info.x, pointerY: info.y })

  onMapClick = (info, e) => {
    if (info.objects) {
      if (this.state.viewport.zoom >= 20 && this.state.hideDrawer) {
        this.setState({ hideDrawer: false })
      } else {
        // Zoom to center of cluster
        const features = featureCollection(info.objects.map(o => point([o.coordinates[0], o.coordinates[1]])))
        const c = center(features)

        this.setState({
          viewport: {
            ...this.state.viewport,
            longitude: c.geometry.coordinates[0],
            latitude: c.geometry.coordinates[1],
            // Don't zoom out if already further in than expansionZoom
            zoom: Math.max(this.state.viewport.zoom, info.expansionZoom),
            transitionDuration: 500,
            transitionInterpolator: new FlyToInterpolator()
          }
        })
      }
    } else {
      this.setState({ selectedObject: info.object })
      if (info.object.type === 'member') {
        this.props.gotoMember(info.object.id)
      } else if (info.object.type === 'group') {
        this.props.showGroupDetails(info.object.slug)
      } else {
        this.props.showDetails(info.object.id)
      }
    }
  }

  onMapMouseDown = (e) => {
    const oneSecondInMs = 1000
    this.setState({ creatingPost: true })
    setTimeout(() => {
      if (this.state.creatingPost) {
        this.setState({ coordinates: { lng: e.lngLat[0], lat: e.lngLat[1] } })
        const currentParams = Object.fromEntries(new URLSearchParams(this.props.location.search))
        this.props.showCreateModal({ ...currentParams, ...this.state.coordinates })
      }
    }, this.state.isAddingItemToMap ? 0 : oneSecondInMs)
  }

  onMapMouseUp = (e) => {
    if (this.state.creatingPost) this.setState({ creatingPost: false, isAddingItemToMap: false })
  }

  toggleFeatureType = (type, checked) => {
    const newFeatureTypes = { ...this.props.filters.featureTypes }
    newFeatureTypes[type] = checked
    this.props.storeClientFilterParams({ featureTypes: newFeatureTypes })
  }

  _renderTooltip = () => {
    const { hoveredObject, pointerX, pointerY } = this.state || {}
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
        <div styleName='postTip' className={styles[type]} style={{ left: pointerX + 15, top: pointerY }}>
          {message}
        </div>
      )
    }
    return ''
  }

  handleAddItemToMap = () => {
    this.setState({ isAddingItemToMap: true })
  }

  toggleDrawer = (e) => {
    this.setState({ hideDrawer: !this.state.hideDrawer })
    this.props.toggleDrawer(!this.state.hideDrawer)
  }

  toggleFeatureFilters = (e) => {
    this.setState({ showFeatureFilters: !this.state.showFeatureFilters })
  }

  toggleSavedSearches = (e) => {
    this.setState({ showSavedSearches: !this.state.showSavedSearches })
  }

  saveSearch = (name) => {
    const { currentBoundingBox } = this.state
    const { context, currentUser, filters, routeParams } = this.props
    const { featureTypes, search: searchText, topics } = filters

    const groupSlug = routeParams.groupSlug

    const userId = currentUser.id

    const postTypes = Object.keys(featureTypes).reduce((selected, type) => {
      if (featureTypes[type]) selected.push(type)
      return selected
    }, [])

    const topicIds = topics.map(t => t.id)

    const boundingBox = [
      { lat: currentBoundingBox[1], lng: currentBoundingBox[0] },
      { lat: currentBoundingBox[3], lng: currentBoundingBox[2] }
    ]

    const attributes = { boundingBox, groupSlug, context, name, postTypes, searchText, topicIds, userId }

    this.props.saveSearch(attributes)
  }

  handleViewSavedSearch = (search) => {
    this.props.viewSavedSearch(search)
  }

  render () {
    const {
      context,
      currentUser,
      deleteSearch,
      featureTypes,
      fetchPostsForDrawer,
      filters,
      pendingPostsMap,
      pendingPostsDrawer,
      postsForDrawer,
      routeParams,
      searches,
      topics
    } = this.props

    const {
      clusterLayer,
      groupIconLayer,
      hideDrawer,
      isAddingItemToMap,
      groupsForDrawer,
      membersForDrawer,
      showFeatureFilters,
      showSavedSearches,
      totalPostsInView,
      viewport
    } = this.state
    const { mobileSettingsLayout } = this.context
    const withoutNav = mobileSettingsLayout
    const locationParams = this.props['location'] !== undefined ? getQuerystringParam(['zoom', 'center', 'lat', 'lng'], null, this.props) : null

    return (
      <div styleName={cx('container', { 'noUser': !currentUser, withoutNav })}>
        <div styleName='mapContainer'>
          <Map
            layers={[groupIconLayer, clusterLayer]}
            afterViewportUpdate={this.afterViewportUpdate}
            onViewportUpdate={this.mapViewPortUpdate}
            children={this._renderTooltip()}
            isAddingItemToMap={isAddingItemToMap}
            viewport={viewport}
            onMouseDown={this.onMapMouseDown}
            onMouseUp={this.onMapMouseUp}
          />
          {pendingPostsMap && <Loading className={styles.loading} />}
        </div>
        <button styleName={cx('toggleDrawerButton drawerAdjacentButton', { 'drawerOpen': !hideDrawer })} onClick={this.toggleDrawer}>
          <Icon name='Hamburger' className={styles.openDrawer} />
          <Icon name='Ex' className={styles.closeDrawer} />
        </button>
        {!hideDrawer && (
          <MapDrawer
            context={context}
            locationParams={locationParams}
            currentUser={currentUser}
            fetchPostsForDrawer={fetchPostsForDrawer}
            filters={filters}
            groups={groupsForDrawer}
            members={membersForDrawer}
            numFetchedPosts={postsForDrawer.length}
            numTotalPosts={totalPostsInView}
            onUpdateFilters={this.props.storeClientFilterParams}
            pendingPostsDrawer={pendingPostsDrawer}
            posts={postsForDrawer}
            routeParams={routeParams}
            topics={topics}
          />
        )}
        <div styleName={cx('searchAutocomplete')}>
          <LocationInput saveLocationToDB={false} onChange={(value) => this.handleLocationInputSelection(value)} />
        </div>
        <button styleName={cx('toggleFeatureFiltersButton', { open: showFeatureFilters, withoutNav })} onClick={this.toggleFeatureFilters}>
        Features: <strong>{featureTypes.filter(t => filters.featureTypes[t]).length}/{featureTypes.length}</strong>
        </button>
        {currentUser && (
          <button
            data-for='addItemToMapTooltip'
            data-tip='Add item to map'
            styleName={cx('addItemToMapButton drawerAdjacentButton', { active: isAddingItemToMap, drawerOpen: !hideDrawer })}
            onClick={this.handleAddItemToMap}
          >
            <Icon name='Plus' styleName={cx({ openDrawer: !hideDrawer, closeDrawer: hideDrawer })} />
          </button>
        )}
        <Tooltip
          delay={550}
          id='addItemToMapTooltip' />
        {currentUser && <>
          <Icon
            name='Heart'
            onClick={this.toggleSavedSearches}
            styleName={cx('savedSearchesButton', { open: showSavedSearches })}
          />
          {showSavedSearches && (
            <SavedSearches
              deleteSearch={deleteSearch}
              filters={filters}
              saveSearch={this.saveSearch}
              searches={searches}
              toggle={this.toggleSavedSearches}
              viewSavedSearch={this.handleViewSavedSearch}
            />
          )}
      </>}
        <div styleName={cx('featureTypeFilters', { open: showFeatureFilters, withoutNav })}>
          <h3>What do you want to see on the map?</h3>
          {featureTypes.map(featureType => {
            let color = FEATURE_TYPES[featureType].primaryColor

            return (
              <div
                key={featureType}
                ref={this.refs[featureType]}
                styleName='featureTypeSwitch'
              >
                <SwitchStyled
                  backgroundColor={`rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`}
                  name={featureType}
                  checked={filters.featureTypes[featureType]}
                  onChange={(checked, name) => this.toggleFeatureType(name, !checked)}
                />
                <span>{featureType.charAt(0).toUpperCase() + featureType.slice(1)}s</span>
              </div>
            )
          })}
          <div styleName={cx('pointer')} />
        </div>
      </div>
    )
  }
}

export default function MapExplorer (props) {
  const history = useHistory()

  return (
    <UnwrappedMapExplorer {...props} history={history} />
  )
}
