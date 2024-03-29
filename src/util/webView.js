export function sendMessageToWebView (type, data) {
  if (!type) {
    throw new Error('Must provide a message `type` when sending a message to the WebView')
  }

  isWebView() && window.ReactNativeWebView.postMessage(JSON.stringify({ type, data }))
}

export default function isWebView () {
  return typeof window !== 'undefined' && window.ReactNativeWebView
}
