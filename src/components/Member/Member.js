import PropTypes from 'prop-types'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { bgImageStyle } from 'util/index'
import BadgeEmoji from 'components/BadgeEmoji'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import SkillLabel from 'components/SkillLabel'
import './Member.scss'

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
      member: { id, name, location, tagline, avatarUrl, skills, moderatedGroupMemberships, groupRoles },
      goToPerson,
      canModerate,
      removeMember,
      t
    } = this.props

    const badges = (group.id && groupRoles.filter(role => role.groupId === group.id)) || []
    const creatorIsModerator = moderatedGroupMemberships.find(moderatedMembership => moderatedMembership.groupId === group.id)

    return (
      <div styleName='member' className={className}>
        {canModerate &&
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
            {creatorIsModerator && (
              <BadgeEmoji key='mod' expanded emoji='🛡️' isModerator name={group?.moderatorDescriptor || t('Moderator')} id={id} />
            )}
            {badges.map(badge => (
              <BadgeEmoji key={badge.name} expanded {...badge} id={id} />
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
