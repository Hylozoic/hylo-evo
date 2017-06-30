import React, { Component } from 'react'
const { array, string, bool, func, object } = React.PropTypes
import Icon from 'components/Icon'
import Badge from 'components/Badge'
import { Link, NavLink, matchPath } from 'react-router-dom'
import { tagUrl, topicsUrl } from 'util/index'
import s from './TopicNavigation.scss' // eslint-disable-line no-unused-vars
import badgeHoverStyles from '../../../../../components/Badge/component.scss'
import cx from 'classnames'

export default class TopicNavigation extends Component {
  static propTypes = {
    communityTopics: array,
    communitySlug: string,
    backUrl: string,
    clearBadge: func,
    collapsed: bool,
    expand: func
  }

  render () {
    const {
      communityTopics, backUrl, communitySlug,
      clearBadge, expand, collapsed, location
    } = this.props
    const currentTopic = (topicName, slug) =>
      matchPath(location.pathname, {path: tagUrl(topicName, slug)})

    return <div styleName='s.topicNavigation'>
      <div styleName={cx('s.header', {'s.header-link': collapsed})}
        onClick={expand}>
        <Icon name='Topics' styleName='s.icon' />
        Topics
      </div>
      <ul styleName='s.topics'>
        {communityTopics.map(({ id, topic, newPostCount }) =>
          <li key={topic.name}>
            <NavLink styleName='s.topic'
              className={badgeHoverStyles.parent}
              to={tagUrl(topic.name, communitySlug)}
              onClick={() => id && newPostCount > 0 && clearBadge(id)}
              activeClassName='active-topic-nav-link'>
              <span styleName='s.name'>#{topic.name}</span>
              {newPostCount > 0 &&
                <Badge number={newPostCount} styleName='s.badge' />}
              {currentTopic(topic.name, communitySlug) &&
                <Link to={backUrl}>
                  <Icon name='Ex' styleName='s.closeIcon' />
                </Link>}
            </NavLink>
          </li>)}
      </ul>
      {communitySlug && <div styleName='s.addTopic'>
        <Link to={topicsUrl(communitySlug)}>see all</Link>
      </div>}
    </div>
  }
}
