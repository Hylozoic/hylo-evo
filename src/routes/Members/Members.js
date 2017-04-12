import React, { PropTypes, Component } from 'react'
import { sortBy } from 'lodash/fp'
import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import Member from 'components/Member'
import TextInput from 'components/TextInput'
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
    total: number,
    sort: string,
    members: arrayOf(shape({
      id: string,
      name: string,
      location: string,
      tagline: string,
      avatarUrl: string
    })),
    changeSort: func
  }

  componentDidMount () {
    this.props.fetchMembers()
  }

  render () {
    const { canInvite, total, members, sort, changeSort } = this.props
    const sortKeys = {
      name: 'Name',
      joined: 'Latest',
      location: 'Location'
    }
    const sortText = sortKeys[sort]
    const membersSorted = sortBy(sort, members)
    return <div>
      {canInvite && <Button styleName='invite'
        label='Invite People'
        color='green-white-green-border'
        narrow />}
      <div styleName='title'>Members</div>
      <div styleName='total-members'>{total} Total Members</div>
      <Dropdown styleName='sort-dropdown'
        toggleChildren={<Sort sortText={sortText} />}
        triangle
        items={Object.keys(sortKeys).map(k => ({
          label: sortKeys[k],
          onClick: () => changeSort(k)
        }))} />
      <TextInput placeholder='Search by name or location' styleName='search' />
      <div styleName='members'>
        {membersSorted.map(m =>
          <Member member={m} styleName='member' key={`member${m.id}`} />)}
      </div>
    </div>
  }
}
