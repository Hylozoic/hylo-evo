import React from 'react'
import PropTypes from 'prop-types'
import { filter, isEmpty } from 'lodash/fp'
import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './PostImageAttachments.scss'

export default function PostImageAttachments ({
  attachments
}) {
  const imageAttachments = filter({ type: 'image' }, attachments)

  if (isEmpty(imageAttachments)) return null

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    arrows: true,
    slidesToScroll: 1
  }

  return (
    <div styleName='images'>
      <Slider {...settings}>
        {imageAttachments.map(image => <img key={image.id} src={image.url} />)}
      </Slider>
    </div>
  )
}

PostImageAttachments.propTypes = {
  attachments: PropTypes.array.isRequired
}
