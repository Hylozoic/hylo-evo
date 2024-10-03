import cx from 'classnames'
import { get, intersection } from 'lodash/fp'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { useTranslation } from 'react-i18next'
import FullPageModal from 'routes/FullPageModal'
import TextInput from 'components/TextInput'
import ScrollListener from 'components/ScrollListener'
import PostCard from 'components/PostCard'
import CommentCard from 'components/CommentCard'
import RoundImage from 'components/RoundImage'
import Highlight from 'components/Highlight'
import Loading from 'components/Loading'
import Pill from 'components/Pill'

import classes from './Search.module.scss'

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
    if (searchFromQueryString) {
      this.props.fetchSearchResults()
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
      searchFromQueryString,
      setSearchTerm,
      updateQueryParam,
      fetchMoreSearchResults,
      setSearchFilter,
      showPerson,
      filter
    } = this.props

    return (
      <FullPageModal leftSideBarHidden>
        <div className={classes.search}>
          <SearchBar {...{ searchForInput, searchFromQueryString, setSearchTerm, updateQueryParam, setSearchFilter, filter }} />
          <div
            className={classes.searchResults}
            id={SEARCH_RESULTS_ID}
          >
            {searchResults.map(sr =>
              <SearchResult
                key={sr.id}
                searchResult={sr}
                term={searchForInput}
                showPerson={showPerson}
              />)}
            {pending && <Loading type='bottom' />}
            <ScrollListener onBottom={() => fetchMoreSearchResults()} elementId={SEARCH_RESULTS_ID} />
          </div>
        </div>
      </FullPageModal>
    )
  }
}

export function SearchBar ({
  searchForInput,
  searchFromQueryString,
  setSearchTerm,
  updateQueryParam,
  setSearchFilter,
  filter
}) {
  const { t } = useTranslation()
  const onSearchChange = event => {
    const { value } = event.target
    setSearchTerm(value) // no debounce
    updateQueryParam(value) // debounced
  }
  return (
    <div className={classes.searchBar}>
      <TabBar setSearchFilter={setSearchFilter} filter={filter} />
      <TextInput
        theme={classes}
        inputRef={x => x && x.focus()}
        value={searchForInput || searchFromQueryString}
        placeholder={t('Search by keyword for people, posts and groups')}
        onChange={onSearchChange}
      />
    </div>
  )
}

export function TabBar ({ filter, setSearchFilter }) {
  const { t } = useTranslation()
  const tabs = [
    { id: 'all', label: t('All') },
    { id: 'post', label: t('Discussions') },
    { id: 'person', label: t('People') },
    { id: 'comment', label: t('Comments') }
  ]

  return (
    <div className={classes.tabs}>
      <h1>{t('Search')}</h1>
      {tabs.map(({ id, label }) => (
        <span
          key={id}
          className={cx(classes.tab, { [classes.tabActive]: id === filter })}
          onClick={() => setSearchFilter(id)}
        >
          {label}
        </span>
      ))}
    </div>
  )
}

export function SearchResult ({
  searchResult,
  term = '',
  showPerson
}) {
  const { type, content } = searchResult
  if (!content) {
    console.log(`Search Result of "${type}" without data (see DEV-395):`, content)
    return null
  }

  const highlightProps = {
    terms: term.split(' '),
    highlightClassName: classes.highlight
  }

  let component
  switch (type) {
    case 'Person':
      component = (
        <PersonCard
          person={content}
          showPerson={showPerson}
          highlightProps={highlightProps}
        />
      )
      break
    case 'Post':
      component = (
        <PostCard
          className={classes.postcardExpand}
          post={content}
          highlightProps={highlightProps}
        />
      )
      break
    case 'Comment':
      component = (
        <CommentCard
          comment={content}
          expanded={false}
          highlightProps={highlightProps}
        />
      )
      break
  }
  if (!component) return null
  return (
    <div className={classes.searchResult}>
      {component}
    </div>
  )
}

export function PersonCard ({ person, showPerson, highlightProps }) {
  if (!person) return null

  const matchingSkill = get('0', intersection(
    person.skills.map(s => s.name.toLowerCase()),
    highlightProps.terms.map(t => t.toLowerCase())
  ))

  return (
    <div className={classes.personCard} onClick={() => showPerson(person.id)}>
      <RoundImage url={person.avatarUrl} className={classes.personImage} large />
      <div className={classes.personDetails}>
        <Highlight {...highlightProps}>
          <div className={classes.personName}>{person.name}</div>
        </Highlight>
        <div className={classes.personLocation}>{person.location}</div>
      </div>
      {matchingSkill && <Pill label={matchingSkill} className={classes.personSkill} small />}
    </div>
  )
}
