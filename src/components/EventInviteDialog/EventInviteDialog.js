import React, { Component } from 'react'
import cx from 'classnames'
import { bgImageStyle } from 'util/index'
import ModalDialog from 'components/ModalDialog'
import CheckBox from 'components/CheckBox'
import Button from 'components/Button'
import styles from './EventInviteDialog.scss'
import { humanResponse } from 'store/models/EventInvitation'
import TextInput from 'components/TextInput'

export default class EventInviteDialog extends React.PureComponent {
  state = {
    invitedIds: [],
    searchTerm: ''
  }

  toggleInvite = id => {
    const { invitedIds } = this.state

    if (invitedIds.includes(id)) {
      this.setState({
        invitedIds: invitedIds.filter(invitedId => invitedId !== id)
      })
    } else {
      this.setState({
        invitedIds: invitedIds.concat([id])
      })
    }
  }

  onSearchChange = ({ target: { value } }) => {
    const { fetchPeople, forGroups } = this.props
    const forGroupIds = forGroups.map(c => c.id)
    this.setState({ searchTerm: value })
    fetchPeople(value, forGroupIds)
  }

  getFilteredInviteSuggestions = () => {
    const { eventInvitations } = this.props
    const { searchTerm } = this.state
    return this.props.people.filter(person => {
      return !eventInvitations.map(ei => ei.id).includes(person.id) &&
      person.name.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }

  submit = () => {
    const { eventId, onClose } = this.props
    const { invitedIds } = this.state
    this.props.invitePeopleToEvent(eventId, invitedIds)
    onClose()
  }

  render () {
    const { invitedIds } = this.state
    const { onClose, eventInvitations } = this.props

    const filteredInviteSuggestions = this.getFilteredInviteSuggestions()

    const inviteButtonLabel = invitedIds.length === 0
      ? 'Select people to invite'
      : invitedIds.length === 1
        ? 'Invite 1 person'
        : `Invite ${invitedIds.length} people`

    return <ModalDialog key='event-invite-dialog'
      closeModal={onClose}
      modalTitle={`Invite`}
      showCancelButton={false}
      showSubmitButton={false}
      style={{ width: '100%', maxWidth: '620px' }}>
      <div styleName='container'>
        <Search onChange={this.onSearchChange} />
        <div styleName='inviteSuggestions'>
          {filteredInviteSuggestions.map(invitee => <InviteeRow
            key={invitee.id}
            person={invitee}
            selected={invitedIds.includes(invitee.id)}
            onClick={() => this.toggleInvite(invitee.id)}
          />)}
        </div>
        <div styleName='alreadyInvitedLabel'>Already Invited</div>
        <div styleName='alreadyInvited'>
          {eventInvitations.map(eventInvitation =>
            <InviteeRow
              person={eventInvitation}
              showResponse
              key={eventInvitation.id}
            />)}
        </div>
        <Button
          small
          styleName='inviteButton'
          label={inviteButtonLabel}
          onClick={this.submit}
          disabled={invitedIds.length === 0} />
      </div>
    </ModalDialog>
  }
}

export function InviteeRow ({ person, selected, showResponse, onClick }) {
  const { name, avatarUrl, response } = person

  return <div styleName={cx('row')} onClick={onClick}>
    <div styleName='col'>
      <div styleName='avatar' style={bgImageStyle(avatarUrl)} />
    </div>
    <div styleName='col'>
      {name}
    </div>
    {!showResponse && <div styleName='col check'>
      <CheckBox checked={selected} noInput />
    </div>}
    {showResponse && response && <div styleName='col response'>
      {humanResponse(response)}
    </div>}
  </div>
}

export class Search extends Component {
  render () {
    const { onChange } = this.props

    return <div styleName='search'>
      <TextInput theme={styles}
        inputRef={x => x && x.focus()}
        placeholder='Search members'
        onChange={onChange} />
    </div>
  }
}
