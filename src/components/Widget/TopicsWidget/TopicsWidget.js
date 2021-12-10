import React, { useState, useEffect } from 'react'

import './Topics.scss'

export default function TopicsWidget ({ group = {} }) {
  const [topics, setTopics] = useState(group.topics || [])

  useEffect(() => {
    setTopics(group.topics)
  }, [group])

  return (
    <div styleName='groupTopics'>
      <div styleName='groupSubtitle'>Topics</div>
      {topics.slice(0, 10).map(topic => {
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
  )
}
