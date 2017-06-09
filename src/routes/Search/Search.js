import React, { PropTypes, Component } from 'react'
import './Search.scss'
const { arrayOf, bool, func, shape, string, object } = PropTypes
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
    pending: bool,
    termForInput: string,
    termFromQueryString: string,
    setSearchTerm: func,
    updateQueryParam: func,
    fetchSearchResults: func,
    fetchMoreSearchResults: func
  }

  componentDidMount () {
    const { termForInput, termFromQueryString, setSearchTerm } = this.props
    if (!termForInput && termFromQueryString) {
      setSearchTerm(termFromQueryString)
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.termForInput !== this.props.termForInput) {
      this.props.fetchSearchResults()
    }
  }

  render () {
    const {
      pending,
      searchResults,
      termForInput,
      setSearchTerm,
      updateQueryParam,
      fetchMoreSearchResults
    } = this.props

    return <FullPageModal>
      <div styleName='search'>
        <SearchBar {...{termForInput, setSearchTerm, updateQueryParam}} />
        <div styleName='search-results' id={SEARCH_RESULTS_ID}>
          {pending && <div>Loading...</div>}
          {searchResults.map(sr =>
            <SearchResult key={sr.id}
              searchResult={sr}
              search={termForInput} />)}
          <ScrollListener onBottom={() => fetchMoreSearchResults()}
            elementId={SEARCH_RESULTS_ID} />
        </div>
      </div>
    </FullPageModal>
  }
}

export function SearchBar ({termForInput, setSearchTerm, updateQueryParam}) {
  const onSearchChange = event => {
    const { value } = event.target
    setSearchTerm(value) // no debounce
    updateQueryParam(value) // debounced
  }
  return <div styleName='search-bar'>
    <TextInput styleName='search-input'
      value={termForInput}
      placeholder='Search'
      onChange={onSearchChange} />
  </div>
}

export function SearchResult ({ searchResult, term }) {
  const { type, content } = searchResult

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
