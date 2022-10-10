import React, { Component } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { Link, NavLink } from 'react-router-dom'
import Badge from 'components/Badge'
import Icon from 'components/Icon'
import badgeHoverStyles from '../../../../../components/Badge/component.scss'
import s from './TopicNavigation.scss' // eslint-disable-line no-unused-vars

const { array, string, bool, func, object } = PropTypes

export default class TopicNavigation extends Component {
  static propTypes = {
    topics: array,
    routeParams: object,
    groupSlug: string,
    groupId: string,
    seeAllUrl: string,
    backUrl: string,
    clearBadge: func,
    clearStream: func,
    collapsed: bool,
    expand: func
  }

  onClickTopic = groupTopic => {
    const { clearBadge, clearStream } = this.props
    const { current, groupTopicId, newPostCount } = groupTopic

    if (groupTopicId) {
      // XXX: not sure exactly what this doing and if we need, we have not been doing this for a while and things seemed to work
      current && clearStream()
      newPostCount > 0 && clearBadge(groupTopicId)
    }
  }

  render () {
    const {
      topics,
      goBack,
      seeAllUrl,
      collapsed,
      expand
    } = this.props

    return <div styleName={cx('s.topicNavigation', { 's.collapsed': collapsed })}>
      <div styleName={cx('s.header', { 's.header-link': collapsed })} onClick={expand}>
        <Link to={seeAllUrl}>
          <Icon name='Topics' styleName='s.icon' />
          <span styleName='s.title'>Topics</span>
        </Link>
        {/* TODO: remove for now, probably for good?
          {groupId && <CreateTopic
          groupId={groupId}
          groupSlug={slug}
          topics={topics}
        />} */}
      </div>
      <TopicsList
        onClose={goBack}
        onClick={this.onClickTopic}
        topics={topics}
      />
      <div styleName='s.addTopic'>
        <Link to={seeAllUrl} styleName='s.allTopics'>All topics</Link>
      </div>
    </div>
  }
}

export function TopicsList ({ topics, onClick, onClose }) {
  return <ul styleName='s.topics'>
    {topics.map(topic =>
      <li key={topic.name} styleName='s.topic' className={cx({ [s.pinned]: topic.visibility === 2 })}>
        <NavLink className={badgeHoverStyles.parent}
          styleName='s.topicLink'
          to={topic.url}
          onClick={() => onClick(topic)}
          activeClassName='active-topic-nav-link'
        >
          { topic.visibility === 2 && <Icon name='Pin' styleName='s.pinIcon' /> }
          <span styleName='s.name'>#{topic.name}</span>
          {topic.newPostCount > 0 && !topic.current &&
            <Badge number={topic.newPostCount} styleName='s.badge' />}
          {topic.current &&
            <Icon name='Ex' styleName='s.closeIcon' onClick={onClose} />}
        </NavLink>
      </li>)}
  </ul>
}
