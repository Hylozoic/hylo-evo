import React from 'react'
import PropTypes from 'prop-types'
import Slider from 'react-slick'
import { filter, isEmpty } from 'lodash/fp'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './ImageCarousel.scss'

export default function ImageCarousel ({
  attachments,
  initialSlide = 0
}) {
  const imageAttachments = filter({ type: 'image' }, attachments)
  if (isEmpty(imageAttachments)) return null

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    arrows: true,
    slidesToScroll: 1,
    adaptiveHeight: true,
    initialSlide: parseInt(initialSlide)
  }

  return (
    <div styleName='images'>
      <Slider {...settings}>
        {imageAttachments.map((image, index) =>
          <img
            src={image.url}
            alt={`Attached image ${index + 1}`}
            key={index}
            data-testid={`sc-img${index}`}
          />
        )}
      </Slider>
    </div>
  )
}

ImageCarousel.propTypes = {
  attachments: PropTypes.array.isRequired
}
