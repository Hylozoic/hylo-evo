import React, { Component } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { Link, NavLink } from 'react-router-dom'
import Badge from 'components/Badge'
import CreateTopic from 'components/CreateTopic'
import Icon from 'components/Icon'
import badgeHoverStyles from '../../../../../components/Badge/component.scss'
import s from './TopicNavigation.scss' // eslint-disable-line no-unused-vars

const { array, string, bool, func, object } = PropTypes

export default class TopicNavigation extends Component {
  static propTypes = {
    topics: array,
    routeParams: object,
    communitySlug: string,
    communityId: string,
    seeAllUrl: string,
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

  render () {
    const {
      topics, goBack, seeAllUrl, collapsed, expand, routeParams, communityId
    } = this.props
    const { slug } = routeParams

    return <div styleName='s.topicNavigation'>
      <div styleName={cx('s.header', {'s.header-link': collapsed})} onClick={expand}>
        <Icon name='Topics' styleName='s.icon' />
        <span styleName='s.title'>Topics</span>
        {communityId && <CreateTopic
          communityId={communityId}
          communitySlug={slug}
          communityTopics={topics} />}
      </div>
      <TopicsList onClose={goBack} onClick={this.onClickTopic} topics={topics} />
      <div styleName='s.addTopic'>
        <Link to={seeAllUrl}>see all</Link>
      </div>
    </div>
  }
}

export function TopicsList ({ topics, onClick, onClose }) {
  return <ul styleName='s.topics'>
    {topics.map(topic =>
      <li key={topic.name} styleName='s.topic'>
        <NavLink className={badgeHoverStyles.parent}
          styleName='s.topicLink'
          to={topic.url}
          onClick={() => onClick(topic)}
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
