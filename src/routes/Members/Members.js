import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router-dom'
import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import Member from 'components/Member'
import TextInput from 'components/TextInput'
import ScrollListener from 'components/ScrollListener'
import { CENTER_COLUMN_ID } from 'util/scrolling'
import './Members.scss'
const { bool, func, string, arrayOf, shape } = PropTypes
import { debounce, isEmpty, some, times } from 'lodash/fp'
import { queryParamWhitelist } from 'store/reducers/queryResults'

export default class Members extends Component {
  static propTypes = {
    slug: string,
    sortBy: string,
    members: arrayOf(shape({
      id: string,
      name: string,
      location: string,
      tagline: string,
      avatarUrl: string
    })),
    hasMore: bool,
    changeSort: func,
    changeSearch: func,
    canModerate: bool
  }

  fetchOrShowCached () {
    const { hasMore, members, fetchMembers } = this.props
    if (isEmpty(members) && hasMore !== false) fetchMembers()
  }

  componentDidMount () {
    this.fetchOrShowCached()
  }

  componentDidUpdate (prevProps) {
    if (!prevProps) return
    if (some(key => this.props[key] !== prevProps[key], queryParamWhitelist)) {
      this.fetchOrShowCached()
    }
  }

  fetchMore () {
    const { members, hasMore, fetchMembers, pending } = this.props
    if (pending || members.length === 0 || !hasMore) return
    fetchMembers(members.length)
  }

  search (term) {
    if (!this.debouncedSearch) {
      this.debouncedSearch = debounce(300, this.props.changeSearch)
    }
    return this.debouncedSearch(term)
  }

  render () {
    const {
      memberCount, members, sortBy, changeSort, search, slug, subject, canModerate, removeMember
    } = this.props

    const sortKeys = sortKeysFactory(subject)

    return <div>
      <div styleName='header'>
        {canModerate && <Link to={`/c/${slug}/settings/invite`}>
          <Button styleName='invite'
            label='Invite People'
            color='green-white-green-border'
            narrow />
        </Link>}
        <div styleName='title'>Members</div>
        <div styleName='total-members'>
          {memberCount} Total Members
        </div>
      </div>
      <div styleName='content'>
        <Dropdown styleName='sort-dropdown'
          toggleChildren={<SortLabel text={sortKeys[sortBy]} />}
          alignRight
          items={Object.keys(sortKeys).map(k => ({
            label: sortKeys[k],
            onClick: () => changeSort(k)
          }))} />
        <TextInput placeholder='Search by name or skills'
          styleName='search'
          defaultValue={search}
          onChange={e => this.search(e.target.value)} />
        <div styleName='members'>
          {twoByTwo(members).map(pair => <div styleName='member-row' key={pair[0].id}>
            {pair.map(m => <Member canModerate={canModerate} removeMember={removeMember} member={m} key={m.id} slug={slug} />)}
            {pair.length === 1 && <div />}
          </div>)}
        </div>
      </div>
      <ScrollListener onBottom={() => this.fetchMore()}
        elementId={CENTER_COLUMN_ID} />
    </div>
  }
}

function SortLabel ({ text }) {
  return <div styleName='sort-label'>
    <span>{text}</span>
    <Icon name='ArrowDown' styleName='sort-icon' />
  </div>
}

// these keys must match the values that hylo-node can handle
function sortKeysFactory (subject) {
  const sortKeys = {
    name: 'Name',
    location: 'Location'
  }
  if (subject !== 'network') sortKeys['join'] = 'Newest'
  return sortKeys
}

export function twoByTwo (list) {
  return times(i => list.slice(i * 2, i * 2 + 2), (list.length + 1) / 2)
}
