import React from 'react'
import Highlight from 'components/Highlight'
import cx from 'classnames'
import Icon from 'components/Icon'
import './PostTitle.scss'

export default function PostTitle ({
  title,
  constrained,
  highlightProps,
  locationObject,
  location,
  onClick
}) {
  // Formatting location to display in stream view
  let generalLocation = location || ''
  if (locationObject) {
    if (locationObject.addressNumber) {
      generalLocation = `${locationObject.addressNumber} ${locationObject.addressStreet}, ${locationObject.city}, ${locationObject.region}`
    } else if (locationObject.city) {
      generalLocation = `${locationObject.city}, ${locationObject.region}`
    } else if (locationObject.fullText) {
      generalLocation = locationObject.fullText
    } else if (locationObject.center) {
      generalLocation = `${locationObject.center.lat}, ${locationObject.center.lng}`
    }
  }

  return <Highlight {...highlightProps}>
    <React.Fragment>
      <div onClick={onClick} styleName={cx('title', { constrained })} className='hdr-headline'>{title}</div>
      {location && <div styleName={cx('headerLocation', { constrained })}><Icon name='Location' styleName='locationIcon' />{generalLocation}</div>}
    </React.Fragment>
  </Highlight>
}
