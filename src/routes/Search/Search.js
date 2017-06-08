import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router-dom'
import './Search.scss'
const { boolean, arrayOf, func, number, shape, string } = PropTypes
import FullPageModal from 'routes/FullPageModal'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import TextInput from 'components/TextInput'
import { pluralize, tagUrl } from 'util/index'
import { find } from 'lodash/fp'
import ScrollListener from 'components/ScrollListener'

const sortOptions = [
  {id: 'num_followers', label: 'Popular'},
  {id: 'updated_at', label: 'Recent'}
]

const TOPIC_LIST_ID = 'topic-list'

export default class Search extends Component {
  static propTypes = {
    // communityTopics: arrayOf(shape({
    //   topic: shape({
    //     id: string.isRequired,
    //     name: string.isRequired
    //   }).isRequired,
    //   id: string,
    //   postsTotal: number,
    //   followersTotal: number,
    //   isSubscribed: boolean
    // })),
    // totalTopics: number,
    // selectedSort: string,
    // setSort: func,
    // search: string,
    // setSearch: func,
    // toggleSubscribe: func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    this.props.fetchSearch()
    // Caching totalTopics because the total returned in the queryset
    // changes when there is a search term
    // this.setState({totalTopicsCached: this.props.totalTopics})
  }

  componentDidUpdate (prevProps) {
    // if (!this.state.totalTopicsCached && !prevProps.totalTopics && this.props.totalTopics) {
    //   this.setState({totalTopicsCached: this.props.totalTopics})
    // }
    // if (prevProps.selectedSort !== this.props.selectedSort ||
    //   prevProps.search !== this.props.search) {
    //   this.props.fetchCommunityTopics()
    // }
  }

  render () {
    const {
      communityTopics,
      slug,
      search,
      setSearch,
      selectedSort,
      setSort,
      toggleSubscribe,
      fetchMoreCommunityTopics
    } = this.props

    const { searchResults } = this.props

    console.log('searchResults', searchResults)

    return <FullPageModal>
      {/*  <div styleName='all-topics'>
        <div styleName='title'>Topics</div>
        <div styleName='subtitle'>{totalTopicsCached} Total Topics</div>
        <SearchBar {...{search, setSearch, selectedSort, setSort}} />
        <div styleName='topic-list' id={TOPIC_LIST_ID}>
          {communityTopics.map(ct =>
            <CommunityTopicListItem key={ct.id} item={ct} slug={slug}
              toggleSubscribe={() =>
                toggleSubscribe(ct.topic.id, !ct.isSubscribed)} />)}
          <ScrollListener onBottom={() => fetchMoreCommunityTopics()}
            elementId={TOPIC_LIST_ID} />
        </div>
      </div>
      */}
    </FullPageModal>
  }
}
