import React, { PropTypes, Component } from 'react'
import './AllTopics.scss'
const { array } = PropTypes
import FullPageModal from 'routes/FullPageModal'
import { pluralize } from 'util/index'

export default class AllTopics extends Component {
  static propTypes = {
    topics: array
  }

  render () {
    const { topics } = this.props

    return <FullPageModal
      content={<div styleName='all-topics'>
        <div styleName='title'>Topics</div>
        <div styleName='subtitle'>7 Total Topics</div>
        <SearchBar />
        {topics.map(topic => <TopicListItem topic={topic} />)}
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

export function TopicListItem ({ topic, toggleSubscribe }) {
  const { name, postsTotal, followersTotal, subscribed } = topic
  return <div styleName='topic'>
    <div styleName='topic-details'>
      <div styleName='topic-name'>#{name}</div>
      <div styleName='topic-stats'>{pluralize(postsTotal, 'post')} • {pluralize(followersTotal, 'follower')}</div>
    </div>
    <span onClick={toggleSubscribe} styleName='topic-subscribe'>
      {subscribed ? 'Unsubscribe' : 'Subscribe'}
    </span>
  </div>
}
