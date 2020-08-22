import bbox from '@turf/bbox'
import bboxPolygon from '@turf/bbox-polygon'
import booleanWithin from '@turf/boolean-within'
import center from '@turf/center'
import combine from '@turf/combine'
import { featureCollection, point } from '@turf/helpers'
import React from 'react'
import { FlyToInterpolator } from 'react-map-gl'
import { debounce, get, groupBy, isEqual } from 'lodash'
import cx from 'classnames'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import { FEATURE_TYPES } from './MapExplorer.store'
import Map from 'components/Map/Map'
import MapDrawer from './MapDrawer'
import SavedSearches from './SavedSearches'
import { createIconLayerFromPostsAndMembers } from 'components/Map/layers/clusterLayer'
import { createIconLayerFromCommunities } from 'components/Map/layers/iconLayer'
import { heart } from 'util/assets'
import SwitchStyled from 'components/SwitchStyled'
import styles from './MapExplorer.scss'
import LocationInput from 'components/LocationInput'
import { locationObjectToViewport } from 'util/geo'
import { isPublicPath, isAllCommunitiesPath, isNetworkPath, isCommunityPath, getCommunitySlugInPath as getCommunitySlug, getNetworkSlugInPath as getNetworkSlug } from 'util/navigation'

export default class MapExplorer extends React.Component {
  static defaultProps = {
    centerLocation: { lat: 35.442845, lng: 7.916598 },
    filters: {},
    members: [],
    posts: [],
    publicCommunities: [],
    routeParams: {},
    hideDrawer: false,
    topics: [],
    zoom: 0
  }

  constructor (props) {
    super(props)
    this.state = {
      clusterLayer: null,
      communityIconLayer: null,
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
    Object.keys(FEATURE_TYPES).forEach(featureType => {
      this.refs[featureType] = React.createRef()
    })

    this.props.fetchSavedSearches();
  }

  componentDidUpdate (prevProps) {
    if (!prevProps) return

    const {
      fetchMembers,
      fetchPosts,
      fetchParams,
      fetchPublicCommunities,
      members,
      posts,
      publicCommunities
    } = this.props

    if (!isEqual(prevProps.fetchParams, fetchParams)) {
      fetchMembers()
      fetchPosts()
      fetchPublicCommunities()
    }

    if (this.state.currentBoundingBox &&
        (!isEqual(prevProps.fetchParams, fetchParams) ||
         !isEqual(prevProps.posts, posts) ||
         !isEqual(prevProps.members, members) ||
         !isEqual(prevProps.publicCommunities, publicCommunities))) {
      this.setState(this.updatedMapFeatures(this.state.currentBoundingBox))
    }
  }

  updatedMapFeatures (boundingBox) {
    const bbox = bboxPolygon(boundingBox)
    const viewMembers = this.props.members.filter(member => {
      const locationObject = member.locationObject
      if (locationObject) {
        const centerPoint = point([locationObject.center.lng, locationObject.center.lat])
        return booleanWithin(centerPoint, bbox)
      }
      return false
    })
    const viewPosts = this.props.posts.filter(post => {
      const locationObject = post.locationObject
      if (locationObject) {
        const centerPoint = point([locationObject.center.lng, locationObject.center.lat])
        return booleanWithin(centerPoint, bbox)
      }
      return false
    })
    const viewCommunities = this.props.publicCommunities.filter(community => {
      const locationObject = community.locationObject
      if (locationObject) {
        const centerPoint = point([locationObject.center.lng, locationObject.center.lat])
        return booleanWithin(centerPoint, bbox)
      }
      return false
    })

    // TODO: update the existing layers instead of creating a new ones?
    return {
      clusterLayer: createIconLayerFromPostsAndMembers({
        members: viewMembers,
        posts: viewPosts,
        onHover: this.onMapHover,
        onClick: this.onMapClick,
        boundingBox: this.state.currentBoundingBox
      }),
      communityIconLayer: createIconLayerFromCommunities({
        communities: viewCommunities,
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
      this.setState({ viewport: locationObjectToViewport(this.state.viewport, value) })
    }
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

    // Check if we need to look for more posts and communities
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
      } else if (info.object.type === 'community') {
        this.props.showCommunityDetails(info.object.id)
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
    const { boundingBox } = this.state
    const { currentUser, filters, location, posts } = this.props
    const { featureTypes, search: searchText, topics } = filters
    const { pathname } = location;

    let context
    if (isAllCommunitiesPath(pathname)) context = 'all'
    if (isPublicPath(pathname)) context = 'public'
    if (isCommunityPath(pathname)) context = 'community'
    if (isNetworkPath(pathname)) context = 'network'

    let communitySlug
    let networkSlug
    
    if (context === 'community') communitySlug = getCommunitySlug(pathname)
    if (context === 'network') networkSlug = getNetworkSlug(pathname)

    const userId = currentUser.id

    const postTypes = Object.keys(featureTypes).reduce((selected, type) => {
      if (featureTypes[type]) selected.push(type)
      return selected;
    }, [])

    const lastPostId = get(posts, '[0].id')

    const topicIds = topics.map(t => t.id)

    const attributes = { boundingBox, communitySlug, context, lastPostId, name, networkSlug, postTypes, searchText, topicIds, userId }

    this.props.saveSearch(attributes)
  }

  render () {
    const {
      currentUser,
      fetchParams,
      deleteSearch,
      features,
      filters,
      pending,
      routeParams,
      searches,
      topics
    } = this.props

    const {
      clusterLayer,
      communityIconLayer,
      features,
      hideDrawer,
      showFeatureFilters,
      showSavedSearches,
      viewport
    } = this.state

    return <div styleName={cx('container', { 'noUser': !currentUser })}>
      <div styleName='mapContainer'>
        <Map
          layers={[communityIconLayer, clusterLayer]}
          afterViewportUpdate={this.afterViewportUpdate}
          onViewportUpdate={this.mapViewPortUpdate}
          children={this._renderTooltip()}
          viewport={viewport}
        />
        { pending && <Loading className={styles.loading} /> }
      </div>
      <button styleName={cx('toggleDrawerButton', { 'drawerOpen': !hideDrawer })} onClick={this.toggleDrawer}>
        <Icon name='Hamburger' className={styles.openDrawer} />
        <Icon name='Ex' className={styles.closeDrawer} />
      </button>
      { !hideDrawer ? (
        <MapDrawer
          currentUser={currentUser}
          features={features}
          fetchParams={fetchParams}
          filters={filters}
          onUpdateFilters={this.props.storeClientFilterParams}
          pending={pending}
          routeParams={routeParams}
          topics={topics}
        />)
        : '' }
      <div styleName={cx('searchAutocomplete')}>
        <LocationInput saveLocationToDB={false} onChange={(value) => this.handleLocationInputSelection(value)} />
      </div>
      <button styleName={cx('toggleFeatureFiltersButton', { 'featureFiltersOpen': showFeatureFilters })} onClick={this.toggleFeatureFilters}>
        Post Types: <strong>{Object.keys(filters.featureTypes).filter(t => filters.featureTypes[t]).length}/5</strong>
      </button>
      <img styleName={cx('savedSearchesButton')} onClick={this.toggleSavedSearches} src={heart} />
      { showSavedSearches ? (<SavedSearches deleteSearch={deleteSearch} filters={filters} saveSearch={this.saveSearch} searches={searches} toggle={this.toggleSavedSearches} />) : '' }
      <div styleName={cx('featureTypeFilters', { 'featureFiltersOpen': showFeatureFilters })}>
        <h3>What do you want to see on the map?</h3>
        {['member', 'request', 'offer', 'resource', 'event'].map(featureType => {
          let color = FEATURE_TYPES[featureType].primaryColor

          return <div
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
        })}
        <div styleName={cx('pointer')} />
      </div>
    </div>
  }
}
