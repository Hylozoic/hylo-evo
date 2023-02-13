import React from 'react'
import { LocationHelpers } from 'hylo-shared'
import Highlight from 'components/Highlight'
import cx from 'classnames'
import Icon from 'components/Icon'
import './PostTitle.scss'

export default function PostTitle ({
  constrained,
  highlightProps,
  locationObject,
  location,
  onClick,
  title,
  type
}) {
  // Formatting location to display in stream view
  const generalLocation = LocationHelpers.generalLocationString(locationObject, location || '')

  return <Highlight {...highlightProps}>
    <React.Fragment>
      <div onClick={onClick} styleName={cx('title', { constrained })} className='hdr-headline'>{title}</div>
      {type !== 'event' && location && <div styleName={cx('headerLocation', { constrained })}><Icon name='Location' styleName='locationIcon' />{generalLocation}</div>}
    </React.Fragment>
  </Highlight>
}
