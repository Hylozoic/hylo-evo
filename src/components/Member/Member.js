import PropTypes from 'prop-types'
import React from 'react'
import { bgImageStyle } from 'util/index'
import BadgeEmoji from 'components/BadgeEmoji'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import SkillLabel from 'components/SkillLabel'
import './Member.scss'

const { string, shape } = PropTypes

export default class Member extends React.Component {
  removeOnClick (e, id, name, removeMember) {
    e.preventDefault()

    if (window.confirm(`are you sure you want to remove ${name}?`)) {
      removeMember(id)
    }
  }

  render () {
    const {
      className,
      groupId,
      slug,
      member: { id, name, location, tagline, avatarUrl, skills, moderatedGroupMemberships, groupRoles },
      goToPerson,
      canModerate,
      removeMember
    } = this.props

    const badges = (groupId && groupRoles.filter(role => role.groupId === groupId)) || []
    const creatorIsModerator = moderatedGroupMemberships.find(moderatedMembership => moderatedMembership.groupId === groupId)

    return (
      <div styleName='member' className={className}>
        {canModerate && <Dropdown styleName='dropdown' toggleChildren={<Icon name='More' />} items={[
          { icon: 'Trash', label: 'Remove', onClick: (e) => this.removeOnClick(e, id, name, removeMember) }
        ]} />}
        <div onClick={goToPerson(id, slug)}>
          <div styleName='avatar' style={bgImageStyle(avatarUrl)} />
          <div styleName='name'>{name}</div>
          <div styleName='location'>{location}</div>
          {badges.length > 0 && (
            <div styleName='badgeRow'>
              {creatorIsModerator && (
                <BadgeEmoji key='mod' expanded emoji='🛡️' isModerator name='Moderator' />
              )}
              {badges.map(badge => (
                <BadgeEmoji key={badge.name} expanded {...badge} />
              ))}
            </div>
          )}
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
  slug: string,
  member: shape({
    id: string,
    name: string,
    location: string,
    tagline: string,
    avatarUrl: string
  }).isRequired
}
