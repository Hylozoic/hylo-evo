import PropTypes from 'prop-types'
import React from 'react'
import { bgImageStyle } from 'util/index'
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
      slug,
      member: { id, name, locationText, tagline, avatarUrl, skills },
      goToPerson,
      canModerate,
      removeMember
    } = this.props

    return <div styleName='member' className={className}>
      {canModerate && <Dropdown styleName='dropdown' toggleChildren={<Icon name='More' />} items={[
        { icon: 'Trash', label: 'Remove', onClick: (e) => this.removeOnClick(e, id, name, removeMember) }
      ]} />}
      <div onClick={goToPerson(id, slug)}>
        <div styleName='avatar' style={bgImageStyle(avatarUrl)} />
        <div styleName='name'>{name}</div>
        <div styleName='location'>{locationText}</div>
        {skills && <div styleName='skills'>
          {skills.map((skill, index) =>
            <SkillLabel key={index} styleName='skill'>{skill.name}</SkillLabel>
          )}
        </div>}
        <div styleName='tagline'>{tagline}</div>
      </div>
    </div>
  }
}

Member.propTypes = {
  className: string,
  slug: string,
  member: shape({
    id: string,
    name: string,
    locationText: string,
    tagline: string,
    avatarUrl: string
  }).isRequired
}
