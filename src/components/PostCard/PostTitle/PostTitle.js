import React from 'react'
import Highlight from 'components/Highlight'
import Icon from 'components/Icon'
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
      {location && <div styleName='headerLocation'><Icon name='Location' styleName='locationIcon' />{generalLocation}</div>}
    </React.Fragment>
  </Highlight>
}
