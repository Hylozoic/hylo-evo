import React from 'react'
import Highlight from 'components/Highlight'
import './PostTitle.scss'

export default function PostTitle ({
  title,
  highlightProps,
  location,
  locationText
}) {
  // Formatting location to display in stream view
  let generalLocation = locationText || ''

  if (location) {
    if (location.addressNumber !== null && location.addressNumber !== '') {
      generalLocation = `${location.addressNumber} ${location.addressStreet}, ${location.city}, ${location.region}`
    } else {
      generalLocation = `${location.city}, ${location.region}`
    }
  }

  return <Highlight {...highlightProps}>
    <div styleName='title' className='hdr-headline'>{title}</div>
    {locationText && <div styleName='headerLocation'><span styleName='locationIcon'><img src='/location-pin-stream.svg' /></span>{generalLocation}</div>}
  </Highlight>
}
