import PropTypes from 'prop-types'
import React from 'react'
import RoundImage from '../RoundImage'
import { Link } from 'react-router-dom'

export default function Avatar ({ url, avatarUrl, tiny, small, medium, className }) {
  if (url) {
    return (
      <Link to={url} className={className}>
        <RoundImage url={avatarUrl} small={small} medium={medium} tiny={tiny} />
      </Link>
    )
  } else {
    return (
      <span className={className}><RoundImage url={avatarUrl} small={small} medium={medium} tiny={tiny} /></span>
    )
  }
}

Avatar.propTypes = {
  url: PropTypes.string,
  avatarUrl: PropTypes.string,
  small: PropTypes.bool,
  medium: PropTypes.bool,
  className: PropTypes.string
}
