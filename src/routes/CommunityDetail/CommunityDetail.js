import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { throttle } from 'lodash/fp'
import { DETAIL_COLUMN_ID, position } from 'util/scrolling'
import Avatar from 'components/Avatar'
import ScrollListener from 'components/ScrollListener'
import Icon from 'components/Icon'
import SocketSubscriber from 'components/SocketSubscriber'
import Loading from 'components/Loading'
import NotFound from 'components/NotFound'
import c from './CommunityDetail.scss' // eslint-disable-line no-unused-vars
import m from '../MapExplorer/MapDrawer/MapDrawer.scss' // eslint-disable-line no-unused-vars

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

    if (!community && !pending) return <NotFound />
    if (pending) return <Loading />

    const topics = community && community.communityTopics

    return <div styleName='c.community' ref={this.setHeaderStateFromDOM}>
      <ScrollListener elementId={DETAIL_COLUMN_ID} onScroll={this.handleScroll} />
      <div styleName='c.communityDetailHeader' style={{ backgroundImage: `url(${community.bannerUrl})` }}>
        {onClose &&
          <a styleName='c.close' onClick={onClose}><Icon name='Ex' /></a>}
        <div styleName='c.communityTitleContainer'>
          <img src={community.avatarUrl} height='50px' width='50px' />
          <div styleName='c.communityTitle'>{community.name}</div>
        </div>
      </div>
      <div styleName='c.communityDetailBody'>
        <div styleName='c.communityDescription'>{community.description}</div>
        { topics && topics.length
          ? <div styleName='c.communityTopics'>
            <div styleName='c.communitySubtitle'>Topics</div>
            {topics.slice(0, 10).map(topic => {
              return (
                <span
                  key={'topic_' + topic.id}
                  styleName='m.topicButton'
                >
                  <span styleName='m.topicCount'>{topic.postsTotal}</span> #{topic.name}
                </span>
              )
            })}
          </div>
          : ''
        }
        <div styleName='c.communityDetails'>
          <div styleName='c.detailContainer'>
            <div styleName='c.communitySubtitle'>Recent Posts</div>
            <div styleName='c.detail'>
              <Icon name='BadgeCheck' />
              <span styleName='c.detailText'>Only members of this community can see posts</span>
            </div>
          </div>
          <div styleName='c.detailContainer'>
            <div styleName='c.communitySubtitle'>{community.memberCount} {community.memberCount > 1 ? `Members` : `Member`}</div>
            {community.publicMemberDirectory
              ? <div>{community.members.map(member => {
                return <div key={member.id} styleName='c.avatarContainer'><Avatar avatarUrl={member.avatarUrl} url={member.avatarUrl} styleName='c.avatar' /><span>{member.name}</span></div>
              })}</div>
              : <div styleName='c.detail'>
                <Icon name='Unlock' />
                <span styleName='c.detailText'>Join to see</span>
              </div>
            }
          </div>
        </div>
        <div styleName='c.requestBar'>
          {community.isAutoJoinable
            ? <div styleName='c.requestOption'>
              <div styleName='c.requestHint'>Anyone can join this community!</div>
              <div styleName='c.requestButton'>Join <span styleName='c.requestCommunity'>{community.name}</span></div>
            </div>
            : <div styleName='c.requestOption'><div styleName='c.requestButton'>Request Membership in <span styleName='c.requestCommunity'>{community.name}</span></div></div>}
        </div>
      </div>
      <SocketSubscriber type='community' id={community.id} />
    </div>
  }
}
