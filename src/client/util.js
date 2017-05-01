export const loadScript = url => {
  var script = document.createElement('script')
  script.src = url
  const promise = new Promise((resolve, reject) => {
    script.onload = resolve
  })
  document.head.appendChild(script)
  return promise
}
