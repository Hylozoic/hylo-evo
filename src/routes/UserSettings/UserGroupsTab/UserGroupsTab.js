import PropTypes from 'prop-types'
import React, { Component, useState } from 'react'
import get from 'lodash/get'
import LayoutFlagsContext from 'contexts/LayoutFlagsContext'
import { HyloApp } from 'hylo-shared'
import {
  CREATE_AFFILIATION,
  DELETE_AFFILIATION,
  LEAVE_GROUP
} from 'store/constants'
import Affiliation from 'components/Affiliation'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import Membership from 'components/Membership'
import './UserGroupsTab.scss'

const { array, func, object, string } = PropTypes

export default class UserGroupsTab extends Component {
  static propTypes = {
    action: string,
    affiliations: object,
    memberships: array,
    leaveGroup: func,
    createAffiliation: func,
    deleteAffiliation: func
  }

  static contextType = LayoutFlagsContext

  state = {
    affiliations: this.props.affiliations,
    memberships: this.props.memberships,
    errorMessage: undefined,
    successMessage: undefined,
    showAddAffiliations: undefined
  }

  render () {
    const { action } = this.props
    const { affiliations, memberships, errorMessage, successMessage, showAddAffiliations } = this.state
    const displayMessage = errorMessage || successMessage
    if (!memberships || !affiliations) return <Loading />

    return (
      <div styleName='container'>
        <h1 styleName='title'>Your affiliations with organizations</h1>

        <div styleName='description'>This list automatically shows which groups on Hylo you are a part of. You can also share your affiliations with organizations that are not currently on Hylo.</div>

        <h2 styleName='subhead'>Hylo Groups</h2>
        {action === LEAVE_GROUP && displayMessage && <Message errorMessage={errorMessage} successMessage={successMessage} reset={this.resetMessage} />}
        {memberships.map((m, index) =>
          <Membership
            membership={m}
            archive={this.leaveGroup}
            key={m.id}
            index={index}
          />)}

        <h2 styleName='subhead'>Other Affiliations</h2>
        {action === DELETE_AFFILIATION && displayMessage && <Message errorMessage={errorMessage} successMessage={successMessage} reset={this.resetMessage} />}
        {affiliations && affiliations.items.length > 0 && affiliations.items.map((a, index) =>
          <Affiliation
            affiliation={a}
            archive={this.deleteAffiliation}
            key={a.id}
            index={index}
          />
        )}

        { action === CREATE_AFFILIATION && displayMessage && <Message errorMessage={errorMessage} successMessage={successMessage} reset={this.resetMessage} />}

        {showAddAffiliations ? <AddAffiliation close={this.toggleAddAffiliations} save={this.saveAffiliation} /> : (
          <div styleName='add-affiliation' onClick={this.toggleAddAffiliations}>
            <div styleName='plus'>+</div>
            <div>Add new affiliation</div>
          </div>
        )}
      </div>
    )
  }

  deleteAffiliation = (affiliationId) => {
    const { deleteAffiliation } = this.props
    const { affiliations } = this.state

    deleteAffiliation(affiliationId)
      .then(res => {
        let errorMessage, successMessage
        if (res.error) errorMessage = 'Error deleting this affiliation.'
        const deletedAffiliationId = get(res, 'payload.data.deleteAffiliation')
        if (deletedAffiliationId) {
          successMessage = 'Your affiliation was deleted.'
          affiliations.items = affiliations.items.filter((a) => a.id !== deletedAffiliationId)
        }
        return this.setState({ affiliations, errorMessage, successMessage })
      })
  }

  leaveGroup = (group) => {
    const { leaveGroup } = this.props
    const { hyloAppLayout } = this.context
    let { memberships } = this.state

    leaveGroup(group.id)
      .then(res => {
        let errorMessage, successMessage
        if (res.error) errorMessage = `Error leaving ${group.name || 'this group'}.`
        const deletedGroupId = get(res, 'payload.data.leaveGroup')
        if (deletedGroupId) {
          successMessage = `You left ${group.name || 'this group'}.`
          memberships = memberships.filter((m) => m.group.id !== deletedGroupId)
        }

        if (hyloAppLayout) {
          HyloApp.sendMessageToWebView(HyloApp.LEFT_GROUP, { groupId: deletedGroupId })
        }

        return this.setState({ memberships, errorMessage, successMessage })
      })
  }

  saveAffiliation = ({ role, preposition, orgName, url }) => {
    const { affiliations } = this.state
    this.props.createAffiliation({ role, preposition, orgName, url })
      .then(res => {
        let errorMessage, successMessage
        if (res.error) errorMessage = get(res, 'payload.message', 'Error adding your affiliation.')
        const affiliation = get(res, 'payload.data.createAffiliation')
        if (affiliation) {
          successMessage = 'Your affiliation was added'
          affiliations.items.push(affiliation)
        }
        return this.setState({ affiliations, errorMessage, successMessage, showAddAffiliations: !!errorMessage })
      })
  }

  resetMessage = () => {
    this.setState({ action: undefined, errorMessage: undefined, successMessage: undefined })
  }

  toggleAddAffiliations = () => {
    this.setState({ showAddAffiliations: !this.state.showAddAffiliations })
  }
}

export function AddAffiliation ({ close, save }) {
  const PREPOSITIONS = ['of', 'at', 'for']

  const [role, setRole] = useState('')
  const [preposition, setPreposition] = useState(PREPOSITIONS[0])
  const [orgName, setOrgName] = useState('')
  const [url, setUrl] = useState('')

  const canSave = role.length && orgName.length

  const URL_PROTOCOL = 'https://'
  const CHAR_LIMIT = 30

  const formatUrl = url => `${URL_PROTOCOL}${url}`

  return (
    <div styleName='affiliation-form'>
      <div styleName='header'>
        <h3>Add new affiliation</h3>
        <div styleName='close' onClick={close}>x</div>
      </div>

      <div styleName='body'>

        <div>
          <input
            type='text'
            onChange={e => setRole(e.target.value.substring(0, CHAR_LIMIT))}
            placeholder='Name of role'
            value={role}
          />
          <div styleName='chars'>{role.length}/{CHAR_LIMIT}</div>
        </div>

        <Dropdown
          toggleChildren={
            <span>
              {PREPOSITIONS.find(p => p === preposition)}
              <Icon name='ArrowDown' />
            </span>
          }
          items={PREPOSITIONS.map(p => ({
            label: p,
            onClick: () => setPreposition(p)
          }))}
          alignLeft
          styleName='dropdown' />

        <div>
          <input
            type='text'
            onChange={e => setOrgName(e.target.value.substring(0, CHAR_LIMIT))}
            placeholder='Name of organization'
            value={orgName}
          />
          <div styleName='chars'>{orgName.length}/{CHAR_LIMIT}</div>
        </div>

        <div>
          <input
            type='text'
            onChange={e => setUrl(e.target.value.substring(URL_PROTOCOL.length))}
            placeholder='URL of organization'
            value={formatUrl(url)}
          />
        </div>

        <div styleName={`save ${canSave ? '' : 'disabled'}`}>
          <span onClick={canSave ? () => save({ role, preposition, orgName, url }) : undefined}>Add Affiliation</span>
        </div>

      </div>
    </div>
  )
}

export function Message ({ errorMessage, successMessage, reset }) {
  return (
    <div styleName={`message ${errorMessage ? 'error' : 'success'}`} onClick={reset}>{errorMessage || successMessage }</div>
  )
}
