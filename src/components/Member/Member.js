import PropTypes from 'prop-types'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { bgImageStyle } from 'util/index'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import SkillLabel from 'components/SkillLabel'
import './Member.scss'

const { string, shape } = PropTypes

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
      slug,
      member: { id, name, location, tagline, avatarUrl, skills },
      goToPerson,
      canModerate,
      removeMember
    } = this.props

    return <div styleName='member' className={className}>
      {canModerate && <Dropdown styleName='dropdown' toggleChildren={<Icon name='More' />} items={[
        { icon: 'Trash', label: this.props.t('Remove'), onClick: (e) => this.removeOnClick(e, id, name, removeMember) }
      ]} />}
      <div onClick={goToPerson(id, slug)}>
        <div styleName='avatar' style={bgImageStyle(avatarUrl)} />
        <div styleName='name'>{name}</div>
        <div styleName='location'>{location}</div>
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
    location: string,
    tagline: string,
    avatarUrl: string
  }).isRequired
}

export default withTranslation()(Member)
