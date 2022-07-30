export const JOINED_GROUP = 'JOINED_GROUP'
export const LEFT_GROUP = 'LEFT_GROUP'
export const NAVIGATION = 'NAVIGATION'
export const EDITOR = {
  onChange: 'onChange',
  onAddTopic: 'onAddTopic',
  onEnter: 'onEnter',
  setContent: 'setContent'
}

export function sendMessageToWebView (type, data) {
  if (!(window && window.ReactNativeWebView)) {
    throw new Error('`window.ReactNativeWebView` was not found')
  }

  if (!type) {
    throw new Error('Must provide a message `type` when sending a message to the WebView')
  }

  window.ReactNativeWebView.postMessage(JSON.stringify({ type, data }))
}

export function sendMessageFromWebView (webViewRef, type, data) {
  if (!(webViewRef && webViewRef.current && webViewRef.current.postMessage)) {
    throw new Error('The first parameter `webViewRef` is empty or not valid')
  }

  if (!type) {
    throw new Error('Must provide a message `type` when sending a message from the WebView')
  }

  webViewRef.current.postMessage(JSON.stringify({ type, data }))
}

export function parseWebViewMessage (messageOrEvent) {
  return JSON.parse(messageOrEvent?.nativeEvent ? messageOrEvent.nativeEvent.data : messageOrEvent)
}
