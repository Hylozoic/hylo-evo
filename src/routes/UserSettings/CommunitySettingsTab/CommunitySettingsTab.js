import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './CommunitySettingsTab.scss'
import Affiliation from 'components/Affiliation'
import Loading from 'components/Loading'
import Membership from 'components/Membership'

import get from 'lodash/get'

const { array, func } = PropTypes

export default class CommunitySettingsTab extends Component {
  static propTypes = {
    affiliations: array,
    memberships: array,
    leaveCommunity: func,
    deleteAffiliation: func
  }

  state = {
    affiliations: this.props.affiliations,
    memberships: this.props.memberships,
    errorMessage: undefined,
    successMessage: undefined
  }

  render () {
    const { affiliations, memberships, errorMessage, successMessage } = this.state
    if (!memberships || !affiliations) return <Loading />

    return <div>
      <div styleName='title'>Your affiliations with organizations</div>

      <div styleName='description'>This list automatically shows which communities on Hylo you are a part of. You can also share your affiliations with organizations that are not currently on Hylo.</div>

      { errorMessage || successMessage ? <div styleName={`message ${errorMessage ? 'error' : 'success'}`} onClick={this.resetMessage}>{errorMessage || successMessage }</div> : <></>}

      <div styleName='subhead'>Hylo Communities</div>
      {memberships.map((m, index) =>
        <Membership
          membership={m}
          archive={this.leaveCommunity}
          key={m.id}
          index={index}
        />)}

      <div styleName='subhead'>Other Affiliations</div>
      {affiliations && affiliations.items.length > 0 && affiliations.items.map((a, index) =>
        <Affiliation
          affiliation={a}
          archive={this.deleteAffiliation}
          key={a.id}
          index={index}
        />
      )}
    </div>
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

  resetMessage = () => {
    this.setState({ errorMessage: undefined, successMessage: undefined })
  }
}
