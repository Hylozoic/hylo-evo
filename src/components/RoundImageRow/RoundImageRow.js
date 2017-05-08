import React from 'react'
import RoundImage from 'components/RoundImage'
import './RoundImageRow.scss'

const { array, string, bool } = React.PropTypes

export default function RoundImageRow ({ imageUrls = [], className, vertical, cap }) {
  var capped
  var extra
  if (cap && cap < imageUrls.length) {
    capped = true
    extra = imageUrls.length - cap
    imageUrls = imageUrls.slice(0, cap)
  }
  const images = imageUrls.map((url, i) =>
    <RoundImage url={url} key={i} medium overlaps={!vertical} overlapsVertical={vertical} />)

  const plus = <div styleName='plus' key='plus'>+{extra}</div>
  return <div className={className}>
    {capped ? images.concat([plus]) : images}
  </div>
}
RoundImageRow.propTypes = {
  imageUrls: array,
  className: string,
  vertical: bool
}
