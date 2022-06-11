export const JOINED_GROUP = 'JOINED_GROUP'
export const LEFT_GROUP = 'LEFT_GROUP'
export const NAVIGATION = 'NAVIGATION'

export function sendMessageToWebView (type, data) {
  if (!type) throw new Error('Must provide a message `type` when sending a message to the WebView')

  window.ReactNativeWebView.postMessage(JSON.stringify({ type, data }))
}

export function parseWebViewMessage (message) {
  return JSON.parse(message.nativeEvent.data)
}
