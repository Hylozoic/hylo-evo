import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './CommunitySettingsTab.scss'
import Affiliation from 'components/Affiliation'
import Loading from 'components/Loading'
import Membership from 'components/Membership'

const { array, func } = PropTypes

export default class CommunitySettingsTab extends Component {
  static propTypes = {
    affiliations: array,
    memberships: array,
    leaveCommunity: func,
    deleteAffiliation: func
  }

  render () {
    const { affiliations, deleteAffiliation, memberships, leaveCommunity } = this.props
    if (!memberships || !affiliations) return <Loading />

    return <div>
      <div styleName='title'>Your affiliations with organizations</div>

      <div styleName='description'>This list automatically shows which communities on Hylo you are a part of. You can also share your affiliations with organizations that are not currently on Hylo.</div>

      <div styleName='subhead'>Hylo Communities</div>
      {memberships.map((m, index) =>
        <Membership
          membership={m}
          archive={leaveCommunity}
          key={m.id}
          index={index}
        />)}

      <div styleName='subhead'>Other Affiliations</div>
      {affiliations && affiliations.items.length > 0 && affiliations.items.map((a, index) =>
        <Affiliation
          affiliation={a}
          archive={deleteAffiliation}
          key={a.id}
          index={index}
        />
      )}
    </div>
  }
}
