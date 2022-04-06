import React from 'react'
import { capitalize } from 'lodash'
import FancyLink from 'components/FancyLink'
import { getSocialMedia, getWebsite, getAtAGlance } from 'store/selectors/farmExtensionSelectors'
import { FarmDetailSection } from '../FarmDetailsWidget/FarmDetailsWidget'
import './AtAGlanceWidget.scss'

export default function AtAGlanceWidget ({ group }) {
  /*
    - at a glance
    - website
    - social media
  */
  const socialMedia = getSocialMedia(group)
  const website = getWebsite(group)
  const atAGlance = getAtAGlance(group)

  return (
    <div styleName='at-a-glance-container'>
      {atAGlance.length > 0 && <FarmDetailSection items={atAGlance.map((item) => capitalize(item))} />}
      {website && <FancyLink iconName='Info' linkUrl={website} title={`Website for ${group.name}`} />}
      {socialMedia && <FancyLink iconName='Share' linkUrl={socialMedia} title={`Social media link for ${group.name}`} />}
    </div>
  )
}
