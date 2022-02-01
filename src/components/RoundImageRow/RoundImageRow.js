import PropTypes from 'prop-types'
import React from 'react'
import RoundImage from 'components/RoundImage'
import cx from 'classnames'
import './RoundImageRow.scss'

const { array, string, bool } = PropTypes

export default function RoundImageRow ({ imageUrls = [], inline = false, className, vertical, cap, ascending, count, blue, ...rest }) {
  var capped
  var extra
  if (cap && cap < imageUrls.length) {
    capped = true
    extra = imageUrls.length - cap
    imageUrls = imageUrls.slice(0, cap)
  }

  if (count && count > imageUrls.length) {
    capped = true
    extra = count - imageUrls.length
  }

  const zIndexStyle = i => ascending ? { zIndex: i } : { zIndex: imageUrls.length - i }

  const images = imageUrls.map((url, i) =>
    <RoundImage
      url={url}
      key={i}
      medium
      overlaps={!vertical}
      overlapsVertical={vertical}
      styleName='image'
      style={zIndexStyle(i)} />)

  const plus = <div styleName={cx(!inline ? 'plus' : 'plus-inline', blue ? 'blue' : 'green')} key='plus' style={zIndexStyle(imageUrls.length)} >
    +{extra}
  </div>

  return <div className={className} {...rest} >
    {capped ? images.concat([plus]) : images}
  </div>
}
RoundImageRow.propTypes = {
  imageUrls: array,
  className: string,
  vertical: bool
}
