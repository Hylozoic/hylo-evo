import React, { PropTypes, Component } from 'react'
import styles from './Search.scss'
const { arrayOf, bool, func, shape, string, object } = PropTypes
import FullPageModal from 'routes/FullPageModal'
import TextInput from 'components/TextInput'
import ScrollListener from 'components/ScrollListener'
import PostCard from 'components/PostCard'
import CommentCard from 'components/CommentCard'
import RoundImage from 'components/RoundImage'
import Highlight from 'components/Highlight'

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
        <div styleName='search-results'
          id={SEARCH_RESULTS_ID}
          ref={x => { this.searchResultsDiv = x }}>
          {pending && <div>Loading...</div>}
          {searchResults.map(sr =>
            <SearchResult key={sr.id}
              searchResult={sr}
              term={termForInput}
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
  return <div styleName='tabs'>
    {tabs.map(({ id, label }) => <span
      key={id}
      styleName={id === filter ? 'tab-active' : 'tab'}
      onClick={() => setSearchFilter(id)}>
      {label}
    </span>)}
  </div>
}

export function SearchResult ({ searchResult, term = '', showPostDetails, showPerson }) {
  const { type, content } = searchResult

  const highlightProps = {
    terms: term.split(' '),
    highlightClassName: styles.highlight
  }

  var component
  switch (type) {
    case 'Person':
      component = <PersonCard person={content} showPerson={showPerson} highlightProps={highlightProps} />
      break
    case 'Post':
      component = <PostCard
        post={content}
        showDetails={() => showPostDetails(content.id)} highlightProps={highlightProps} />
      break
    case 'Comment':
      component = <CommentCard comment={content} expanded={false} highlightProps={highlightProps} />
      break
  }
  return <div styleName='search-result'>
    {component}
  </div>
}

export function PersonCard ({ person, showPerson, highlightProps }) {
  if (!person) return null
  return <Highlight {...highlightProps}>
    <div styleName='person-card' onClick={() => showPerson(person.id)}>
      <RoundImage url={person.avatarUrl} styleName='person-image' large />
      <div styleName='person-details'>
        <div styleName='person-name'>{person.name}</div>
        <div styleName='person-location'>{person.location}</div>
      </div>
    </div>
  </Highlight>
}
