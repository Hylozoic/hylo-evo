import PropTypes from 'prop-types'
import React from 'react'
import RoundImage from 'components/RoundImage'
import cx from 'classnames'
import classes from './RoundImageRow.module.scss'

const { array, string, bool } = PropTypes

export default function RoundImageRow ({
  ascending,
  blue,
  cap,
  className,
  count,
  imageUrls = [],
  inline = false,
  small,
  tiny,
  vertical,
  ...rest
}) {
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
      small={small}
      tiny={tiny}
      overlaps={!vertical}
      overlapsVertical={vertical}
      className={classes.image}
      style={zIndexStyle(i)} />)

  const plus = <div className={cx(classes[!inline ? 'plus' : 'plusInline'], classes[blue ? 'blue' : 'green'])} key='plus' style={zIndexStyle(imageUrls.length)} >
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
