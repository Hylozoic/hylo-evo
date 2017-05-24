import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router-dom'
import './AllTopics.scss'
const { boolean, arrayOf, func, number, shape, string } = PropTypes
import FullPageModal from 'routes/FullPageModal'
import { pluralize, tagUrl } from 'util/index'

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
    slug: string
  }

  render () {
    const { totalTopics, topics, slug } = this.props

    return <FullPageModal
      content={<div styleName='all-topics'>
        <div styleName='title'>Topics</div>
        <div styleName='subtitle'>{totalTopics} Total Topics</div>
        <SearchBar />
        <div styleName='topic-list'>
          {topics.map(topic => <TopicListItem key={topic.id} topic={topic} slug={slug} />)}
        </div>
      </div>} />
  }
}

export function SearchBar () {
  return <div styleName='search-bar'>
    <input styleName='search-input' type='text' placeholder='Search here' />
    <select styleName='search-order'>
      <option>Popular</option>
      <option>Recent</option>
    </select>
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
