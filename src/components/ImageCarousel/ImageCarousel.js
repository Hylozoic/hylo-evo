import React from 'react'
import PropTypes from 'prop-types'
import Slider from 'react-slick'
import { filter } from 'lodash/fp'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './ImageCarousel.scss'

export default function ImageCarousel ({
  attachments
}) {
  const imageAttachments = filter({ type: 'image' }, attachments)

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    arrows: true,
    slidesToScroll: 1,
    adaptiveHeight: true
  }

  return (
    <div styleName='images'>
      <Slider {...settings}>
        {imageAttachments.map(image => <img src={image.url} />)}
      </Slider>
    </div>
  )
}

ImageCarousel.propTypes = {
  imageAttachments: PropTypes.array.isRequired
}
