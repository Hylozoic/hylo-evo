import React from 'react'
import Icon from 'components/Icon'
import Badge from 'components/Badge'
import { Link } from 'react-router'

export default function TopicNavigation (
  { collapsed }
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
        <Link styleName='topic' to='/'>
          <span styleName='name'>#{topic.name}</span>
          {topic.badge && <Badge number={topic.badge} styleName='badge' />}
        </Link>
      </li>)}
    </ul>
    <div styleName='addTopic'><Link to='/'>+ add topic</Link></div>
  </div>
}
