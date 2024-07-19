import React from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Link, NavLink } from 'react-router-dom'
import Badge from 'components/Badge'
import Icon from 'components/Icon'
import badgeHoverStyles from '../../../../../components/Badge/component.scss'
import s from './TopicNavigation.scss' // eslint-disable-line no-unused-vars

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
    <div styleName={cx('s.topicNavigation', { 's.collapsed': collapsed })}>
      <div styleName={cx('s.header', { 's.header-link': collapsed })} onClick={expand}>
        <Link to={seeAllUrl}>
          <Icon name='Topics' styleName='s.icon' />
          <span styleName='s.title'>{t('Topics')}</span>
        </Link>
      </div>
      <TopicsList
        onClose={goBack}
        onClick={handleClearTopic}
        topics={topics}
      />
      <div styleName='s.addTopic'>
        <Link to={seeAllUrl} styleName='s.allTopics'>{t('All topics')}</Link>
      </div>
    </div>
  )
}

export function TopicsList ({ topics, onClick, onClose }) {
  return (
    <ul styleName='s.topics'>
      {topics.map(topic => (
        <li key={topic.name} styleName='s.topic' className={cx({ [s.pinned]: topic.visibility === 2 })}>
          <NavLink
            className={badgeHoverStyles.parent}
            styleName='s.topicLink'
            to={topic.url}
            onClick={() => onClick(topic)}
            activeClassName='active-topic-nav-link'
          >
            <span styleName='s.name'>#{topic.name}</span>
            {topic.newPostCount > 0 && !topic.current &&
              <Badge number={topic.newPostCount} styleName='s.badge' />}
            {topic.visibility === 2 && <Icon name='Pin' styleName='s.pinIcon' />}
            {topic.current &&
              <Icon name='Ex' styleName='s.closeIcon' onClick={onClose} />}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}
