import React from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Link, NavLink } from 'react-router-dom'
import Badge from 'components/Badge'
import Icon from 'components/Icon'
import badgeHoverStyles from '../../../../../components/Badge/component.module.scss'
import styles from './TopicNavigation.module.scss'

export default function TopicNavigation ({
  topics,
  goBack,
  seeAllUrl,
  collapsed,
  expand,
  clearBadge,
  clearStream
}) {
  // XXX: not sure exactly what this doing and if we need, we have not been doing this for a while and things seemed to work
  const handleClearTopic = groupTopic => {
    const { current, groupTopicId, newPostCount } = groupTopic

    if (groupTopicId) {
      current && clearStream()
      newPostCount > 0 && clearBadge(groupTopicId)
    }
  }
  const { t } = useTranslation()

  return (
    <div className={cx(styles.topicNavigation, { [styles.collapsed]: collapsed })}>
      <div className={cx(styles.header, { [styles.headerLink]: collapsed })} onClick={expand}>
        <Link to={seeAllUrl}>
          <Icon name='Topics' className={styles.icon} />
          <span className={styles.title}>{t('Topics')}</span>
        </Link>
      </div>
      <TopicsList
        onClose={goBack}
        onClick={handleClearTopic}
        topics={topics}
      />
      <div className={styles.addTopic}>
        <Link to={seeAllUrl} className={styles.allTopics}>{t('All topics')}</Link>
      </div>
    </div>
  )
}

export function TopicsList ({ topics, onClick, onClose }) {
  return (
    <ul className={styles.topics}>
      {topics.map(topic => (
        <li key={topic.name} className={cx(styles.topic, { [styles.pinned]: topic.visibility === 2 })}>
          <NavLink
            className={({ isActive }) => cx(badgeHoverStyles.parent, styles.topicLink, { [styles.activeTopicNavLink]: isActive })}
            to={topic.url}
            onClick={() => onClick(topic)}
          >
            <span className={styles.name}>#{topic.name}</span>
            {topic.newPostCount > 0 && !topic.current &&
              <Badge number={topic.newPostCount} className={styles.badge} />}
            {topic.visibility === 2 && <Icon name='Pin' className={styles.pinIcon} />}
            {topic.current &&
              <Icon name='Ex' className={styles.closeIcon} onClick={onClose} />}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}
