import React from 'react'
import { HYLO_URL_REGEX, personUrl } from 'util/navigation'

export default function ClickCatcher ({
  tag = 'span',
  handleMouseOver,
  navigate,
  ...props
}) {
  if (!['div', 'span', 'p'].includes(tag)) {
    throw new Error(`invalid tag for ClickCatcher: ${tag}`)
  }

  return React.createElement(tag, { ...props, onClick: handleClick(navigate) })
}

export const handleClick = navigate => event => {
  const node = event.target

  switch (node.nodeName.toLowerCase()) {
    case 'a': {
      // Legacy mention
      if (node.getAttribute('data-user-id') || node.getAttribute('data-search')) {
        event.preventDefault()
        navigate(node.getAttribute('href'))

        return
      }

      // Ordinary link handling
      if (node.getAttribute('target') !== '_blank') {
        node.setAttribute('target', '_blank')
      }

      const matches = [...node.getAttribute('href').matchAll(HYLO_URL_REGEX)]

      if (matches[0] && matches[0].length === 2) {
        event.preventDefault()
        const urlPath = matches[0][1] === '' ? '/' : matches[0][1]

        node.setAttribute('target', '_self')
        node.setAttribute('href', urlPath)
        navigate(node.getAttribute('href'))
      }

      return
    }
    case 'span': {
      if (node.getAttribute('data-id') || node.getAttribute('data-type') === 'mention') {
        event.preventDefault()
        navigate(personUrl(node.getAttribute('data-id')))
      }
    }
  }
}
