import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './Search.scss'
import FullPageModal from 'routes/FullPageModal'
import TextInput from 'components/TextInput'
import ScrollListener from 'components/ScrollListener'
import PostCard from 'components/PostCard'
import CommentCard from 'components/CommentCard'
import RoundImage from 'components/RoundImage'
import Highlight from 'components/Highlight'
import Loading from 'components/Loading'
import { Pill } from 'components/Pillbox/Pillbox'
import { get, intersection } from 'lodash/fp'

const { arrayOf, bool, func, shape, string, object } = PropTypes
const SEARCH_RESULTS_ID = 'search-results'

export default class Search extends Component {
  static propTypes = {
    searchResults: arrayOf(shape({
      id: string.isRequired,
      content: object
    })),
    pending: bool,
    searchForInput: string,
    searchFromQueryString: string,
    setSearchTerm: func,
    updateQueryParam: func,
    fetchSearchResults: func,
    fetchMoreSearchResults: func
  }

  componentDidMount () {
    const { searchForInput, searchFromQueryString, setSearchTerm } = this.props
    if (!searchForInput && searchFromQueryString) {
      setSearchTerm(searchFromQueryString)
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.searchForInput !== this.props.searchForInput ||
      prevProps.filter !== this.props.filter) {
      this.props.fetchSearchResults()
    }
  }

  render () {
    const {
      pending,
      searchResults,
      searchForInput,
      setSearchTerm,
      updateQueryParam,
      fetchMoreSearchResults,
      showPostDetails,
      setSearchFilter,
      showPerson,
      voteOnPost,
      filter
    } = this.props

    return <FullPageModal>
      <div styleName='search'>
        <SearchBar {...{searchForInput, setSearchTerm, updateQueryParam, setSearchFilter, filter}} />
        <div styleName='search-results'
          id={SEARCH_RESULTS_ID}
          ref={x => { this.searchResultsDiv = x }}>
          {searchResults.map(sr =>
            <SearchResult key={sr.id}
              searchResult={sr}
              term={searchForInput}
              showPostDetails={showPostDetails}
              showPerson={showPerson}
              voteOnPost={voteOnPost} />)}
          {pending && <Loading type='bottom' />}
          <ScrollListener onBottom={() => fetchMoreSearchResults()}
            elementId={SEARCH_RESULTS_ID} />
        </div>
      </div>
    </FullPageModal>
  }
}

export function SearchBar ({
  searchForInput,
  setSearchTerm,
  updateQueryParam,
  setSearchFilter,
  filter
}) {
  const onSearchChange = event => {
    const { value } = event.target
    setSearchTerm(value) // no debounce
    updateQueryParam(value) // debounced
  }
  return <div styleName='search-bar'>
    <TextInput theme={styles}
      inputRef={x => x && x.focus()}
      value={searchForInput}
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

export function SearchResult ({
  searchResult,
  term = '',
  showPostDetails,
  showPerson,
  voteOnPost
}) {
  const { type, content } = searchResult

  const highlightProps = {
    terms: term.split(' '),
    highlightClassName: styles.highlight
  }

  var component
  switch (type) {
    case 'Person':
      component = <PersonCard
        person={content}
        showPerson={showPerson}
        highlightProps={highlightProps} />
      break
    case 'Post':
      component = <PostCard
        styleName='postcard-expand'
        post={content}
        highlightProps={highlightProps} />
      break
    case 'Comment':
      // FIX: DEV-395 - explore why search results is returning empty entities
      if (!content.post || !content.creator) {
        console.log('!!! comment without data', content)
        break
      }
      component = <CommentCard
        comment={content}
        expanded={false}
        highlightProps={highlightProps} />
      break
  }
  if (!component) return null
  return <div styleName='search-result'>
    {component}
  </div>
}

export function PersonCard ({ person, showPerson, highlightProps }) {
  if (!person) return null

  const matchingSkill = get('0', intersection(
    person.skills.map(s => s.name.toLowerCase()),
    highlightProps.terms.map(t => t.toLowerCase())
  ))

  return <div styleName='person-card' onClick={() => showPerson(person.id)}>
    <RoundImage url={person.avatarUrl} styleName='person-image' large />
    <div styleName='person-details'>
      <Highlight {...highlightProps}>
        <div styleName='person-name'>{person.name}</div>
      </Highlight>
      <div styleName='person-location'>{person.location}</div>
    </div>
    {matchingSkill && <Pill label={matchingSkill} styleName='person-skill' small />}
  </div>
}
