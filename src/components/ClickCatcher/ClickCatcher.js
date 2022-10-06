import React from 'react'
import { useHistory } from 'react-router-dom'
import { PathHelpers } from 'hylo-shared'

export const HYLO_URL_REGEX = /^(https?:\/?\/?)?(www|staging\.)?(hylo\.com|localhost)(:?\d{0,6})(.*)/gi // https://regex101.com/r/0GZMny/1

export default function ClickCatcher ({ handleMouseOver, groupSlug, ...props }) {
  const history = useHistory()

  return React.createElement('span', { ...props, onClick: handleClick(history.push, groupSlug) })
}

export const handleClick = (push, groupSlug) => event => {
  const element = event.target

  switch (element?.nodeName.toLowerCase()) {
    case 'span': {
      if (element.classList.contains('mention')) {
        return push(PathHelpers.mentionPath(element.getAttribute('data-id'), groupSlug))
      }
      if (element.classList.contains('topic')) {
        return push(PathHelpers.topicPath(element.getAttribute('data-label'), groupSlug))
      }

      break
    }

    case 'a': {
      let pathname
      const hyloLinkMatch = element.getAttribute('href').matchAll(HYLO_URL_REGEX).next()

      if (hyloLinkMatch?.value && hyloLinkMatch?.value?.length === 6) {
        pathname = hyloLinkMatch.value[5] === '' ? '/' : hyloLinkMatch.value[5]
      }

      if (element.getAttribute('href').match(/^\//)) {
        pathname = element.getAttribute('href')
      }

      if (pathname) {
        event.preventDefault()

        return push(pathname)
      }

      element.setAttribute('target', '_blank')
    }
  }
}
