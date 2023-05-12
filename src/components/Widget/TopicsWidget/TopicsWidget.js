import React from 'react'
import { useTranslation } from 'react-i18next'
import './Topics.scss'

export default function TopicsWidget ({ group = {} }) {
  const { t } = useTranslation()

  return (
    group.topics
      ? <div styleName='groupTopics'>
        <div styleName='groupSubtitle'>{t('Topics')}</div>
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
