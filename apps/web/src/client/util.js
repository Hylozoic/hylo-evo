// This is the id of the root element in the index.html file
export const rootDomId = 'root'

export const loadScript = url => {
  const script = document.createElement('script')
  script.src = url
  const promise = new Promise((resolve, reject) => {
    script.onload = resolve
  })
  document.head.appendChild(script)
  return promise
}
