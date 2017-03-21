// RFC: Started out calling this Avatar, but renamed to RoundImage as it doesn't
// replicate all the functionality of Avatar from the current app. Imagining
// this component will be imported by the Avatar component.
// Not sure if this is too much granularity.

import React from 'react'
import RoundImage from 'components/RoundImage'
import { Link } from 'react-router-dom'

const { string, bool } = React.PropTypes

export default function Avatar ({ url, avatarUrl, small, medium, className }) {
  return <Link to={url} className={className}>
    <RoundImage url={avatarUrl} small={small} medium={medium} />
  </Link>
}
RoundImage.propTypes = {
  url: string.isRequired,
  small: bool,
  medium: bool,
  overlaps: bool,
  className: string
}
