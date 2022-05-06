import React from 'react'
import './Topics.scss'

export default function TopicsWidget ({ group = {} }) {
  return (
    group.topics
      ? <div styleName='groupTopics'>
        <div styleName='groupSubtitle'>Topics</div>
        {group.topics.slice(0, 10).map(topic => {
          return (
            <span
              key={'topic_' + topic.id}
              styleName='topicButton'
            >
              <span styleName='topicCount'>{topic.postsTotal}</span> #{topic.name}
            </span>
          )
        })}
      </div>
      : null
  )
}
