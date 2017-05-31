import React, { Component } from 'react'
const { array, func, object } = React.PropTypes
import Icon from 'components/Icon'
import Badge from 'components/Badge'
import { Link } from 'react-router-dom'
import { tagUrl, topicsUrl } from 'util/index'
import s from './TopicNavigation.scss' // eslint-disable-line no-unused-vars
import badgeHoverStyles from '../../../../../components/Badge/component.scss'

export default class TopicNavigation extends Component {
  static propTypes = {
    communityTopics: array,
    community: object,
    clearBadge: func
  }

  render () {
    const { communityTopics, clearBadge, community } = this.props
    const slug = community ? community.slug : null

    return <div styleName='s.topicNavigation'>
      <div styleName='s.header'>
        <Icon name='Topics' styleName='s.icon' />
        Topics
      </div>
      <ul styleName='s.topics'>
        {communityTopics.map(({ id, topic, newPostCount }) =>
          <li key={topic.name}>
            <Link styleName='s.topic' className={badgeHoverStyles.parent}
              to={tagUrl(topic.name, slug)}
              onClick={() => id && newPostCount > 0 && clearBadge(id)}>
              <span styleName='s.name'>#{topic.name}</span>
              {newPostCount > 0 &&
                <Badge number={newPostCount} styleName='s.badge' />}
            </Link>
          </li>)}
      </ul>
      <div styleName='s.addTopic'>
        <Link to={topicsUrl(slug)}>see all</Link>
      </div>
    </div>
  }
}
