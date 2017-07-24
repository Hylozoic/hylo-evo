import React from 'react'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import { bgImageStyle } from 'util/index'
import './Member.scss'

const { string, shape } = React.PropTypes

export default class Member extends React.Component {
  deleteOnClick (e, id, name) {
    e.preventDefault()

    if (window.confirm(`are you sure you want to remove ${name}?`)) {
      console.log('blas')
    }
  }

  render () {
    const {
      className,
      slug,
      member: {id, name, location, tagline, avatarUrl},
      goToPerson
    } = this.props

    return <div styleName='member' className={className}>
      <Dropdown styleName='dropdown' toggleChildren={<Icon name='More' />} items={[
        {icon: 'Trash', label: 'Delete', onClick: (e) => this.deleteOnClick(e, id, name)}
      ]} />
      <div onClick={goToPerson(id, slug)}>
        <div styleName='avatar' style={bgImageStyle(avatarUrl)} />
        <div styleName='name'>{name}</div>
        <div styleName='location'>{location}</div>
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
