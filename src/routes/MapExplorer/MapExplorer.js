import React from 'react'
import { FlyToInterpolator } from 'react-map-gl'
import { debounce, groupBy } from 'lodash'
import cx from 'classnames'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import { FEATURE_TYPES } from './MapExplorer.store'
import Map from 'components/Map/Map'
import MapDrawer from './MapDrawer'
import { createIconLayerFromPostsAndMembers } from 'components/Map/layers/clusterLayer'
import { createIconLayerFromCommunities } from 'components/Map/layers/iconLayer'
// import { createScatterplotLayerFromPublicCommunities } from 'components/Map/layers/scatterplotLayer'
import SwitchStyled from 'components/SwitchStyled'
import styles from './MapExplorer.scss'

export default class MapExplorer extends React.Component {
  static defaultProps = {
    centerLocation: { lat: 35.442845, lng: 7.916598 },
    filters: {},
    members: [],
    posts: [],
    publicCommunities: [],
    routeParams: {},
    querystringParams: {},
    topics: [],
    zoom: 0
  }

  constructor (props) {
    super(props)
    this.state = {
      boundingBox: null,
      clusterLayer: null,
      communityIconLayer: null,
      hoveredObject: null,
      pointerX: 0,
      pointerY: 0,
      selectedObject: null,
      showDrawer: props.querystringParams.showDrawer === 'true',
      showFeatureFilters: false,
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

    // this.fetchOrShowCached()
  }

  componentDidUpdate (prevProps) {
    if (!prevProps) return

    if (prevProps.fetchPostsParam.boundingBox !== this.props.fetchPostsParam.boundingBox) {
      this.fetchOrShowCached()
    }

    if (prevProps.fetchPostsParam.boundingBox !== this.props.fetchPostsParam.boundingBox ||
         prevProps.posts !== this.props.posts ||
         prevProps.members !== this.props.members) {
      this.setState({
        clusterLayer: createIconLayerFromPostsAndMembers({
          members: this.props.members,
          posts: this.props.posts,
          onHover: this.onMapHover,
          onClick: this.onMapClick,
          boundingBox: this.props.fetchPostsParam.boundingBox
        })
      })
    }

    // FIXME - Fetch for image url returns error
    if (prevProps.publicCommunities !== this.props.publicCommunities) {
      this.setState({
        communityIconLayer: createIconLayerFromCommunities({
          communities: this.props.publicCommunities,
          onHover: this.onMapHover,
          onClick: this.onMapClick,
          boundingBox: this.props.fetchPostsParam.boundingBox
        })
      })
    }
  }

  fetchOrShowCached = () => {
    const { fetchMembers, fetchPosts, fetchPublicCommunities } = this.props
    fetchMembers()
    fetchPosts()
    fetchPublicCommunities()
  }

  mapViewPortUpdate = (update) => {
    this.setState({ viewport: update })
  }

  afterViewportUpdate = (update, mapRef) => {
    if (mapRef) {
      let bounds = mapRef.getBounds()
      bounds = [{ ...bounds._sw }, { ...bounds._ne }]
      this.updateBoundingBoxQuery(bounds)
    }
  }

  updateBoundingBoxQuery = debounce((boundingBox) => {
    this.setState({ boundingBox })
    this.props.storeFetchPostsParam({ boundingBox })
  }, 300)

  onMapHover = (info) => this.setState({ hoveredObject: info.objects || info.object, pointerX: info.x, pointerY: info.y })

  onMapClick = (info, e) => {
    if (info.objects) {
      this.setState({ viewport: {
        ...this.state.viewport,
        longitude: info.lngLat[0],
        latitude: info.lngLat[1],
        zoom: this.state.viewport.zoom + 1,
        transitionDuration: 500,
        transitionInterpolator: new FlyToInterpolator()
      } })
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
    this.setState({ showDrawer: !this.state.showDrawer })
    this.props.toggleDrawer(!this.state.showDrawer)
  }

  toggleFeatureFilters = (e) => {
    this.setState({ showFeatureFilters: !this.state.showFeatureFilters })
  }

  render () {
    const {
      features,
      fetchPostsParam,
      filters,
      querystringParams,
      pending,
      routeParams,
      topics
      // publicCommunities
    } = this.props

    const {
      clusterLayer,
      communityIconLayer,
      showDrawer,
      showFeatureFilters,
      viewport
    } = this.state

    // const publicCommunitiesLayer = createScatterplotLayerFromPublicCommunities(publicCommunities, this.onMapHover, this.onMapClick)

    return <div styleName='MapExplorer-container'>
      <Map
        layers={[clusterLayer, communityIconLayer]}
        afterViewportUpdate={this.afterViewportUpdate}
        onViewportUpdate={this.mapViewPortUpdate}
        children={this._renderTooltip()}
        viewport={viewport}
      />
      <button styleName={cx('toggleDrawerButton', { 'drawerOpen': showDrawer })} onClick={this.toggleDrawer}>
        <Icon name='Hamburger' className={styles.openDrawer} />
        <Icon name='Ex' className={styles.closeDrawer} />
      </button>
      { showDrawer ? (
        <MapDrawer
          fetchPostsParam={fetchPostsParam}
          filters={filters}
          onUpdateFilters={this.props.storeClientFilterParams}
          features={features}
          topics={topics}
          querystringParams={querystringParams}
          routeParams={routeParams}
        />)
        : '' }

      <button styleName={cx('toggleFeatureFiltersButton', { 'featureFiltersOpen': showFeatureFilters })} onClick={this.toggleFeatureFilters}>
        Post Types: <strong>{Object.keys(filters.featureTypes).filter(t => filters.featureTypes[t]).length}/5</strong>
      </button>
      <div styleName={cx('featureTypeFilters', { 'featureFiltersOpen': showFeatureFilters })}>
        <h3>What do you want to see on the map?</h3>
        {['event', 'request', 'offer', 'resource', 'member'].map(featureType => {
          return <div
            key={featureType}
            ref={this.refs[featureType]}
            styleName='featureTypeSwitch'
          >
            <SwitchStyled
              backgroundColor={FEATURE_TYPES[featureType].primaryColor}
              name={featureType}
              checked={filters.featureTypes[featureType]}
              onChange={(checked, name) => this.toggleFeatureType(name, !checked)}
            />
            <span>{featureType.charAt(0).toUpperCase() + featureType.slice(1)}s</span>
          </div>
        })}
        <div styleName={cx('pointer')} />
      </div>

      { pending && <Loading /> }
    </div>
  }
}
