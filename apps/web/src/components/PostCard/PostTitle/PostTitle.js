import React from 'react'
import { LocationHelpers } from 'hylo-shared'
import Highlight from 'components/Highlight'
import cx from 'classnames'
import Icon from 'components/Icon'
import classes from './PostTitle.module.scss'

export default function PostTitle ({
  constrained,
  highlightProps,
  locationObject,
  location,
  onClick,
  title,
  type,
  ...post
}) {
  // Formatting location to display in stream view
  const generalLocation = LocationHelpers.generalLocationString(locationObject, location || '')

  return <Highlight {...highlightProps}>
    <React.Fragment>
      <div onClick={onClick} className={cx(classes.title, { [classes.constrained]: constrained }, 'hdr-headline')}>{title}</div>
      {type !== 'event' && location && <div className={cx(classes.headerLocation, { [classes.constrained]: constrained })}>
        <Icon name='Location' className={classes.locationIcon} />
        {generalLocation}
      </div>}
    </React.Fragment>
  </Highlight>
}
