import React from 'react'
import { capitalize } from 'lodash'
import FancyLink from 'components/FancyLink'
import { getSocialMedia, getWebsite, getAtAGlance } from 'store/selectors/farmExtensionSelectors'
import { FarmDetailSection } from '../FarmDetailsWidget/FarmDetailsWidget'
import './AtAGlanceWidget.scss'
import { sanitizeURL } from 'util/url'

export default function AtAGlanceWidget ({ group }) {
  /*
    - at a glance
    - website
    - social media
  */
  const socialMedia = sanitizeURL(getSocialMedia(group))
  const website = sanitizeURL(getWebsite(group))
  const atAGlance = getAtAGlance(group)

  return (
    <div styleName='at-a-glance-container'>
      {atAGlance.length > 0 && <FarmDetailSection items={atAGlance.map((item) => capitalize(item))} />}
      {website && <FancyLink iconName='Website' target='_blank' linkUrl={website} title={`Website for ${group.name}`} />}
      {socialMedia && <FancyLink iconName='Socials' target='_blank' linkUrl={socialMedia} title={`Social media link for ${group.name}`} />}
    </div>
  )
}
