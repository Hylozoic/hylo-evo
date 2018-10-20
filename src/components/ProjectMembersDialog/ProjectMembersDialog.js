import React from 'react'
import { filter, times } from 'lodash/fp'
import ModalDialog from 'components/ModalDialog'
import TextInput from 'components/TextInput'
import { bgImageStyle } from 'util/index'
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
      modalTitle={`Project Members (${this.props.members.length})`}
      showCancelButton={false}
      showSubmitButton={false}>
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
        <section>
          {members.map(member => <MemberRow member={member} key={member.id} />)}
        </section>
    </ModalDialog>
  }
}

function MemberRow ({
  member: {
    name,
    avatarUrl
  }
}) {
  return <div styleName='row'>
    <div styleName='col'>
      <div styleName='avatar' style={bgImageStyle(avatarUrl)} />
    </div>
    <div styleName='col'>
      {name}
    </div>
  </div>
}
