import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router-dom'
import './AllTopics.scss'
const { boolean, arrayOf, func, number, shape, string } = PropTypes
import FullPageModal from 'routes/FullPageModal'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import TextInput from 'components/TextInput'
import { pluralize, tagUrl } from 'util/index'

const sortOptions = [
  {id: 'followers', label: 'Popular'},
  {id: 'recent', label: 'Recent'}
]

export default class AllTopics extends Component {
  static propTypes = {
    topics: arrayOf(shape({
      name: string,
      id: string,
      postsTotal: number,
      followersTotal: number,
      subscribed: boolean,
      toggleSubscribe: func
    })),
    totalTopics: number,
    slug: string,
    selectedSort: string,
    onChangeSort: func,
    search: string,
    onChangeSearch: func
  }

  static defaultProps = {
    selectedSort: sortOptions[0].id,
    onChangeSort: () => {}
  }

  constructor (props) {
    super(props)
    this.state = {
      search: ''
    }
  }

  render () {
    const {
      totalTopics,
      topics,
      slug,
      selectedSort,
      onChangeSort
    } = this.props
    const { search } = this.state

    return <FullPageModal
      content={<div styleName='all-topics'>
        <div styleName='title'>Topics</div>
        <div styleName='subtitle'>{totalTopics} Total Topics</div>
        <SearchBar
          search={search}
          onChangeSearch={search => this.setState({search})}
          selectedSort={selectedSort}
          onChangeSort={onChangeSort} />
        <div styleName='topic-list'>
          {topics.map(topic => <TopicListItem key={topic.id} topic={topic} slug={slug} />)}
        </div>
      </div>} />
  }
}

export function SearchBar ({search, onChangeSearch, selectedSort, onChangeSort}) {
  return <div styleName='search-bar'>
    <TextInput styleName='search-input'
      value={search}
      placeholder='Search topics'
      onChange={event => onChangeSearch(event.target.value)} />
    <Dropdown styleName='search-order'
      toggleChildren={<span styleName='search-sorter-label'>
        {sortOptions.find(o => o.id === selectedSort).label}
        <Icon name='ArrowDown' />
      </span>}
      items={sortOptions.map(({ id, label }) => ({
        label,
        onClick: () => onChangeSort(id)
      }))}
      alignRight />
  </div>
}

export function TopicListItem ({ topic, slug }) {
  const { name, postsTotal, followersTotal, subscribed, toggleSubscribe } = topic
  return <div styleName='topic'>
    <Link styleName='topic-details' to={tagUrl(name, slug)}>
      <div styleName='topic-name'>#{name}</div>
      <div styleName='topic-stats'>{pluralize(postsTotal, 'post')} • {pluralize(followersTotal, 'follower')}</div>
    </Link>
    <span onClick={toggleSubscribe} styleName='topic-subscribe'>
      {subscribed ? 'Unsubscribe' : 'Subscribe'}
    </span>
  </div>
}
