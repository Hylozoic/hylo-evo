import React from 'react'
import { Link } from 'react-router-dom'
import { bgImageStyle } from 'util/index'
import './Member.scss'

const { string, shape } = React.PropTypes

export default function Member ({ className, member: { id, name, location, tagline, avatarUrl } }) {
  return <Link styleName='member' to={`/u/${id}`} className={className}>
    <div styleName='avatar' style={bgImageStyle(avatarUrl)} />
    <div styleName='name'>{name}</div>
    <div styleName='location'>{location}</div>
    <div styleName='tagline'>{tagline}</div>
  </Link>
}
Member.propTypes = {
  className: string,
  member: shape({
    id: string,
    name: string,
    location: string,
    tagline: string,
    avatarUrl: string
  }).isRequired
}
