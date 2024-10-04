import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { debounce, find, get } from 'lodash/fp'
import { useSelector, useDispatch } from 'react-redux'
import { GroupCell } from 'components/GroupsList/GroupsList'
import Dropdown from 'components/Dropdown'
import FullPageModal from 'routes/FullPageModal'
import Icon from 'components/Icon'
import ScrollListener from 'components/ScrollListener'
import TextInput from 'components/TextInput'
import useRouterParams from 'hooks/useRouterParams'
import { inflectedTotal } from 'util/index'
import { topicUrl, baseUrl } from 'util/navigation'
import getGroupForSlug from 'store/selectors/getGroupForSlug'
import isPendingFor from 'store/selectors/isPendingFor'
import toggleGroupTopicSubscribe from 'store/actions/toggleGroupTopicSubscribe'
import fetchTopics from 'store/actions/fetchTopics'
import { FETCH_TOPICS } from 'store/constants'
import {
  setSort,
  setSearch,
  getTopics,
  getHasMoreTopics,
  getTotalTopics,
  getSort,
  getSearch,
  deleteGroupTopic
} from './AllTopics.store'
import classes from './AllTopics.module.scss'

const TOPIC_LIST_ID = 'topic-list'

function AllTopics (props) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  // const [createTopicModalVisible, setCreateTopicModalVisible] = useState(false)
  const [totalTopicsCached, setTotalTopicsCached] = useState(null)

  const routeParams = useRouterParams()
  const groupSlug = routeParams.groupSlug
  const group = useSelector(state => getGroupForSlug(state, groupSlug))
  const selectedSort = useSelector(getSort)
  const search = useSelector(getSearch)
  const fetchTopicsParams = {
    groupSlug: routeParams.groupSlug,
    sortBy: selectedSort,
    autocomplete: search
  }
  const topics = useSelector(state => getTopics(state, fetchTopicsParams))
  const hasMore = useSelector(state => getHasMoreTopics(state, fetchTopicsParams))
  const totalTopics = useSelector(state => getTotalTopics(state, fetchTopicsParams))
  const fetchIsPending = useSelector(state => isPendingFor(FETCH_TOPICS, state))

  const fetchTopicsAction = debounce(250, () => dispatch(fetchTopics({ ...fetchTopicsParams, first: 20 })))
  const fetchMoreTopics = debounce(250, () => !fetchIsPending && hasMore && dispatch(fetchTopics({ ...fetchTopicsParams, offset: get('length', topics, 0), first: 10 })))

  useEffect(() => {
    fetchTopicsAction()
    updateTopicsCache()
  }, [])

  useEffect(() => {
    return () => {
      dispatch(setSearch(''))
    }
  }, [])

  useEffect(() => {
    if (!totalTopicsCached && !totalTopics && totalTopics) {
      updateTopicsCache()
    }
    if (
      selectedSort !== props.selectedSort ||
      search !== props.search ||
      routeParams.groupSlug !== props.routeParams.groupSlug
    ) {
      fetchTopicsAction()
    }
  }, [selectedSort, search, groupSlug, totalTopics])

  const updateTopicsCache = () => {
    setTotalTopicsCached(totalTopics)
  }

  const deleteGroupTopicHandler = (groupTopicId) => {
    if (window.confirm(t('Are you sure you want to delete this groupTopic?'))) {
      dispatch(deleteGroupTopic(groupTopicId))
    }
  }

  // const toggleTopicModal = () => setCreateTopicModalVisible(!createTopicModalVisible)

  const all = t('All')
  return (
    <FullPageModal fullWidth goToOnClose={baseUrl({ ...routeParams, view: undefined })}>
      <div className={classes.allTopics}>
        <div className={classes.title}>{t('{{groupName}} Topics', { groupName: group ? group.name : all })}</div>
        <div className={classes.subtitle}>{t('{{totalTopicsCached}} Total Topics', { totalTopicsCached })}</div>
        <div className={classes.controls}>
          <SearchBar
            search={search}
            setSearch={(value) => dispatch(setSearch(value))}
            selectedSort={selectedSort}
            setSort={(value) => dispatch(setSort(value))}
            fetchIsPending={fetchIsPending}
          />
        </div>
        <div className={classes.topicList} id={TOPIC_LIST_ID}>
          {topics.map(topic => (
            <TopicListItem
              key={topic.id}
              singleGroup={group}
              topic={topic}
              routeParams={routeParams}
              deleteItem={deleteGroupTopicHandler}
              toggleSubscribe={(groupTopic) => dispatch(toggleGroupTopicSubscribe(groupTopic))}
            />
          ))}
          <ScrollListener
            onBottom={() => fetchMoreTopics()}
            elementId={TOPIC_LIST_ID}
          />
        </div>
      </div>
    </FullPageModal>
  )
}

function SearchBar ({ search, setSearch, selectedSort, setSort, fetchIsPending }) {
  const { t } = useTranslation()
  const sortOptions = [
    { id: 'name', label: t('Name') },
    { id: 'num_followers', label: t('Popular') },
    { id: 'updated_at', label: t('Recent') }
  ]
  let selected = find(o => o.id === selectedSort, sortOptions)

  if (!selected) selected = sortOptions[0]

  return (
    <div className={classes.searchBar}>
      <TextInput
        className={classes.searchInput}
        value={search}
        placeholder={t('Search topics')}
        loading={fetchIsPending}
        noClearButton
        onChange={event => setSearch(event.target.value)}
      />
      <Dropdown
        className={classes.searchOrder}
        toggleChildren={(
          <span className={classes.searchSorterLabel}>
            {selected.label}
            <Icon name='ArrowDown' />
          </span>
        )}
        items={sortOptions.map(({ id, label }) => ({
          label,
          onClick: () => setSort(id)
        }))}
        alignRight
      />
    </div>
  )
}

function TopicListItem ({ topic, singleGroup, routeParams, toggleSubscribe }) {
  const { name, groupTopics, postsTotal, followersTotal } = topic
  const { t } = useTranslation()
  let groupTopicContent

  if (singleGroup) {
    const groupTopic = topic.groupTopics.find(ct => ct.group.id === singleGroup.id)

    if (!groupTopic || (!groupTopic.isSubscribed && groupTopic.visibility === 0)) return null

    groupTopicContent = (
      <div className={classes.topicStats}>
        {inflectedTotal('post', postsTotal)} • {inflectedTotal('subscriber', followersTotal)} •
        {toggleSubscribe && (
          <span onClick={() => toggleSubscribe(groupTopic)} className={classes.topicSubscribe}>
            {groupTopic.isSubscribed ? t('Unsubscribe') : t('Subscribe')}
          </span>
        )}
      </div>
    )
  } else {
    const visibleGroupTopics = groupTopics.filter(ct => ct.isSubscribed || ct.visibility !== 0)
    if (visibleGroupTopics.length === 0) return null

    groupTopicContent = visibleGroupTopics.map((ct, key) => (
      <GroupCell group={ct.group} key={key}>
        <div className={classes.topicStats}>
          {inflectedTotal('post', ct.postsTotal)} • {inflectedTotal('subscriber', ct.followersTotal)} •
          {toggleSubscribe && (
            <span onClick={() => toggleSubscribe(ct)} className={classes.topicSubscribe}>
              {ct.isSubscribed ? t('Unsubscribe') : t('Subscribe')}
            </span>
          )}
        </div>
        <br />
      </GroupCell>
    ))
  }

  return (
    <div className={classes.topic}>
      <div className={classes.groupsList}>
        <Link className={classes.topicDetails} to={topicUrl(name, { ...routeParams, view: null })}>
          <div className={classes.topicName}>#{name}</div>
        </Link>
        {groupTopicContent}
      </div>
    </div>
  )
}

export default AllTopics
