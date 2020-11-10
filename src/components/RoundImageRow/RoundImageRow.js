import PropTypes from 'prop-types'
import React from 'react'
import RoundImage from 'components/RoundImage'
import './RoundImageRow.scss'

const { array, string, bool } = PropTypes

export default function RoundImageRow ({ imageUrls = [], inline = false, className, vertical, cap, ascending, ...rest }) {
  var capped
  var extra
  if (cap && cap < imageUrls.length) {
    capped = true
    extra = imageUrls.length - cap
    imageUrls = imageUrls.slice(0, cap)
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

  const plus = <div styleName={!inline ? 'plus' : 'plus-inline'} key='plus' style={zIndexStyle(imageUrls.length)} >
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
