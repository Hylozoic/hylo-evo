import React, { Component } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { Link, NavLink, matchPath } from 'react-router-dom'

import Badge from 'components/Badge'
import CreateTopic from 'components/CreateTopic'
import Icon from 'components/Icon'
import { tagUrl, topicsUrl } from 'util/index'
import badgeHoverStyles from '../../../../../components/Badge/component.scss'
import s from './TopicNavigation.scss' // eslint-disable-line no-unused-vars

const { array, string, bool, func } = PropTypes

export default class TopicNavigation extends Component {
  state = {
    createTopicModalVisible: false
  }

  static propTypes = {
    communityTopics: array,
    communitySlug: string,
    backUrl: string,
    clearBadge: func,
    clearFeedList: func,
    collapsed: bool,
    expand: func
  }

  toggleTopicModal = () =>
    this.setState({
      createTopicModalVisible: !this.state.createTopicModalVisible
    })

  render () {
    const {
      communityTopics, goBack, communitySlug,
      clearBadge, clearFeedList, expand, collapsed, location
    } = this.props

    const currentTopic = topicName =>
      matchPath(location.pathname, {path: tagUrl(topicName, communitySlug)})

    return <div styleName='s.topicNavigation'>
      <div styleName={cx('s.header', {'s.header-link': collapsed})}
        onClick={expand}>
        <Icon name='Topics' styleName='s.icon' />
        <span styleName='s.title'>Topics</span>
        <Icon name='Plus' styleName='s.create-button' onClick={this.toggleTopicModal} />
      </div>
      <ul styleName='s.topics'>
        {communityTopics.map(({ id, topic, newPostCount }) =>
          <li key={topic.name} styleName='s.topic'>
            <NavLink className={badgeHoverStyles.parent}
              styleName='s.topicLink'
              to={tagUrl(topic.name, communitySlug)}
              onClick={() => {
                if (id) {
                  currentTopic(topic.name) && clearFeedList()
                  newPostCount > 0 && clearBadge(id)
                }
              }}
              activeClassName='active-topic-nav-link'>
              <span styleName='s.name'>#{topic.name}</span>
              {newPostCount > 0 && !currentTopic(topic.name) &&
                <Badge number={newPostCount} styleName='s.badge' />}
              {currentTopic(topic.name) &&
                <Icon name='Ex' styleName='s.closeIcon' onClick={goBack} />}
            </NavLink>
          </li>)}
      </ul>
      {communitySlug && <div styleName='s.addTopic'>
        <Link to={topicsUrl(communitySlug)}>see all</Link>
      </div>}
      {this.state.createTopicModalVisible && <CreateTopic
        closeModal={this.toggleTopicModal} />}
    </div>
  }
}
