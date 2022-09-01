import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { ImEnlarge, ImShrink } from 'react-icons/im'
import { bgImageStyle } from 'util/index'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import cx from 'classnames'
import './LinkPreview.scss'

export default function LinkPreview ({ loading, featured: providedFeatured, ...props }) {
  const [isVideo, setIsVideo] = useState()
  const [featured, setFeatured] = useState()
  const { linkPreview, onClose, onFeatured, className } = props
  const url = linkPreview?.url

  const toggleFeatured = () => {
    setFeatured(!featured)
    onFeatured(!featured)
  }

  useEffect(() => {
    if (url) {
      const isVideo = ReactPlayer.canPlay(url)

      setIsVideo(isVideo)

      if (typeof providedFeatured !== 'undefined') {
        setFeatured(providedFeatured)
      } else {
        setFeatured(isVideo)
        onFeatured(isVideo)
      }
    }
  }, [url, providedFeatured])

  if (loading) return <Loading />

  const { title, description, imageUrl } = linkPreview
  const imageStyle = bgImageStyle(imageUrl)
  const domain = url && new URL(url).hostname.replace('www.', '')

  return (
    <>
      <div styleName='container' className={className}>
        {featured && (
          <span styleName='featured'>
            <span><strong>Featured:</strong> This video will be full-width, displayed above the description, and playable.</span>
          </span>
        )}
        <div styleName='link-preview'>
          {imageUrl && (
            <div style={imageStyle} styleName='image'>
              {isVideo && !featured && (
                <ImEnlarge styleName={cx('feature-button', { featured })} onClick={toggleFeatured} />
              )}
              {isVideo && featured && (
                <ImShrink styleName={cx('feature-button', { featured })} onClick={toggleFeatured} />
              )}
            </div>
          )}
          <div styleName='text'>
            <div styleName='header'>
              <span styleName='title'>{title}</span>
              <span onClick={onClose} styleName='close'>
                <Icon name='Ex' styleName='icon' />
              </span>
            </div>
            <div styleName='description'>{description}</div>
            <div styleName='domain'>{domain}</div>
          </div>
        </div>
      </div>
    </>
  )
}
