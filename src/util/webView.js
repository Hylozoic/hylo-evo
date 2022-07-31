export function sendMessageToWebView (type, data) {
  if (!(window?.ReactNativeWebView)) {
    throw new Error('`window.ReactNativeWebView` was not found')
  }

  if (!type) {
    throw new Error('Must provide a message `type` when sending a message to the WebView')
  }

  window.ReactNativeWebView.postMessage(JSON.stringify({ type, data }))
}
