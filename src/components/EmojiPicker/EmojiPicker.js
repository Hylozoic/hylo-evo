import cx from 'classnames'
import Picker from '@emoji-mart/react'
import React, { useState, useEffect } from 'react'
import Icon from 'components/Icon'

import './EmojiPicker.scss'

const PICKER_DEFAULT_WIDTH = 373
const PICKER_DEFAULT_HEIGHT = 435
const DEFAULT_TOPNAV_HEIGHT = 56
const emojiPickerMaxY = PICKER_DEFAULT_HEIGHT + DEFAULT_TOPNAV_HEIGHT

export default function EmojiPicker (props) {
  const { handleRemoveReaction, myEmojis, handleReaction, forReactions = true, emoji } = props
  const [modalOpen, setModalOpen] = useState(false)
  const [modalY, setModalY] = useState()
  const [modalX, setModalX] = useState()

  const handleClick = (data) => {
    const selectedEmoji = data.native
    if (myEmojis.includes(selectedEmoji)) {
      handleRemoveReaction(selectedEmoji)
    } else {
      handleReaction(selectedEmoji)
    }
    setModalOpen(!modalOpen)
    return true
  }

  const handleSelection = (data) => {
    const selectedEmoji = data.native
    handleReaction(selectedEmoji)
    setModalOpen(!modalOpen)
  }

  const toggleModalOpen = (evt) => {
    let yAdjustment = 0
    let xAdjustment = 0
    if (modalOpen) {
      setModalOpen(!modalOpen)
    } else {
      // push the modal up, but not so high that it comes off the top of the screen
      yAdjustment = (emojiPickerMaxY > evt.clientY) ? DEFAULT_TOPNAV_HEIGHT : evt.clientY - PICKER_DEFAULT_HEIGHT
      // Have the modal replicate the x position, unless it is too close to the right side of the screen
      xAdjustment = (window.innerWidth - PICKER_DEFAULT_WIDTH < evt.clientX) ? window.innerWidth - PICKER_DEFAULT_WIDTH : evt.clientX + 10
      setModalY(yAdjustment)
      setModalX(xAdjustment)
      setModalOpen(!modalOpen)
    }
  }

  return forReactions
    ? (
      <div styleName='emoji-picker-container' className={props.className}>
        <div styleName='emoji-picker-toggle' onClick={toggleModalOpen}>
          <Icon name='Smiley' styleName='picker-icon' />
        </div>
        {modalOpen &&
          <div style={{ top: modalY, left: modalX }} styleName={cx('emoji-options')}>
            <EmojiPickerContent {...props} onClickOutside={toggleModalOpen} onEmojiSelect={handleClick} />
          </div>}
      </div>
    )
    : (
      <div onClick={toggleModalOpen} styleName='emoji-picker-container' className={props.className}>
        {emoji || '?'}
        {modalOpen &&
          <div style={{ top: modalY, left: modalX }} styleName={cx('emoji-options')}>
            <EmojiPickerContent {...props} onClickOutside={toggleModalOpen} onEmojiSelect={handleSelection} />
          </div>}
      </div>
    )
}

function EmojiPickerContent (props) {
  const [data, setData] = useState()
  useEffect(() => {
    const getData = async () => {
      const response = await window.fetch(
        'https://cdn.jsdelivr.net/npm/@emoji-mart/data'
      )
      setData(response.json())
    }
    getData()
  }, [])
  return (
    <Picker {...props} theme={'light'} data={data} />
  )
}
