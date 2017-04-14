import React, { PropTypes, Component } from 'react'
import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import Member from 'components/Member'
import TextInput from 'components/TextInput'
import ScrollListener from 'components/ScrollListener'
import './Members.scss'
const { bool, func, string, arrayOf, shape } = PropTypes
import { debounce, some } from 'lodash/fp'
import { queryParamWhitelist } from 'store/reducers/queryResults'

export default class Members extends Component {
  static propTypes = {
    canInvite: bool,
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
    changeSearch: func
  }

  fetchOrShowCached () {
    // TODO skip fetching if cached results are available
    this.props.fetchMembers()
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
      canInvite, memberCount, members, sortBy, changeSort, search
    } = this.props
    return <div>
      {canInvite && <Button styleName='invite'
        label='Invite People'
        color='green-white-green-border'
        narrow />}
      <div styleName='title'>Members</div>
      <div styleName='total-members'>
        {memberCount} Total Members
      </div>
      <Dropdown styleName='sort-dropdown'
        toggleChildren={<SortLabel text={sortKeys[sortBy]} />}
        triangle
        alignRight
        items={Object.keys(sortKeys).map(k => ({
          label: sortKeys[k],
          onClick: () => changeSort(k)
        }))} />
      <TextInput placeholder='Search by name or location'
        styleName='search'
        defaultValue={search}
        onChange={e => this.search(e.target.value)} />
      <div styleName='members'>
        {members.map(m => <Member member={m} styleName='member' key={m.id} />)}
      </div>
      <ScrollListener onBottom={() => this.fetchMore()} />
    </div>
  }
}

function SortLabel ({ text }) {
  return <div styleName='sort'>
    <span>{text}</span>
    <Icon name='ArrowDown' styleName='sort-icon' />
  </div>
}

const sortKeys = {
  name: 'Name',
  joined: 'Latest',
  location: 'Location'
}
