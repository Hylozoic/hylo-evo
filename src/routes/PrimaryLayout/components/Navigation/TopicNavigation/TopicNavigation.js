import React, { Component } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { Link, NavLink, matchPath } from 'react-router-dom'

import Badge from 'components/Badge'
import CreateTopic from 'components/CreateTopic'
import Icon from 'components/Icon'
import { topicUrl, topicsUrl, allCommunitiesUrl } from 'util/navigation'
import badgeHoverStyles from '../../../../../components/Badge/component.scss'
import s from './TopicNavigation.scss' // eslint-disable-line no-unused-vars

const { array, string, bool, func } = PropTypes

export default class TopicNavigation extends Component {
  static propTypes = {
    communityTopics: array,
    communitySlug: string,
    backUrl: string,
    clearBadge: func,
    clearFeedList: func,
    collapsed: bool,
    expand: func
  }

  onClickTopic = communityTopic => {
    const { clearBadge, clearFeedList } = this.props
    const { id, topic } = communityTopic

    if (id) {
      this.currentTopic(topic.name) && clearFeedList()
      communityTopic.newPostCount > 0 && clearBadge(id)
    }
  }

  currentTopic = topicName => {
    const { location, routeParams } = this.props

    return matchPath(location.pathname, { path: topicUrl(topicName, routeParams) })
  }

  render () {
    const {
      communityTopics: communityTopicsRaw, goBack, expand, collapsed,
      routeParams, communityId
    } = this.props
    const { slug: communitySlug } = routeParams
    const seeAllURL = topicsUrl(routeParams, allCommunitiesUrl())
    const communityTopics = communityTopicsRaw.map(communityTopic => {
      return {
        ...communityTopic.ref,
        ...communityTopic.topic.ref,
        url: topicUrl(communityTopic.topic.name, routeParams),
        onClick: () => this.onClickTopic(communityTopic),
        current: this.currentTopic(communityTopic.name)
      }
    })

    return <div styleName='s.topicNavigation'>
      <div styleName={cx('s.header', {'s.header-link': collapsed})} onClick={expand}>
        <Icon name='Topics' styleName='s.icon' />
        <span styleName='s.title'>Topics</span>
        {communityId && <CreateTopic
          communityId={communityId}
          communitySlug={communitySlug}
          communityTopics={communityTopics} />}
      </div>
      <TopicsList onClose={goBack} topics={communityTopics} />
      <div styleName='s.addTopic'>
        <Link to={seeAllURL}>see all</Link>
      </div>
    </div>
  }
}

export function TopicsList ({ topics, onClose }) {
  return <ul styleName='s.topics'>
    {topics.map(topic =>
      <li key={topic.name} styleName='s.topic'>
        <NavLink className={badgeHoverStyles.parent}
          styleName='s.topicLink'
          to={topic.url}
          onClick={topic.onClick}
          activeClassName='active-topic-nav-link'>
          <span styleName='s.name'>#{topic.name}</span>
          {topic.newPostCount > 0 && !topic.current &&
            <Badge number={topic.newPostCount} styleName='s.badge' />}
          {topic.current &&
            <Icon name='Ex' styleName='s.closeIcon' onClick={onClose} />}
        </NavLink>
      </li>)}
  </ul>
}
