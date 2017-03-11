import React from 'react'
import Icon from 'components/Icon'
import Badge from 'components/Badge'
import { Link } from 'react-router'
import badgeHoverStyles from 'components/Badge/component.scss'

export default function TopicNavigation (
  { collapsed, styles }
) {
  const topics = [
    {name: 'petitions', badge: 2},
    {name: 'freebies'},
    {name: 'press', badge: 2},
    {name: 'inspiration'},
    {name: 'vent'},
    {name: 'question'},
    {name: 'progress'}
  ]

  return <div styleName='topicNavigation'>
    <div styleName='header'>
      <Icon name='Topics' styleName='icon' />
      All Topics
    </div>
    <ul styleName='topics'>
      {topics.map(topic => <li key={topic.name}>
        <Link styleName='topic' className={badgeHoverStyles.parent} to='/'>
          <span styleName='name'>#{topic.name}</span>
          {topic.badge && <Badge number={topic.badge} styleName='badge' parentClassName={styles.topic} />}
        </Link>
      </li>)}
    </ul>
    <div styleName='addTopic'><Link to='/'>+ add topic</Link></div>
  </div>
}
