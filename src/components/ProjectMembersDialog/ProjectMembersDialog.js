import React from 'react'
import { filter, get } from 'lodash/fp'
import cx from 'classnames'
import { bgImageStyle } from 'util/index'
import ModalDialog from 'components/ModalDialog'
import TextInput from 'components/TextInput'
import Member from 'components/Member'
import './ProjectMembersDialog.scss'

export default class ProjectMembersDialog extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      searchString: '',
      selectedMember: this.props.members[0],
      members: this.props.members
    }
  }

  selectMember = member => () => this.setState({
    selectedMember: member
  })
  
  search = ({ target }) => {
    const searchString = target.value
    const membersFilter = (m) => m.name.toLowerCase().includes(searchString.toLowerCase())

    this.setState({
      searchString,
      members: filter(membersFilter, this.props.members)}
    )
  }
  
  render () {
    const { members, searchString, selectedMember } = this.state
    const { onClose } = this.props
    const loading = false

    return <ModalDialog key='members-dialog'
      closeModal={onClose}
      modalTitle={`Project Members (${this.props.members.length})`}
      showCancelButton={false}
      showSubmitButton={false}
      style={{width: '100%', maxWidth: '600px'}}>
        <div styleName='container'>
          {/* 
            TODO: Can make memberDetails optional by adding a `withDetails` flag
            sending in `goToMember` and switchin the onClick on a `MemberRow` to
            go there instead of showing detail and making adding a conditional
            style to make width of members-list be 100% in that case.
          */}
          <div styleName='members-list'>
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
              {members.map(member => 
                <MemberRow
                  member={member}
                  selected={member.id === get('id', selectedMember)}
                  onClick={this.selectMember(member)}
                  key={member.id} />
              )}
            </section>
          </div>
          {selectedMember && <MemberDetail member={selectedMember} />}
        </div>
    </ModalDialog>
  }
}

function MemberRow ({member, selected, onClick}) {
  const { name, avatarUrl } = member

  return <div styleName={cx('row', {selected})} onClick={onClick}>
    <div styleName='col'>
      <div styleName='avatar' style={bgImageStyle(avatarUrl)} />
    </div>
    <div styleName='col'>
      {name}
    </div>
  </div>
}

function MemberDetail ({member}) {
  return <div styleName='member-detail'>
    <Member member={member} styleName='member' />
  </div>
}
