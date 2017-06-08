import React, { PropTypes, Component } from 'react'
import './Search.scss'
const { arrayOf, func, shape, string, object } = PropTypes
import FullPageModal from 'routes/FullPageModal'
import TextInput from 'components/TextInput'
import ScrollListener from 'components/ScrollListener'
import PostCard from 'components/PostCard'
import CommentCard from 'components/CommentCard'

const SEARCH_RESULTS_ID = 'search-results'

export default class Search extends Component {
  static propTypes = {
    searchResults: arrayOf(shape({
      id: string.isRequired,
      content: object
    })),
    term: string,
    setSearchTerm: func,
    fetchSearchResults: func,
    fetchMoreSearchResults: func
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    this.props.fetchSearchResults()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.term !== this.props.term) {
      this.props.fetchSearchResults()
    }
  }

  render () {
    const { searchResults, term, setSearchTerm, fetchMoreSearchResults } = this.props

    return <FullPageModal>
      <div styleName='search'>
        <SearchBar {...{term, setSearchTerm}} />
        <div styleName='search-results' id={SEARCH_RESULTS_ID}>
          {searchResults.map(sr =>
            <SearchResult key={sr.id} searchResult={sr} search={term} />)}
          <ScrollListener onBottom={() => fetchMoreSearchResults()}
            elementId={SEARCH_RESULTS_ID} />
        </div>
      </div>
    </FullPageModal>
  }
}

export function SearchBar ({term, setSearchTerm}) {
  return <div styleName='search-bar'>
    <TextInput styleName='search-input'
      value={term}
      placeholder='Search'
      onChange={event => setSearchTerm(event.target.value)} />
  </div>
}

export function SearchResult ({ searchResult, term }) {
  const { id, type, content } = searchResult

  var component
  switch (type) {
    case 'Person':
      component = content.name
      break
    case 'Post':
      component = <PostCard post={content} />
      break
    case 'Comment':
      component = <CommentCard comment={content} />
      break
  }
  return <div styleName='search-result'>
    {component}
  </div>
}
