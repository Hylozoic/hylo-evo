import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { filter, isEmpty } from 'lodash/fp'
import ModalDialog from 'components/ModalDialog'
import ImageCarousel from 'components/ImageCarousel'
import './CardImageAttachments.scss'

export default function CardImageAttachments ({
  attachments,
  className
}) {
  const imageAttachments = filter({ type: 'image' }, attachments)

  if (isEmpty(imageAttachments)) return null

  const firstImageUrl = imageAttachments[0].url
  const otherImageUrls = imageAttachments.slice(1).map(ia => ia.url)

  if (!firstImageUrl) return null

  const [initialSlide, setInitialSlide] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const toggleModal = (e) => {
    setInitialSlide(e?.target.dataset.index || 0)
    setModalVisible(!modalVisible)
  }

  const modalSettings = {
    showCancelButton: false,
    submitButtonText: 'Close',
    showModalTitle: false,
    closeModal: toggleModal,
    style: { width: '100%', maxWidth: '1024px' }
  }

  return (
    <>
      <div className={className} styleName='image'>
        <img
          src={firstImageUrl}
          alt='Attached image 1'
          data-index={0}
          onClick={toggleModal}
        />
        <div styleName='others'>
          <div styleName='others-inner'>
            {!isEmpty(otherImageUrls) && otherImageUrls.map((url, index) =>
              <img
                styleName='other'
                data-index={index + 1}
                src={url}
                alt={`Attached image ${index + 2}`}
                key={index}
                onClick={toggleModal}
              />
            )}
          </div>
        </div>
      </div>
      {modalVisible && <ModalDialog {...modalSettings}>
        <ImageCarousel attachments={imageAttachments} initialSlide={initialSlide} />
      </ModalDialog>}
    </>
  )
}

CardImageAttachments.propTypes = {
  attachments: PropTypes.array.isRequired,
  linked: PropTypes.bool,
  className: PropTypes.string
}
