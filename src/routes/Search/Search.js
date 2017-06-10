import React, { PropTypes, Component } from 'react'
import styles from './Search.scss'
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
    if (prevProps.termForInput !== this.props.termForInput ||
      prevProps.filter !== this.props.filter) {
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
      fetchMoreSearchResults,
      showPostDetails,
      setSearchFilter,
      showPerson,
      filter
    } = this.props

    return <FullPageModal>
      <div styleName='search'>
        <SearchBar {...{termForInput, setSearchTerm, updateQueryParam, setSearchFilter, filter}} />
        <div styleName='search-results' id={SEARCH_RESULTS_ID}>
          {pending && <div>Loading...</div>}
          {searchResults.map(sr =>
            <SearchResult key={sr.id}
              searchResult={sr}
              search={termForInput}
              showPostDetails={showPostDetails}
              showPerson={showPerson} />)}
          <ScrollListener onBottom={() => fetchMoreSearchResults()}
            elementId={SEARCH_RESULTS_ID} />
        </div>
      </div>
    </FullPageModal>
  }
}

export function SearchBar ({termForInput, setSearchTerm, updateQueryParam, setSearchFilter, filter}) {
  const onSearchChange = event => {
    const { value } = event.target
    setSearchTerm(value) // no debounce
    updateQueryParam(value) // debounced
  }
  return <div styleName='search-bar'>
    <TextInput theme={styles}
      value={termForInput}
      placeholder='Search'
      onChange={onSearchChange} />
    <TabBar setSearchFilter={setSearchFilter} filter={filter} />
  </div>
}

const tabs = [
  {id: 'all', label: 'All'},
  {id: 'post', label: 'Discussions'},
  {id: 'person', label: 'People'},
  {id: 'comment', label: 'Comments'}
]

export function TabBar ({ filter, setSearchFilter }) {
  console.log('filter', filter)

  return <div styleName='tabs'>
    {tabs.map(({ id, label }) => <span
      key={id}
      styleName={id === filter ? 'tab-active' : 'tab'}
      onClick={() => setSearchFilter(id)}>
      {label}
    </span>)}
  </div>
}

export function SearchResult ({ searchResult, term, showPostDetails, showPerson }) {
  const { type, content } = searchResult

  var component
  switch (type) {
    case 'Person':
      component = content.name
      break
    case 'Post':
      component = <PostCard
        post={content}
        showDetails={() => showPostDetails(content.id)} />
      break
    case 'Comment':
      component = <CommentCard comment={content} expanded={false} />
      break
  }
  return <div styleName='search-result'>
    {component}
  </div>
}
