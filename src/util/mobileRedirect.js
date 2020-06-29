import isMobile from 'ismobilejs'

export const APP_STORE_APP_URL = 'https://appsto.re/us/0gcV7.i'
export const GOOGLE_PLAY_APP_URL = 'https://play.google.com/store/apps/details?id=com.hylo.hyloandroid'

export default function mobileRedirect () {

  const inviteApp = (
    isMobile.apple.phone ||
    isMobile.apple.ipod ||
    isMobile.android.phone ||
    isMobile.seven_inch
  )

  if (inviteApp) {
    if (isMobile.apple.device) {
      return APP_STORE_APP_URL
    } else if (isMobile.android.device) {
      return GOOGLE_PLAY_APP_URL
    }
  }
}
