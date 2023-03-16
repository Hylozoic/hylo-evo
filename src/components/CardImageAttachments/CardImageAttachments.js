import React from 'react'
import PropTypes from 'prop-types'
import { filter, isEmpty } from 'lodash/fp'
import { bgImageStyle } from 'util/index'
import './CardImageAttachments.scss'

export default function CardImageAttachments ({
  attachments,
  linked,
  className
}) {
  const imageAttachments = filter({ type: 'image' }, attachments)

  if (isEmpty(imageAttachments)) return null

  const firstImageUrl = imageAttachments[0].url
  const otherImageUrls = imageAttachments.slice(1).map(ia => ia.url)

  if (!firstImageUrl) return null

  return (
    <div className={className} styleName='image'>
      {linked ? <a href={firstImageUrl} target='_blank' rel='noreferrer'><img src={firstImageUrl} /></a> : <img src={firstImageUrl} />}
      <div styleName='others'>
        <div styleName='others-inner'>
          {!isEmpty(otherImageUrls) && otherImageUrls.map(url =>
            <a href={url} styleName='other' target='_blank' rel='noreferrer' key={url}>
              <div style={bgImageStyle(url)} />
            </a>)}
        </div>
      </div>
    </div>
  )
}

CardImageAttachments.propTypes = {
  attachments: PropTypes.array.isRequired,
  linked: PropTypes.bool,
  className: PropTypes.string
}
