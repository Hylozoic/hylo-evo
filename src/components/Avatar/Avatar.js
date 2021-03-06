import PropTypes from 'prop-types'
import React from 'react'
import RoundImage from '../RoundImage'
import { Link } from 'react-router-dom'

const { string, bool } = PropTypes

export default function Avatar ({ url, avatarUrl, tiny, small, medium, className }) {
  return url ? <Link to={url} className={className}>
    <RoundImage url={avatarUrl} small={small} medium={medium} tiny={tiny} />
  </Link>
    : <span className={className}><RoundImage url={avatarUrl} small={small} medium={medium} tiny={tiny} /></span>
}
Avatar.propTypes = {
  url: string.isRequired,
  avatarUrl: string.isRequired,
  small: bool,
  medium: bool,
  className: string
}
