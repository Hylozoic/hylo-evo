import React, { Suspense } from 'react'
import { useHistory } from 'react-router-dom'
import { debounce, get, groupBy, isEqual } from 'lodash'
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

import { lazy } from '@loadable/component'
const Map = lazy(() => import('components/Map/Map'))

import MapDrawer from './MapDrawer'
import SavedSearches from './SavedSearches'
import SwitchStyled from 'components/SwitchStyled'
import LocationInput from 'components/LocationInput'

import styles from './MapExplorer.scss'
import 'mapbox-gl/dist/mapbox-gl.css'

export class UnwrappedMapExplorer extends React.Component {
  static defaultProps = {
    centerLocation: { lat: 35.442845, lng: 7.916598 },
    filters: {},
    members: [],
    posts: [],
    groups: [],
    routeParams: {},
    hideDrawer: false,
    topics: [],
    zoom: 0
  }

  static contextType = LayoutFlagsContext

  constructor (props) {
    super(props)
    this.state = {
      clusterLayer: null,
      groupIconLayer: null,
      currentBoundingBox: null,
      features: [],
      hideDrawer: props.hideDrawer,
      hoveredObject: null,
      pointerX: 0,
      pointerY: 0,
      selectedObject: null,
      showFeatureFilters: false,
      totalLoadedBoundingBox: null,
      viewport: {
        width: 800,
        height: 600,
        latitude: parseFloat(props.centerLocation.lat),
        longitude: parseFloat(props.centerLocation.lng),
        zoom: props.zoom,
        bearing: 0,
        pitch: 0
      }
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
  }

  componentDidUpdate (prevProps) {
    if (!prevProps) return

    const {
      context,
      fetchGroups,
      fetchMembers,
      fetchPosts,
      fetchParams,
      members,
      posts,
      groups
    } = this.props

    if (!isEqual(prevProps.fetchParams, fetchParams) || prevProps.context !== context) {
      fetchMembers()
      fetchPosts()
      fetchGroups()
    }

    if (this.state.currentBoundingBox &&
        (!isEqual(prevProps.fetchParams, fetchParams) ||
         !isEqual(prevProps.posts, posts) ||
         !isEqual(prevProps.members, members) ||
         !isEqual(prevProps.groups, groups))) {
      this.setState(this.updatedMapFeatures(this.state.currentBoundingBox))
    }

    if (prevProps.selectedSearch !== this.props.selectedSearch) {
      this.updateSavedSearch(this.props.selectedSearch)
    }
  }

  updateSavedSearch (search) {
    const { boundingBox, featureTypes, searchText, groupSlug, context, topics } = generateViewParams(search)
    const params = { featureTypes, search: searchText, groupSlug, context, topics }
    this.updateBoundingBoxQuery(boundingBox)
    this.props.fetchMembers(params)
    this.props.fetchPosts(params)
    this.props.fetchGroups(params)
    this.props.storeFetchParams({ boundingBox })
    this.props.storeClientFilterParams({ featureTypes, searchText, topics })
    this.updateViewportWithBbox({ bbox: formatBoundingBox(boundingBox) })
  }

  updatedMapFeatures (boundingBox) {
    const {
      group,
      groups,
      members,
      posts
    } = this.props

    const bbox = bboxPolygon(boundingBox)
    const viewMembers = members.filter(member => {
      const locationObject = member.locationObject
      if (locationObject) {
        const centerPoint = point([locationObject.center.lng, locationObject.center.lat])
        return booleanWithin(centerPoint, bbox)
      }
      return false
    })
    const viewPosts = posts.filter(post => {
      const locationObject = post.locationObject
      if (locationObject) {
        const centerPoint = point([locationObject.center.lng, locationObject.center.lat])
        return booleanWithin(centerPoint, bbox)
      }
      return false
    })
    const viewGroups = groups.filter(group => {
      const locationObject = group.locationObject
      if (locationObject) {
        const centerPoint = point([locationObject.center.lng, locationObject.center.lat])
        return booleanWithin(centerPoint, bbox)
      }
      return false
    }).concat(group && group.locationObject ? group : [])

    // TODO: update the existing layers instead of creating a new ones?
    return {
      clusterLayer: createIconLayerFromPostsAndMembers({
        members: viewMembers,
        posts: viewPosts,
        onHover: this.onMapHover,
        onClick: this.onMapClick,
        boundingBox: this.state.currentBoundingBox
      }),
      groupIconLayer: createIconLayerFromGroups({
        groups: viewGroups,
        onHover: this.onMapHover,
        onClick: this.onMapClick,
        boundingBox: this.state.currentBoundingBox
      }),
      currentBoundingBox: boundingBox,
      features: viewPosts.concat(viewMembers)
    }
  }

  handleLocationInputSelection = (value) => {
    if (value.mapboxId) {
      this.updateViewportWithBbox(value)
    }
  }

  updateViewportWithBbox = ({ bbox }) => {
    this.setState({ viewport: locationObjectToViewport(this.state.viewport, { bbox }) })
  }

  mapViewPortUpdate = (update) => {
    this.setState({ viewport: update })
  }

  afterViewportUpdate = (update, mapRef) => {
    if (mapRef) {
      let bounds = mapRef.getBounds()
      bounds = [bounds._sw.lng, bounds._sw.lat, bounds._ne.lng, bounds._ne.lat]
      this.updateBoundingBoxQuery(bounds)
    }
  }

  updateBoundingBoxQuery = debounce((newBoundingBox) => {
    let finalBbox
    if (this.state.totalLoadedBoundingBox) {
      const curBbox = bboxPolygon(this.state.totalLoadedBoundingBox)
      const newBbox = bboxPolygon(newBoundingBox)
      const fc = featureCollection([curBbox, newBbox])
      const combined = combine(fc)
      finalBbox = bbox(combined)
    } else {
      finalBbox = newBoundingBox
    }

    // Check if we need to look for more posts and groups
    if (!isEqual(finalBbox, this.state.totalLoadedBoundingBox)) {
      this.props.storeFetchParams({ boundingBox: finalBbox })
    }

    this.setState({
      ...this.updatedMapFeatures(newBoundingBox),
      totalLoadedBoundingBox: finalBbox
    })
  }, 300)

  onMapHover = (info) => this.setState({ hoveredObject: info.objects || info.object, pointerX: info.x, pointerY: info.y })

  onMapClick = (info, e) => {
    if (info.objects) {
      if (this.state.viewport.zoom >= 20 && this.state.hideDrawer) {
        this.setState({ hideDrawer: false })
      } else {
        // Zoom to center of cluster
        const features = featureCollection(info.objects.map(o => point([o.coordinates[0], o.coordinates[1]])))
        const c = center(features)

        this.setState({ viewport: {
          ...this.state.viewport,
          longitude: c.geometry.coordinates[0],
          latitude: c.geometry.coordinates[1],
          // Don't zoom out if already further in than expansionZoom
          zoom: Math.max(this.state.viewport.zoom, info.expansionZoom),
          transitionDuration: 500,
          transitionInterpolator: new FlyToInterpolator()
        } })
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

  toggleFeatureType = (type, checked) => {
    const featureTypes = this.props.filters.featureTypes
    featureTypes[type] = checked
    this.props.storeClientFilterParams({ featureTypes })
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
          { message }
        </div>
      )
    }
    return ''
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
    const { context, currentUser, filters, posts, routeParams } = this.props
    const { featureTypes, search: searchText, topics } = filters

    let groupSlug = routeParams.groupSlug

    const userId = currentUser.id

    const postTypes = Object.keys(featureTypes).reduce((selected, type) => {
      if (featureTypes[type]) selected.push(type)
      return selected
    }, [])

    const lastPostId = get(posts, '[0].id')

    const topicIds = topics.map(t => t.id)

    const boundingBox = [
      { lat: currentBoundingBox[1], lng: currentBoundingBox[0] },
      { lat: currentBoundingBox[3], lng: currentBoundingBox[2] }
    ]

    const attributes = { boundingBox, groupSlug, context, lastPostId, name, postTypes, searchText, topicIds, userId }

    this.props.saveSearch(attributes)
  }

  handleViewSavedSearch = (search) => {
    this.props.viewSavedSearch(search)
  }

  render () {
    const {
      currentUser,
      fetchParams,
      deleteSearch,
      filters,
      pending,
      routeParams,
      searches,
      topics
    } = this.props

    const {
      clusterLayer,
      groupIconLayer,
      features,
      hideDrawer,
      showFeatureFilters,
      showSavedSearches,
      viewport
    } = this.state

    const { mobileSettingsLayout } = this.context
    const withoutNav = mobileSettingsLayout

    return <div styleName={cx('container', { 'noUser': !currentUser, withoutNav })}>
      <div styleName='mapContainer'>
        <Suspense fallback={<Loading className={styles.loading} />}>
          <Map
            layers={[groupIconLayer, clusterLayer]}
            afterViewportUpdate={this.afterViewportUpdate}
            onViewportUpdate={this.mapViewPortUpdate}
            children={this._renderTooltip()}
            viewport={viewport}
          />
        </Suspense>
        {pending && <Loading className={styles.loading} />}
      </div>
      <button styleName={cx('toggleDrawerButton', { 'drawerOpen': !hideDrawer })} onClick={this.toggleDrawer}>
        <Icon name='Hamburger' className={styles.openDrawer} />
        <Icon name='Ex' className={styles.closeDrawer} />
      </button>
      {!hideDrawer && (
        <MapDrawer
          currentUser={currentUser}
          features={features}
          fetchParams={fetchParams}
          filters={filters}
          onUpdateFilters={this.props.storeClientFilterParams}
          pending={pending}
          routeParams={routeParams}
          topics={topics}
        />
      )}
      <div styleName={cx('searchAutocomplete')}>
        <LocationInput saveLocationToDB={false} onChange={(value) => this.handleLocationInputSelection(value)} />
      </div>
      <button styleName={cx('toggleFeatureFiltersButton', { open: showFeatureFilters, withoutNav })} onClick={this.toggleFeatureFilters}>
        Post Types: <strong>{Object.keys(filters.featureTypes).filter(t => filters.featureTypes[t]).length}/6</strong>
      </button>
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
        {['member', 'request', 'offer', 'resource', 'event', 'project'].map(featureType => {
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
  }
}

export default function MapExplorer (props) {
  const history = useHistory()

  return (
    <UnwrappedMapExplorer {...props} history={history} />
  )
}
