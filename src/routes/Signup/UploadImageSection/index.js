import React from 'react'
import ChangeImageButton from 'components/ChangeImageButton'
import { cameraSvg, loadingSvg } from 'utils/assets'
import { bgImageStyle } from 'utils/index'
import '../Signup.scss'

export default function UploadImage ({avatarUrl, currentUser, updateSettingDirectly, loading}) {
  return <ChangeImageButton
    update={updateSettingDirectly('avatarUrl')}
    uploadSettings={{type: 'userAvatar', id: currentUser.id}}
    styleName='change-avatar-button'>
    {uploadAvatar(currentUser, loading, avatarUrl)}
  </ChangeImageButton>
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
