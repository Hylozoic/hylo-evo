import cx from 'classnames'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { filter, isEmpty } from 'lodash/fp'
import ModalDialog from 'components/ModalDialog'
import ImageCarousel from 'components/ImageCarousel'
import classes from './CardImageAttachments.module.scss'

export default function CardImageAttachments ({
  attachments,
  className,
  isFlagged
}) {
  const imageAttachments = filter({ type: 'image' }, attachments)

  if (isEmpty(imageAttachments)) return null

  const firstImageUrl = imageAttachments[0].url
  const otherImageUrls = imageAttachments.slice(1).map(ia => ia.url)

  if (!firstImageUrl) return null

  const [initialSlide, setInitialSlide] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const toggleModal = (e) => {
    if (className === 'post-card') return
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
      <div className={cx(className, classes.image)}>
        <img
          src={firstImageUrl}
          alt='Attached image 1'
          data-index={0}
          onClick={toggleModal}
        />
        <div className={classes.others}>
          <div className={classes.othersInner}>
            {!isEmpty(otherImageUrls) && otherImageUrls.map((url, index) =>
              <img
                className={classes.other}
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
