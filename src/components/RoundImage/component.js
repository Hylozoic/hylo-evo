// RFC: Started out calling this Avatar, but renamed to RoundImage as it doesn't
// replicate all the functionality of Avatar from the current app. Imagining
// this component will be imported by the Avatar component.
// Not sure if this is too much granularity.

import React from 'react'
import cx from 'classnames'

const { string, bool } = React.PropTypes

export default function RoundImage ({ url, small, medium, overlaps, className }) {
  let styleName = cx('image', { overlaps, small, medium })
  // LEJ: Note use of bootstrap utility classes here
  className = cx(className, 'd-inline-block align-top img-thumbnail rounded-circle')
  return <div styleName={styleName}
    className={className}
    style={bgStyle(url)} />
}
RoundImage.propTypes = {
  url: string.isRequired,
  small: bool,
  medium: bool,
  overlaps: bool,
  className: string
}

function bgStyle (url) {
  if (!url) return {}
  const escaped = url.replace(/([\(\)])/g, (match, $1) => '\\' + $1) // eslint-disable-line
  return {backgroundImage: `url(${escaped})`}
}
