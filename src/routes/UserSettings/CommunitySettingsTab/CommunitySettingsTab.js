import PropTypes from 'prop-types'
import React, { Component, useState } from 'react'
import './CommunitySettingsTab.scss'
import Affiliation from 'components/Affiliation'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import Membership from 'components/Membership'

import get from 'lodash/get'

const { array, func } = PropTypes

export default class CommunitySettingsTab extends Component {
  static propTypes = {
    affiliations: array,
    memberships: array,
    leaveCommunity: func,
    createAffiliation: func,
    deleteAffiliation: func
  }

  state = {
    affiliations: this.props.affiliations,
    memberships: this.props.memberships,
    errorMessage: undefined,
    successMessage: undefined,
    showAddAffiliations: undefined
  }

  render () {
    const { affiliations, memberships, errorMessage, successMessage, showAddAffiliations } = this.state
    if (!memberships || !affiliations) return <Loading />

    return (
    <div styleName='container'>
      <h1 styleName='title'>Your affiliations with organizations</h1>

      <div styleName='description'>This list automatically shows which communities on Hylo you are a part of. You can also share your affiliations with organizations that are not currently on Hylo.</div>

      { errorMessage || successMessage ? <div styleName={`message ${errorMessage ? 'error' : 'success'}`} onClick={this.resetMessage}>{errorMessage || successMessage }</div> : <></>}

      <h2 styleName='subhead'>Hylo Communities</h2>
      {memberships.map((m, index) =>
        <Membership
          membership={m}
          archive={this.leaveCommunity}
          key={m.id}
          index={index}
        />)}

      <h2 styleName='subhead'>Other Affiliations</h2>
      {affiliations && affiliations.items.length > 0 && affiliations.items.map((a, index) =>
        <Affiliation
          affiliation={a}
          archive={this.deleteAffiliation}
          key={a.id}
          index={index}
        />
      )}

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
        if (res.error) errorMessage = `Error deleting this affiliation.`
        const deletedAffiliationId = get(res, 'payload.data.deleteAffiliation')
        if (deletedAffiliationId) {
          successMessage = `Your affiliation was deleted.`
          affiliations.items = affiliations.items.filter((a) => a.id !== deletedAffiliationId)
        }
        return this.setState({ affiliations, errorMessage, successMessage })
      })
  }

  leaveCommunity = (community) => {
    const { leaveCommunity } = this.props
    let { memberships } = this.state

    leaveCommunity(community.id)
      .then(res => {
        let errorMessage, successMessage
        if (res.error) errorMessage = `Error leaving ${community.name || 'this community'}.`
        const deletedCommunityId = get(res, 'payload.data.leaveCommunity')
        if (deletedCommunityId) {
          successMessage = `You left ${community.name || 'this community'}.`
          memberships = memberships.filter((m) => m.community.id !== deletedCommunityId)
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
          successMessage = `Your affiliation was added`
          affiliations.items.push(affiliation)
        }
        return this.setState({ affiliations, errorMessage, successMessage, showAddAffiliations: !!errorMessage })
      })
  }

  resetMessage = () => {
    this.setState({ errorMessage: undefined, successMessage: undefined })
  }

  toggleAddAffiliations = () => {
    this.setState({ showAddAffiliations: !this.state.showAddAffiliations })
  }
}

export function AddAffiliation ({ close, save }) {
  const PREPOSITIONS = [
    { id: 'of', label: 'of' },
    { id: 'at', label: 'at' },
    { id: 'for', label: 'for' },
  ]

  const [role, setRole] = useState('')
  const [preposition, setPreposition] = useState(PREPOSITIONS[0].id)
  const [orgName, setOrgName] = useState('')
  const [url, setUrl] = useState('')

  const canSave = role.length && orgName.length
  
  const URL_PROTOCOL = 'http://'
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
        toggleChildren={<span >
          {PREPOSITIONS.find(o => o.id === preposition).label}
          <Icon name='ArrowDown' />
        </span>}
        items={PREPOSITIONS.map(({ id, label }) => ({
          label,
          onClick: () => setPreposition(id)
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
        <span onClick={canSave ? () => save({ role, preposition, orgName, url: formatUrl(url) }) : undefined}>Add Affiliation</span>
      </div>

    </div>
  </div>
  )
}