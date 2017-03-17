// RFC: Started out calling this Avatar, but renamed to RoundImage as it doesn't
// replicate all the functionality of Avatar from the current app. Imagining
// this component will be imported by the Avatar component.
// Not sure if this is too much granularity.

import React from 'react'
import cx from 'classnames'
import RoundImage from 'components/RoundImage'
import { personUrl } from 'util/index'
import { Link } from 'react-router-dom'

const { string, bool } = React.PropTypes

export default function Avatar ({ person, small, medium, className }) {
  return <Link to={personUrl(person)} className={className}>
    <RoundImage url={person.avatarUrl} small={small} medium={medium} />
  </Link>
}
RoundImage.propTypes = {
  url: string.isRequired,
  small: bool,
  medium: bool,
  overlaps: bool,
  className: string
}
