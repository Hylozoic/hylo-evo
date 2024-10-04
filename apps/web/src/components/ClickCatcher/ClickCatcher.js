import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PathHelpers, HYLO_URL_REGEX } from 'hylo-shared'

export default function ClickCatcher ({ handleMouseOver, groupSlug = 'all', onClick, ...props }) {
  const navigate = useNavigate()

  return React.createElement('span', { ...props, onClick: handleClick(navigate, groupSlug, onClick) })
}

export const handleClick = (navigate, groupSlug, onClick) => event => {
  const element = event.target

  switch (element?.nodeName.toLowerCase()) {
    case 'span': {
      if (element.classList.contains('mention')) {
        return navigate(PathHelpers.mentionPath(element.getAttribute('data-id'), groupSlug))
      }

      if (element.classList.contains('topic')) {
        return navigate(PathHelpers.topicPath(element.getAttribute('data-id'), groupSlug))
      }

      break
    }

    case 'a': {
      const href = element.getAttribute('href')

      /*
        Matches for local links and forwards pathname to react router
        The matching could instead be skipped, relying upon  the `hylo-link`
        class which is added by the backend for the same match.
      */
      if (href) {
        let pathname
        const hyloLinkMatch = href.matchAll(HYLO_URL_REGEX).next()

        if (hyloLinkMatch?.value && hyloLinkMatch?.value?.length === 6) {
          pathname = hyloLinkMatch.value[5] === '' ? '/' : hyloLinkMatch.value[5]
        }

        if (href.match(/^\//)) {
          pathname = href
        }

        if (pathname) {
          event.preventDefault()

          return navigate(pathname)
        }

        // default to external link
        element.setAttribute('target', '_blank')
      }

      break
    }

    default: {
      onClick && onClick(event)
    }
  }
}
