import React from 'react'
import RoundImage from 'common/RoundImage'

export default function PeopleImages ({ peopleImageUrls }) {
  const urls = peopleImageUrls.map(function (url) {
    return <RoundImage url={url} size='small' overlaps />
  })
  return <div >{urls}</div>
}
