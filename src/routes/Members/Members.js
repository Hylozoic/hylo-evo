import React, { PropTypes, Component } from 'react'
import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import Member from 'components/Member'
import TextInput from 'components/TextInput'
import ScrollListener from 'components/ScrollListener'
import './Members.scss'
const { bool, func, number, string, arrayOf, shape } = PropTypes

function Sort ({sortText}) {
  return <div styleName='sort'>
    <span>{sortText}</span>
    <Icon name='ArrowDown' styleName='sort-icon' />
  </div>
}

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
    changeSort: func
  }

  componentDidMount () {
    // TODO skip this if we already have some
    this.props.fetchMembers(this.props.sortBy)
  }

  fetchMore () {
    const { sortBy, members, hasMore, fetchMembers, pending } = this.props
    if (pending || members.length === 0 || !hasMore) return
    fetchMembers(sortBy, members.length)
  }

  render () {
    const { canInvite, memberCount, members, sortBy, changeSort } = this.props
    const sortKeys = {
      name: 'Name',
      joined: 'Latest',
      location: 'Location'
    }
    const sortText = sortKeys[sortBy]
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
        toggleChildren={<Sort sortText={sortText} />}
        triangle
        alignRight
        items={Object.keys(sortKeys).map(k => ({
          label: sortKeys[k],
          onClick: () => changeSort(k)
        }))} />
      <TextInput placeholder='Search by name or location' styleName='search' />
      <div styleName='members'>
        {members.map(m => <Member member={m} styleName='member' key={m.id} />)}
      </div>
      <ScrollListener onBottom={() => this.fetchMore()} />
    </div>
  }
}
