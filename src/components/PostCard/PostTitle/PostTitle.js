import React from 'react'
import Highlight from 'components/Highlight'
import './PostTitle.scss'

export default function PostTitle ({
  title,
  highlightProps,
  locationObject,
  location
}) {
  // Formatting location to display in stream view
  let generalLocation = location || ''

  if (locationObject) {
    if (locationObject.addressNumber !== null && locationObject.addressNumber !== '') {
      generalLocation = `${locationObject.addressNumber} ${locationObject.addressStreet}, ${locationObject.city}, ${locationObject.region}`
    } else {
      generalLocation = `${locationObject.city}, ${locationObject.region}`
    }
  }

  return <Highlight {...highlightProps}>
    <React.Fragment>
      <div styleName='title' className='hdr-headline'>{title}</div>
      {location && <div styleName='headerLocation'><span styleName='locationIcon'><img src='/location-pin-stream.svg' /></span>{generalLocation}</div>}
    </React.Fragment>
  </Highlight>
}
