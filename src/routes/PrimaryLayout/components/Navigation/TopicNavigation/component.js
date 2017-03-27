import React from 'react'
import Icon from 'components/Icon'
import Badge from 'components/Badge'
import { Link } from 'react-router-dom'
import s from './component.scss' // eslint-disable-line no-unused-vars
import badgeHoverStyles from '../../../../../components/Badge/component.scss'

export default function TopicNavigation (
  { collapsed, match }
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

  return <div styleName='s.topicNavigation'>
    <div styleName='s.header'>
      <Icon name='Topics' styleName='s.icon' />
      All Topics
    </div>
    <ul styleName='s.topics'>
      {topics.map(topic => <li key={topic.name}>
        <Link styleName='s.topic' className={badgeHoverStyles.parent} to='/'>
          <span styleName='s.name'>#{topic.name}</span>
          {topic.badge && <Badge number={topic.badge} styleName='s.badge' />}
        </Link>
      </li>)}
    </ul>
    <div styleName='s.addTopic'><Link to='/'>+ add topic</Link></div>
  </div>
}
