import PropTypes from 'prop-types'
import React from 'react'
import RoundImage from '../RoundImage'
import { Link } from 'react-router-dom'

const { string, bool } = PropTypes

export default function Avatar ({ url, avatarUrl, small, medium, className, ...props }) {
  if (url) {
    return <Link to={url} className={className} {...props}>
      <RoundImage url={avatarUrl} small={small} medium={medium} />
    </Link>
  } else {
    return <RoundImage className={className} url={avatarUrl} small={small} medium={medium} {...props} />
  }
}
Avatar.propTypes = {
  url: string,
  avatarUrl: string.isRequired,
  small: bool,
  medium: bool,
  className: string
}
