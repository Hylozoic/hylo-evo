import PropTypes from 'prop-types';
import React from 'react'
import RoundImage from 'components/RoundImage'
import './RoundImageRow.scss'

const { array, string, bool } = PropTypes

export default function RoundImageRow ({ imageUrls = [], className, vertical, cap, ascending }) {
  var capped
  var extra
  if (cap && cap < imageUrls.length) {
    capped = true
    extra = imageUrls.length - cap
    imageUrls = imageUrls.slice(0, cap)
  }

  const zIndexStyle = i => ascending ? {zIndex: i} : {zIndex: imageUrls.length - i}

  const images = imageUrls.map((url, i) =>
    <RoundImage
      url={url}
      key={i}
      medium
      overlaps={!vertical}
      overlapsVertical={vertical}
      styleName='image'
      style={zIndexStyle(i)} />)

  const plus = <div styleName='plus' key='plus' style={zIndexStyle(imageUrls.length)} >
    +{extra}
  </div>

  return <div className={className}>
    {capped ? images.concat([plus]) : images}
  </div>
}
RoundImageRow.propTypes = {
  imageUrls: array,
  className: string,
  vertical: bool
}
