import React from 'react'
import { some } from 'lodash/fp'
import { debounce } from 'lodash'
import cx from 'classnames'
import { queryParamWhitelist } from 'store/reducers/queryResults'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import './MapExplorer.scss'
import Map from 'components/Map/Map'
import MapDrawer from './MapDrawer'
import { createScatterplotLayerFromPosts } from 'components/Map/layers/postsScatterplotLayer'

export default class MapExplorer extends React.Component {
  static defaultProps = {
    posts: [],
    postTypes: {},
    routeParams: {},
    querystringParams: {},
    topics: [],
    zoom: 10
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

    const updateCheckFunc = key =>
      this.props[key] !== prevProps[key] ||
      this.props.routeParams[key] !== prevProps.routeParams[key]

    if (some(key => updateCheckFunc(key), queryParamWhitelist) ||
      (this.props.posts.length === 0 && prevProps.posts.length !== 0)) {
      this.fetchOrShowCached()
    }
  }

  fetchOrShowCached = () => {
    const { fetchPosts, storeFetchPostsParam } = this.props
    fetchPosts()
    storeFetchPostsParam()
  }

  // fetchMorePosts = () => {
  //   const { pending, posts, hasMore, fetchPosts } = this.props
  //   if (pending || posts.length === 0 || !hasMore) return
  //   fetchPosts(posts.length)
  // }

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
    this.props.fetchPosts()
  }, 150)

  onMapHover = (info) => this.setState({ hoveredObject: info.object, pointerX: info.x, pointerY: info.y })

  onMapClick = (info) => { this.setState({ selectedObject: info.object }); this.props.showDetails(info.object.id) }

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
      querystringParams,
      posts,
      postTypes,
      pending,
      routeParams,
      topics,
      zoom
    } = this.props

    const { showDrawer } = this.state

    const mapLayer = createScatterplotLayerFromPosts(posts, this.onMapHover, this.onMapClick)

    return <div styleName='MapExplorer-container'>
      <Map layers={[mapLayer]} zoom={zoom} onViewportUpdate={this.mapViewPortUpdate} children={this._renderTooltip()} />
      <button styleName={cx('toggleDrawerButton', { 'drawerOpen': showDrawer })} onClick={this.toggleDrawer}><Icon name='Stack' green={showDrawer} styleName='icon' /></button>
      { showDrawer ? (
        <MapDrawer
          onUpdateFilters={this.updateClientFilters}
          posts={posts}
          postTypes={postTypes}
          topics={topics}
          querystringParams={querystringParams}
          routeParams={routeParams}
        />)
        : '' }
      { pending && <Loading /> }
    </div>
  }
}
