import PropTypes from 'prop-types'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { bgImageStyle } from 'util/index'
import BadgeEmoji from 'components/BadgeEmoji'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import SkillLabel from 'components/SkillLabel'
import './Member.scss'
import { RESP_REMOVE_MEMBERS } from 'store/constants'
import getResponsibilitiesForGroup from 'store/selectors/getResponsibilitiesForGroup'
import { combineRoles } from 'store/models/Person'

const { object, string, shape } = PropTypes

class Member extends React.Component {
  removeOnClick (e, id, name, removeMember) {
    e.preventDefault()

    if (window.confirm(this.props.t('are you sure you want to remove {{name}}?', { name }))) {
      removeMember(id)
    }
  }

  render () {
    const {
      className,
      group,
      member,
      goToPerson,
      removeMember,
      currentUser,
      t
    } = this.props

    const { id, name, location, tagline, avatarUrl, skills } = member

    console.log("this.props.member", this.props.member)
    const roles = combineRoles({ person: member, groupId: group.id })
    const currentUserResponsibilities = getResponsibilitiesForGroup({ currentUser, groupId: group.id }).map(r => r.title)
    return (
      <div styleName='member' className={className}>
        {(currentUserResponsibilities.includes(RESP_REMOVE_MEMBERS)) &&
          <Dropdown
            styleName='dropdown'
            toggleChildren={<Icon name='More' />}
            items={[{ icon: 'Trash', label: t('Remove'), onClick: (e) => this.removeOnClick(e, id, name, removeMember) }]}
          />}
        <div onClick={goToPerson(id, group.slug)}>
          <div styleName='avatar' style={bgImageStyle(avatarUrl)} />
          <div styleName='name'>{name}</div>
          <div styleName='location'>{location}</div>
          <div styleName='badgeRow'>
            {roles.map(role => (
              <BadgeEmoji key={role.name} expanded {...role} responsibilities={role.responsibilities} id={id} />
            ))}
          </div>
          {skills && <div styleName='skills'>
            {skills.map((skill, index) =>
              <SkillLabel key={index} styleName='skill'>{skill.name}</SkillLabel>
            )}
          </div>}
          <div styleName='tagline'>{tagline}</div>
        </div>
      </div>
    )
  }
}

Member.propTypes = {
  className: string,
  group: object,
  member: shape({
    id: string,
    name: string,
    location: string,
    tagline: string,
    avatarUrl: string
  }).isRequired
}

export default withTranslation()(Member)
