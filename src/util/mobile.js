import isMobile from 'ismobilejs'

export const APP_STORE_APP_URL = 'https://appsto.re/us/0gcV7.i'
export const GOOGLE_PLAY_APP_URL = 'https://play.google.com/store/apps/details?id=com.hylo.hyloandroid'

export function mobileRedirect () {
  const inviteApp = isMobileDevice()
  if (inviteApp) {
    if (isMobile.apple.device) {
      return APP_STORE_APP_URL
    } else if (isMobile.android.device) {
      return GOOGLE_PLAY_APP_URL
    }
  }
}

// This I believe could just be an exportable constant
// leaving as function for now
export function isMobileDevice () {
  return (
    isMobile.apple.phone ||
    isMobile.apple.ipod ||
    isMobile.android.phone ||
    isMobile.seven_inch
  )
}

export function downloadApp () {
  if (isMobileDevice()) {
    if (isMobile.apple.device) {
      window.open(APP_STORE_APP_URL, '_blank')
    } else if (isMobile.android.device) {
      window.open(GOOGLE_PLAY_APP_URL, '_blank')
    } else {
      return false
    }
  }
}
