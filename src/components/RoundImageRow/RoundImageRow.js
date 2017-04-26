import React from 'react'
import RoundImage from 'components/RoundImage'
import './RoundImageRow.scss'

const { array, string } = React.PropTypes

export default function RoundImageRow ({ imageUrls, className }) {
  const images = imageUrls.map((url, i) =>
    <RoundImage url={url} key={i} medium overlaps />)
  return <div className={className}>{images}</div>
}
RoundImageRow.propTypes = {
  imageUrls: array,
  className: string
}
