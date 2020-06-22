import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
// import { Link } from 'react-router-dom'
// import { get, throttle, isEmpty } from 'lodash/fp'
import { throttle } from 'lodash/fp'
// import { tagUrl } from 'util/navigation'
import { DETAIL_COLUMN_ID, position } from 'util/scrolling'
import ScrollListener from 'components/ScrollListener'
import Icon from 'components/Icon'
// import Comments from './Comments'
import SocketSubscriber from 'components/SocketSubscriber'
// import Button from 'components/Button'
import Loading from 'components/Loading'
import NotFound from 'components/NotFound'
import './CommunityDetail.scss'

// the height of the header plus the padding-top
const STICKY_HEADER_SCROLL_OFFSET = 78

export default class CommunityDetail extends Component {
  static propTypes = {
    community: PropTypes.object,
    routeParams: PropTypes.object,
    currentUser: PropTypes.object,
    fetchCommunity: PropTypes.func
  }

  state = {
    atHeader: false,
    headerWidth: 0,
    headerScrollOffset: 0,
    atActivity: false,
    activityWidth: 0,
    activityScrollOffset: 0,
    showPeopleDialog: false
  }

  setHeaderStateFromDOM = () => {
    const container = document.getElementById(DETAIL_COLUMN_ID)
    if (!container) return
    this.setState({
      headerWidth: container.offsetWidth
    })
  }

  setActivityStateFromDOM = activity => {
    const element = ReactDOM.findDOMNode(activity)
    const container = document.getElementById(DETAIL_COLUMN_ID)
    if (!element || !container) return
    const offset = position(element, container).y - STICKY_HEADER_SCROLL_OFFSET
    this.setState({
      activityWidth: element.offsetWidth,
      activityScrollOffset: offset
    })
  }

  componentDidMount () {
    this.onCommunityIdChange()
  }

  componentDidUpdate (prevProps) {
    if (this.props.id && this.props.id !== prevProps.id) {
      this.onCommunityIdChange()
    }
  }

  onCommunityIdChange = () => {
    this.props.fetchCommunity()
  }

  handleScroll = throttle(100, event => {
    const { scrollTop } = event.target
    const {
      atHeader,
      atActivity,
      headerScrollOffset,
      activityScrollOffset
    } = this.state
    if (!atActivity && scrollTop >= activityScrollOffset) {
      this.setState({ atActivity: true })
    } else if (atActivity && scrollTop < activityScrollOffset) {
      this.setState({ atActivity: false })
    }

    if (!atHeader && scrollTop > headerScrollOffset) {
      this.setState({ atHeader: true })
    } else if (atHeader && scrollTop <= headerScrollOffset) {
      this.setState({ atHeader: false })
    }
  })

  render () {
    const {
      // routeParams,
      community,
      pending,
      // currentUser,
      onClose
    } = this.props
    // const { atHeader, atActivity, headerWidth, activityWidth } = this.state

    if (!community && !pending) return <NotFound />
    if (pending) return <Loading />

    // const scrollToBottom = () => {
    //   const detail = document.getElementById(DETAIL_COLUMN_ID)
    //   detail.scrollTop = detail.scrollHeight
    // }
    // const headerStyle = {
    //   width: headerWidth + 'px'
    // }
    // const activityStyle = {
    //   width: activityWidth + 'px',
    //   marginTop: STICKY_HEADER_SCROLL_OFFSET + 'px'
    // }

    // <CommunityTags tags={community.tags} />

    return <div styleName='community' ref={this.setHeaderStateFromDOM}>
      <ScrollListener elementId={DETAIL_COLUMN_ID} onScroll={this.handleScroll} />
      <div styleName='communityDetailHeader' style={{ backgroundImage: `url(${community.bannerUrl})` }}>
        {onClose &&
          <a styleName='close' onClick={onClose}><Icon name='Ex' /></a>}
        <div styleName='communityTitleContainer'>
          <img src={community.avatarUrl} height='50px' width='50px' />
          <div styleName='communityTitle'>{community.name}</div>
        </div>
      </div>
      <div styleName='communityDetailBody'>
        <div styleName='communityDescription'>{community.description}</div>
      </div>
      <SocketSubscriber type='community' id={community.id} />
    </div>
  }
}
