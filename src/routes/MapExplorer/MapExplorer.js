import React from 'react'
import { debounce } from 'lodash'
import cx from 'classnames'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import { POST_TYPES } from 'store/models/Post'
import Map from 'components/Map/Map'
import MapDrawer from './MapDrawer'
import SwitchStyled from 'components/SwitchStyled'
import { createScatterplotLayerFromMembers, createScatterplotLayerFromPosts } from 'components/Map/layers/scatterplotLayer'
import './MapExplorer.scss'

export const FEATURE_TYPES = {
  ...POST_TYPES,
  member: {
    primaryColor: '#2A4059', // $color-member
    backgroundColor: '#FAFBFC' // $color-athens-gray
  }
}

export default class MapExplorer extends React.Component {
  static defaultProps = {
    filters: {},
    members: [],
    posts: [],
    routeParams: {},
    querystringParams: {},
    topics: []
  }

  constructor (props) {
    super(props)
    this.state = {
      boundingBox: null,
      hoveredObject: null,
      pointerX: 0,
      pointerY: 0,
      selectedObject: null,
      showDrawer: props.querystringParams.showDrawer === 'true',
      showFeatureFilters: false
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
  }

  fetchOrShowCached = () => {
    const { fetchMembers, fetchPosts } = this.props
    fetchMembers()
    fetchPosts()
  }

  mapViewPortUpdate = (update, mapRef) => {
    let bounds = mapRef ? mapRef.getBounds() : null
    if (bounds) {
      bounds = [{ ...bounds._sw }, { ...bounds._ne }]
    }
    this.updateBoundingBoxQuery(bounds)
  }

  updateBoundingBoxQuery = debounce((boundingBox) => {
    this.setState({ boundingBox })
    this.props.storeFetchPostsParam({ boundingBox })
  }, 150)

  onMapHover = (info) => this.setState({ hoveredObject: info.object, pointerX: info.x, pointerY: info.y })

  onMapClick = (info) => {
    this.setState({ selectedObject: info.object })
    if (info.object.type === 'member') {
      this.props.gotoMember(info.object.id)
    } else {
      this.props.showDetails(info.object.id)
    }
  }

  toggleFeatureType = (type, checked) => {
    const featureTypes = this.props.filters.featureTypes
    featureTypes[type] = checked
    this.props.storeClientFilterParams({ featureTypes })
  }

  _renderTooltip = () => {
    const { hoveredObject, pointerX, pointerY } = this.state || {}
    return hoveredObject ? (
      <div styleName='postTip' style={{ left: pointerX + 15, top: pointerY }}>
        { hoveredObject.message }
      </div>
    ) : ''
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
      centerLocation,
      filters,
      querystringParams,
      members,
      posts,
      pending,
      routeParams,
      topics,
      zoom
    } = this.props

    const { showDrawer, showFeatureFilters } = this.state

    const postsLayer = createScatterplotLayerFromPosts(posts, this.onMapHover, this.onMapClick)
    const membersLayer = createScatterplotLayerFromMembers(members, this.onMapHover, this.onMapClick)

    return <div styleName='MapExplorer-container'>
      <Map
        center={centerLocation}
        layers={[membersLayer, postsLayer]}
        onViewportUpdate={this.mapViewPortUpdate}
        children={this._renderTooltip()}
        zoom={zoom}
      />
      <button styleName={cx('toggleDrawerButton', { 'drawerOpen': showDrawer })} onClick={this.toggleDrawer}>
        <Icon name='Stack' green={showDrawer} styleName='icon' />
      </button>
      { showDrawer ? (
        <MapDrawer
          filters={filters}
          onUpdateFilters={this.props.storeClientFilterParams}
          posts={posts}
          topics={topics}
          querystringParams={querystringParams}
          routeParams={routeParams}
        />)
        : '' }

      <button styleName={cx('toggleFeatureFiltersButton', { 'featureFiltersOpen': showFeatureFilters })} onClick={this.toggleFeatureFilters}>
        <Icon name='Stack' styleName='icon' />
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
      </div>

      { pending && <Loading /> }
    </div>
  }
}
