import React from 'react'
import { debounce } from 'lodash'
import cx from 'classnames'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import './MapExplorer.scss'
import Map from 'components/Map/Map'
import MapDrawer from './MapDrawer'
import { createScatterplotLayerFromMembers, createScatterplotLayerFromPosts } from 'components/Map/layers/scatterplotLayer'

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
      showDrawer: props.querystringParams.showDrawer === 'true'
    }
  }

  componentDidMount () {
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

  updateClientFilters = (opts) => {
    this.props.storeClientFilterParams(opts)
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

    const { showDrawer } = this.state

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
      <button styleName={cx('toggleDrawerButton', { 'drawerOpen': showDrawer })} onClick={this.toggleDrawer}><Icon name='Stack' green={showDrawer} styleName='icon' /></button>
      { showDrawer ? (
        <MapDrawer
          filters={filters}
          onUpdateFilters={this.updateClientFilters}
          posts={posts}
          topics={topics}
          querystringParams={querystringParams}
          routeParams={routeParams}
        />)
        : '' }
      { pending && <Loading /> }
    </div>
  }
}
