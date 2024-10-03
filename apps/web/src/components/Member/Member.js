import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { bgImageStyle } from 'util/index'
import BadgeEmoji from 'components/BadgeEmoji'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import SkillLabel from 'components/SkillLabel'
import { RESP_REMOVE_MEMBERS } from 'store/constants'

import classes from './Member.module.scss'

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
      currentUserResponsibilities,
      roles,
      t
    } = this.props

    const { id, name, location, tagline, avatarUrl, skills } = member

    return (
      <div className={cx(classes.member, className)}>
        {(currentUserResponsibilities.includes(RESP_REMOVE_MEMBERS)) &&
          <Dropdown
            className={classes.dropdown}
            toggleChildren={<Icon name='More' />}
            items={[{ icon: 'Trash', label: t('Remove'), onClick: (e) => this.removeOnClick(e, id, name, removeMember) }]}
          />}
        <div onClick={goToPerson(id, group.slug)}>
          <div className={classes.avatar} style={bgImageStyle(avatarUrl)} />
          <div className={classes.name}>{name}</div>
          <div className={classes.location}>{location}</div>
          <div className={classes.badgeRow}>
            {roles.map(role => (
              <BadgeEmoji key={role.id + role.common} expanded {...role} responsibilities={role.responsibilities} id={id} />
            ))}
          </div>
          {skills && <div className={classes.skills}>
            {skills.map((skill, index) =>
              <SkillLabel key={index} className={classes.skill}>{skill.name}</SkillLabel>
            )}
          </div>}
          <div className={classes.tagline}>{tagline}</div>
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
