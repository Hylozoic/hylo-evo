import React from 'react'
import { useTranslation } from 'react-i18next'
import classes from './Topics.module.scss'

export default function TopicsWidget ({ group = {} }) {
  const { t } = useTranslation()

  return (
    group.topics
      ? <div className={classes.groupTopics}>
        <div className={classes.groupSubtitle}>{t('Topics')}</div>
        {group.topics.slice(0, 10).map(topic => {
          return (
            <span
              key={'topic_' + topic.id}
              className={classes.topicButton}
            >
              <span className={classes.topicCount}>{topic.postsTotal}</span> #{topic.name}
            </span>
          )
        })}
      </div>
      : null
  )
}
