import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, withTranslation } from 'react-i18next'
import { find } from 'lodash/fp'
import { bool, arrayOf, func, number, shape, string, object } from 'prop-types'
// import CreateTopic from 'components/CreateTopic'
import { GroupCell } from 'components/GroupsList/GroupsList'
import Dropdown from 'components/Dropdown'
import FullPageModal from 'routes/FullPageModal'
import Icon from 'components/Icon'
import ScrollListener from 'components/ScrollListener'
import TextInput from 'components/TextInput'
import { inflectedTotal } from 'util/index'
import { topicUrl, baseUrl } from 'util/navigation'
import './AllTopics.scss'

const TOPIC_LIST_ID = 'topic-list'

class AllTopics extends Component {
  state = {
    createTopicModalVisible: false
  }

  static propTypes = {
    topics: arrayOf(shape({
      id: string,
      name: string.isRequired,
      postsTotal: number,
      followersTotal: number,
      isSubscribed: bool
    })),
    group: object,
    routeParams: object.isRequired,
    totalTopics: number,
    selectedSort: string,
    setSort: func,
    search: string,
    setSearch: func,
    toggleGroupTopicSubscribe: func.isRequired
  }

  componentDidMount () {
    this.props.fetchTopics()
    this.updateTopicsCache()
  }

  componentWillUnmount () {
    this.props.setSearch('')
  }

  componentDidUpdate (prevProps) {
    if (!this.state.totalTopicsCached && !prevProps.totalTopics && this.props.totalTopics) {
      this.updateTopicsCache()
    }
    if (
      prevProps.selectedSort !== this.props.selectedSort ||
      prevProps.search !== this.props.search ||
      prevProps.routeParams.groupSlug !== this.props.routeParams.groupSlug
    ) {
      this.props.fetchTopics()
    }
  }

  // Caching totalTopics because the total returned in the queryset
  // changes when there is a search term
  updateTopicsCache = () => {
    this.setState({ totalTopicsCached: this.props.totalTopics })
  }

  deleteGroupTopic (groupTopicId) {
    if (window.confirm(this.props.t('Are you sure you want to delete this groupTopic?'))) {
      this.props.deleteGroupTopic(groupTopicId)
    }
  }

  toggleTopicModal = () =>
    this.setState({
      createTopicModalVisible: !this.state.createTopicModalVisible
    })

  render () {
    const {
      routeParams,
      group,
      topics,
      search,
      setSearch,
      selectedSort,
      setSort,
      fetchMoreTopics,
      fetchIsPending,
      canModerate,
      toggleGroupTopicSubscribe,
      t
    } = this.props
    const { totalTopicsCached } = this.state
    const all = t('All')

    return (
      <FullPageModal fullWidth goToOnClose={baseUrl({ ...routeParams, view: undefined })}>
        <div styleName='all-topics'>
          <div styleName='title'>{t('{{groupName}} Topics', { groupName: group ? group.name : all })}</div>
          <div styleName='subtitle'>{t('{{totalTopicsCached}} Total Topics', { totalTopicsCached })}</div>
          <div styleName='controls'>
            <SearchBar {...{ search, setSearch, selectedSort, setSort, fetchIsPending }} />
          </div>
          <div styleName='topic-list' id={TOPIC_LIST_ID}>
            {topics.map(topic => (
              <TopicListItem
                key={topic.id}
                singleGroup={group}
                topic={topic}
                routeParams={routeParams}
                canModerate={canModerate}
                deleteItem={this.deleteGroupTopic}
                toggleSubscribe={toggleGroupTopicSubscribe}
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
}

export function SearchBar ({ search, setSearch, selectedSort, setSort, fetchIsPending }) {
  const { t } = useTranslation()
  const sortOptions = [
    { id: 'name', label: t('Name') },
    { id: 'num_followers', label: t('Popular') },
    { id: 'updated_at', label: t('Recent') }
  ]
  let selected = find(o => o.id === selectedSort, sortOptions)

  if (!selected) selected = sortOptions[0]

  return (
    <div styleName='search-bar'>
      <TextInput
        styleName='search-input'
        value={search}
        placeholder={t('Search topics')}
        loading={fetchIsPending}
        noClearButton
        onChange={event => setSearch(event.target.value)}
      />
      <Dropdown
        styleName='search-order'
        toggleChildren={(
          <span styleName='search-sorter-label'>
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

export function TopicListItem ({ topic, singleGroup, routeParams, toggleSubscribe, deleteItem, canModerate }) {
  const { name, groupTopics, postsTotal, followersTotal } = topic
  const { t } = useTranslation()
  let groupTopicContent

  if (singleGroup) {
    // Grab correct GroupTopic object
    const groupTopic = topic.groupTopics.find(ct => ct.group.id === singleGroup.id)

    // Don't show hidden topics unless user is subscribed to it
    if (!groupTopic || (!groupTopic.isSubscribed && groupTopic.visibility === 0)) return ''

    groupTopicContent = (
      <div styleName='topic-stats'>
        {inflectedTotal('post', postsTotal)} • {inflectedTotal('subscriber', followersTotal)} •
        {toggleSubscribe && (
          <span onClick={() => toggleSubscribe(groupTopic)} styleName='topic-subscribe'>
            {groupTopic.isSubscribed ? t('Unsubscribe') : t('Subscribe')}
          </span>
        )}
      </div>
    )
  } else {
    // Don't show hidden topics unless user is subscribed to it
    const visibleGroupTopics = groupTopics.filter(ct => ct.isSubscribed || ct.visibility !== 0)
    if (visibleGroupTopics.length === 0) return ''

    groupTopicContent = visibleGroupTopics.map((ct, key) => (
      <GroupCell group={ct.group} key={key}>
        <div styleName='topic-stats'>
          {inflectedTotal('post', ct.postsTotal)} • {inflectedTotal('subscriber', ct.followersTotal)} •
          {toggleSubscribe && (
            <span onClick={() => toggleSubscribe(ct)} styleName='topic-subscribe'>
              {ct.isSubscribed ? t('Unsubscribe') : t('Subscribe')}
            </span>
          )}
        </div>
        <br />
      </GroupCell>
    ))
  }

  return (
    <div styleName='topic'>
      <div styleName='groupsList'>
        <Link styleName='topic-details' to={topicUrl(name, { ...routeParams, view: null })}>
          <div styleName='topic-name'>#{name}</div>
        </Link>
        {groupTopicContent}
      </div>
    </div>
  )
}

export default withTranslation()(AllTopics)
