import PropTypes from 'prop-types'
import React from 'react'
import RoundImage from 'components/RoundImage'
import { Link } from 'react-router-dom'

const { string, bool } = PropTypes

export default function Avatar ({ url, avatarUrl, small, medium, className }) {
  return <Link to={url} className={className}>
    <RoundImage url={avatarUrl} small={small} medium={medium} />
  </Link>
}
Avatar.propTypes = {
  url: string.isRequired,
  avatarUrl: string,
  small: bool,
  medium: bool,
  className: string
}
