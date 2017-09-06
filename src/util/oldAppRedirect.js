function isiOSApp () {
  return window.navigator.userAgent.indexOf('Hylo-App') > -1
}

function iOSAppVersion () {
  return Number(window.navigator.userAgent.split('Hylo-App/')[1])
}

function isAndroidApp () {
  return typeof AndroidBridge !== 'undefined'
}

function androidAppVersion () {
  return Number(window.navigator.userAgent.split('Hylo-Android-App/')[1])
}

function isApp () {
  return isiOSApp() || isAndroidApp()
}

function appVersion () {
  return iOSAppVersion() || androidAppVersion()
}

export default function oldAppRedirect () {
  if (isApp() && appVersion() < 2) {
    window.location = '/newapp'
  }
}
