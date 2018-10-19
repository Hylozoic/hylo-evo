import React from 'react'
import { filter, times } from 'lodash/fp'
import ModalDialog from 'components/ModalDialog'
import TextInput from 'components/TextInput'
import Member from 'components/Member'
import './ProjectMembersDialog.scss'

export default class ProjectMembersDialog extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      searchString: '',
      members: this.props.members
    }
  }
  
  search = ({ target }) => {
    const searchString = target.value
    const membersFilter = (m) => m.name.toLowerCase().includes(searchString.toLowerCase())

    this.setState({
      searchString,
      members: filter(membersFilter, this.props.members)}
    )
  }
  
  render () {
    const { members, searchString } = this.state
    const { onClose, slug } = this.props
    const loading = false

    return <ModalDialog key='members-dialog'
      closeModal={onClose}
      modalTitle='Project Members'
      notificationIconName='Star'
      showCancelButton={false}
      showSubmitButton={false}
      useNotificationFormat={false}>
        <TextInput
          styleName='members-search-input'
          aria-label='members-search'
          autoFocus
          label='members-search'
          name='members-search'
          onChange={this.search}
          loading={loading}
          value={searchString}
          placeholder='Find a member'
        />
        <div>
          {twoByTwo(members).map(pair => <div styleName='member-row' key={pair[0].id}>
            {pair.map(m => <Member
              styleName='member-card'
              member={m}
              slug={slug}
              subject={'project'}
              key={m.id}
            />)}
          </div>)}
        </div>
    </ModalDialog>
  }
}

export function twoByTwo (list) {
  return times(i => list.slice(i * 2, i * 2 + 2), (list.length + 1) / 2)
}
