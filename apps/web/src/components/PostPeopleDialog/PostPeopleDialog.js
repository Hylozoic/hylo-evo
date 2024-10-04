import React from 'react'
import { withTranslation } from 'react-i18next'
import { filter, get } from 'lodash/fp'
import cx from 'classnames'
import { bgImageStyle } from 'util/index'
import ModalDialog from 'components/ModalDialog'
import TextInput from 'components/TextInput'
import Member from 'components/Member'
import classes from './PostPeopleDialog.module.scss'
import { humanResponse } from 'store/models/EventInvitation'

class PostPeopleDialog extends React.PureComponent {
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
      members: filter(membersFilter, this.props.members)
    })
  }

  render () {
    const { members, searchString, selectedMember } = this.state
    const { onClose, currentGroup, title = this.props.t('People') } = this.props
    const loading = false

    return (
      <ModalDialog
        key='members-dialog'
        closeModal={onClose}
        modalTitle={`${title} (${this.props.members.length})`}
        showCancelButton={false}
        showSubmitButton={false}
        style={{ width: '100%', maxWidth: '620px' }}>
        <div className={classes.container}>
          {/*
            Note: Can make memberDetails optional by adding a `withDetails` flag
            sending in `goToMember` and switchin the onClick on a `MemberRow` to
            go there instead of showing detail and making adding a conditional
            style to make width of members-list be 100% in that case.
          */}
          <div className={classes.membersList}>
            {this.props.members.length > 7 && <TextInput
              className={classes.membersSearchInput}
              aria-label='members-search'
              autoFocus
              label='members-search'
              name='members-search'
              onChange={this.search}
              loading={loading}
              value={searchString}
              placeholder={this.props.t('Find a member')}
            />}
            <section>
              {members.map(member => <MemberRow
                member={member}
                selected={member.id === get('id', selectedMember)}
                onClick={this.selectMember(member)}
                key={member.id} />)}
            </section>
          </div>
          {selectedMember && <MemberDetail member={selectedMember} currentGroup={currentGroup} />}
        </div>
      </ModalDialog>
    )
  }
}

function MemberRow ({ member, selected, onClick }) {
  const { name, avatarUrl, response } = member

  return (
    <div className={cx(classes.row, { [classes.selected]: selected })} onClick={onClick}>
      <div className={classes.col}>
        <div className={classes.avatar} style={bgImageStyle(avatarUrl)} />
      </div>
      <div className={classes.col}>
        {name}
      </div>
      {response && <div className={cx(classes.col, classes.response)}>
        {humanResponse(response)}
      </div>}
    </div>
  )
}

function MemberDetail ({ member, currentGroup }) {
  return (
    <div className={classes.memberDetail}>
      <Member member={member} className={classes.member} group={currentGroup} />
    </div>
  )
}

export default withTranslation()(PostPeopleDialog)
