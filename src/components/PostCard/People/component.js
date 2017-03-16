import React from 'react'
import RoundImage from 'components/RoundImage'

export default function PeopleImages ({ imageUrls, className }) {
  const images = imageUrls.map(url =>
    <RoundImage url={url} key={url} medium overlaps />)
  return <div className={className}>{images}</div>
}
