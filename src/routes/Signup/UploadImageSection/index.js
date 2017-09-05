import React from 'react'
import ChangeImageButton from 'components/ChangeImageButton'
import { avatarUploadSettings } from 'store/models/Me'
import { cameraSvg, loadingSvg } from 'util/assets'
import { bgImageStyle } from 'util/index'
import '../Signup.scss'

export default function UploadImage ({avatarUrl, currentUser, updateSettingDirectly, loading}) {
  return <ChangeImageButton
    update={updateSettingDirectly('avatarUrl')}
    uploadSettings={avatarUploadSettings(currentUser)}
    styleName='change-avatar-button'
    child={uploadAvatar(currentUser, loading, avatarUrl)}
  />
}

export function uploadAvatar (currentUser, loading, avatarUrl) {
  let imageUrl = cameraSvg
  let styleName = 'upload-background-image'

  if (currentUser.avatarUrl) {
    imageUrl = currentUser.avatarUrl
    styleName = 'upload-background-image contain'
  }
  if (avatarUrl) {
    imageUrl = avatarUrl
    styleName = 'upload-background-image contain'
  }
  if (loading) {
    imageUrl = loadingSvg
    styleName = 'loading-background-image'
  }
  return <div styleName='image-upload-icon'>
    <div style={bgImageStyle(imageUrl)} styleName={styleName} />
  </div>
}
