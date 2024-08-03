import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import Slider from 'react-slick'
import { filter, isEmpty } from 'lodash/fp'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import styles from './ImageCarousel.scss'

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

  const carouselRef = useRef()
  const slickRef = useRef()

  const handleKeydown = event => {
    if (event.code === 'ArrowLeft') slickRef.current.slickPrev()
    if (event.code === 'ArrowRight') slickRef.current.slickNext()
  }

  return (
    <div styleName='images' ref={carouselRef} onKeydown={handleKeydown}>
      <Slider ref={slickRef} {...settings}>
        {imageAttachments.map((image, index) =>
          <div className={styles.imageWrapper} key={index} data-testid={`sc-img${index}`}>
            <img
              src={image.url}
              alt={`Attached image ${index + 1}`}
            />
          </div>
        )}
      </Slider>
    </div>
  )
}

ImageCarousel.propTypes = {
  attachments: PropTypes.array.isRequired
}
